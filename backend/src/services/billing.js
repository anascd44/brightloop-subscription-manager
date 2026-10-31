const db = require('../config/db');
const round = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
function nextPeriod(start, interval) {
  const d = new Date(`${start}T00:00:00Z`);
  if (interval === 'DAILY') d.setUTCDate(d.getUTCDate() + 1);
  else if (interval === 'WEEKLY') d.setUTCDate(d.getUTCDate() + 7);
  else if (interval === 'YEARLY') d.setUTCFullYear(d.getUTCFullYear() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString().slice(0, 10);
}
async function generateInvoice(subscriptionId, periodStart) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const s = await client.query(`SELECT s.*,p.billing_interval,p.name AS plan_name FROM subscriptions s
      JOIN plans p ON p.id=s.plan_id WHERE s.id=$1 FOR UPDATE`, [subscriptionId]);
    if (!s.rowCount) throw Object.assign(new Error('Subscription not found'), { status: 404 });
    const sub = s.rows[0];
    if (!['CONFIRMED','ACTIVE'].includes(sub.status)) throw Object.assign(new Error('Only confirmed or active subscriptions can be invoiced'), { status: 400 });
    const start = periodStart || sub.next_billing_date || sub.start_date;
    const end = nextPeriod(start, sub.billing_interval);
    const existing = await client.query('SELECT id FROM invoices WHERE subscription_id=$1 AND period_start=$2', [subscriptionId, start]);
    if (existing.rowCount) throw Object.assign(new Error('Invoice already exists for this billing period'), { status: 409 });
    const items = await client.query(`SELECT si.*,p.name AS product_name FROM subscription_items si JOIN products p ON p.id=si.product_id WHERE si.subscription_id=$1`, [subscriptionId]);
    if (!items.rowCount) throw Object.assign(new Error('Subscription has no items'), { status: 400 });
    let subtotal = 0;
    const lineData = [];
    for (const item of items.rows) {
      const lineSubtotal = round(Number(item.quantity) * Number(item.unit_price));
      const taxResult = await client.query(`SELECT rate,is_inclusive FROM tax_rules WHERE is_active=true AND (product_id=$1 OR product_id IS NULL)
        AND (starts_at IS NULL OR starts_at<=CURRENT_DATE) AND (ends_at IS NULL OR ends_at>=CURRENT_DATE)
        ORDER BY product_id NULLS LAST LIMIT 1`, [item.product_id]);
      const taxRate = taxResult.rowCount ? Number(taxResult.rows[0].rate) : 0;
      const inclusive = taxResult.rowCount && taxResult.rows[0].is_inclusive;
      const taxAmount = round(inclusive ? lineSubtotal - (lineSubtotal / (1 + taxRate / 100)) : lineSubtotal * taxRate / 100);
      subtotal += inclusive ? lineSubtotal - taxAmount : lineSubtotal;
      lineData.push({ ...item, lineSubtotal, taxRate, taxAmount, lineTotal: inclusive ? lineSubtotal : lineSubtotal + taxAmount });
    }
    subtotal = round(subtotal);
    let discountAmount = 0;
    if (sub.discount_rule_id) {
      const d = await client.query(`SELECT * FROM discount_rules WHERE id=$1 AND is_active=true
        AND (starts_at IS NULL OR starts_at<=CURRENT_DATE) AND (ends_at IS NULL OR ends_at>=CURRENT_DATE)
        AND (usage_limit IS NULL OR used_count<usage_limit) FOR UPDATE`, [sub.discount_rule_id]);
      if (d.rowCount && subtotal >= Number(d.rows[0].min_amount)) {
        discountAmount = d.rows[0].discount_type === 'PERCENTAGE' ? subtotal * Number(d.rows[0].value) / 100 : Number(d.rows[0].value);
        discountAmount = round(Math.min(discountAmount, subtotal));
        await client.query('UPDATE discount_rules SET used_count=used_count+1 WHERE id=$1', [sub.discount_rule_id]);
      }
    }
    const taxAmount = round(lineData.reduce((sum, x) => sum + x.taxAmount, 0));
    const total = round(Math.max(0, subtotal - discountAmount + taxAmount));
    const due = new Date(`${start}T00:00:00Z`); due.setUTCDate(due.getUTCDate() + Number(sub.payment_terms_days));
    const invoiceNumber = `INV-${Date.now()}`;
    const inv = await client.query(`INSERT INTO invoices(invoice_number,subscription_id,period_start,period_end,due_date,subtotal,discount_amount,tax_amount,total_amount)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [invoiceNumber, subscriptionId, start, end, due.toISOString().slice(0,10), subtotal, discountAmount, taxAmount, total]);
    for (const x of lineData) await client.query(`INSERT INTO invoice_items(invoice_id,product_id,description,quantity,unit_price,line_subtotal,tax_rate,tax_amount,line_total)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [inv.rows[0].id, x.product_id, x.product_name, x.quantity, x.unit_price, x.lineSubtotal, x.taxRate, x.taxAmount, x.lineTotal]);
    await client.query('UPDATE subscriptions SET next_billing_date=$1,updated_at=NOW() WHERE id=$2', [end, subscriptionId]);
    await client.query('COMMIT');
    return inv.rows[0];
  } catch (err) { await client.query('ROLLBACK'); throw err; }
  finally { client.release(); }
}
module.exports = { generateInvoice, nextPeriod };
