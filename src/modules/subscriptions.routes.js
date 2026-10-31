import { Router } from 'express';
import { body } from 'express-validator';
import { pool, query } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { success, failure } from '../utils/apiResponse.js';
const router=Router();
router.post('/',[body('customer_id').isUUID(),body('plan_id').isUUID(),body('start_date').isISO8601(),body('billing_cycle').isIn(['monthly','quarterly','yearly']),body('quantity').optional().isInt({min:1})],validate,async(req,res,next)=>{
 const client=await pool.connect();try{
  await client.query('BEGIN');const {customer_id,plan_id,start_date,billing_cycle,quantity=1}=req.body;
  const p=await client.query('SELECT id,name,price,currency,is_active FROM plans WHERE id=$1 FOR SHARE',[plan_id]);if(!p.rowCount||!p.rows[0].is_active){await client.query('ROLLBACK');return failure(res,'Plan not found or inactive',404);}
  const c=await client.query('SELECT id FROM customers WHERE id=$1',[customer_id]);if(!c.rowCount){await client.query('ROLLBACK');return failure(res,'Customer not found',404);}
  const amount=(Number(p.rows[0].price)*quantity).toFixed(2);const cycleMonths={monthly:1,quarterly:3,yearly:12}[billing_cycle];const start=new Date(start_date);const end=new Date(start);end.setMonth(end.getMonth()+cycleMonths);
  const s=await client.query(`INSERT INTO subscriptions(customer_id,plan_id,status,billing_cycle,quantity,start_date,current_period_start,current_period_end,unit_price) VALUES($1,$2,'active',$3,$4,$5,$5,$6,$7) RETURNING *`,[customer_id,plan_id,billing_cycle,quantity,start.toISOString().slice(0,10),end.toISOString().slice(0,10),p.rows[0].price]);
  const invoiceNo=`BL-${Date.now()}`;const inv=await client.query(`INSERT INTO invoices(subscription_id,customer_id,invoice_number,status,issue_date,due_date,subtotal,tax_total,total,currency) VALUES($1,$2,$3,'open',CURRENT_DATE,CURRENT_DATE + INTERVAL '7 days',$4,0,$4,$5) RETURNING *`,[s.rows[0].id,customer_id,invoiceNo,amount,p.rows[0].currency]);
  await client.query('COMMIT');return success(res,'Subscription and initial invoice created',{subscription:s.rows[0],invoice:inv.rows[0]},201);
 }catch(e){await client.query('ROLLBACK');next(e);}finally{client.release();}
});
router.get('/',async(req,res,next)=>{try{const r=await query(`SELECT s.*,c.name AS customer_name,p.name AS plan_name FROM subscriptions s JOIN customers c ON c.id=s.customer_id JOIN plans p ON p.id=s.plan_id ORDER BY s.created_at DESC`);return success(res,'Subscriptions retrieved',r.rows);}catch(e){next(e);}});
router.patch('/:id/cancel',[body('reason').optional().isString().isLength({max:500})],validate,async(req,res,next)=>{try{const r=await query(`UPDATE subscriptions SET status='cancelled',cancelled_at=NOW(),cancellation_reason=$1,updated_at=NOW() WHERE id=$2 AND status='active' RETURNING *`,[req.body.reason||null,req.params.id]);return r.rowCount?success(res,'Subscription cancelled',r.rows[0]):failure(res,'Active subscription not found',404);}catch(e){next(e);}});
export default router;
