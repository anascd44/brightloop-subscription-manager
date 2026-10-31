import { Router } from 'express';
import { resourceRouter } from '../modules/resourceFactory.js';
import subscriptions from '../modules/subscriptions.routes.js';
import reports from '../modules/reports.routes.js';
import staff from '../modules/staff.routes.js';
const router=Router();
const resources={
 products:['products',['name','description','is_active'],['name']],
 variants:['variants',['product_id','name','sku','price','currency','is_active'],['name','sku']],
 plans:['plans',['name','description','price','currency','billing_interval','billing_interval_count','is_active'],['name']],
 taxes:['taxes',['name','rate','country_code','is_active'],['name','country_code']],
 discounts:['discounts',['name','code','discount_type','discount_value','starts_at','ends_at','max_redemptions','is_active'],['name','code']],
 customers:['customers',['name','email','phone','company_name','billing_address','is_active'],['name','email','company_name']],
 quotations:['quotations',['customer_id','quote_number','status','valid_until','subtotal','tax_total','total','currency','notes'],['quote_number','status']],
 invoices:['invoices',['subscription_id','customer_id','invoice_number','status','issue_date','due_date','subtotal','tax_total','total','currency'],['invoice_number','status']],
 payments:['payments',['invoice_id','customer_id','amount','currency','status','payment_method','transaction_reference','paid_at'],['transaction_reference','status']]
};
for(const [path,[table,fields,searchable]] of Object.entries(resources)) router.use(`/${path}`,resourceRouter({table,fields,searchable}));
router.use('/staff',staff);router.use('/subscriptions',subscriptions);router.use('/reports',reports);
export default router;
