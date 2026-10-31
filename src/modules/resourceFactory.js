import { Router } from 'express';
import { query } from '../config/db.js';
import { success, failure } from '../utils/apiResponse.js';
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function resourceRouter({ table, fields, searchable = [], orderBy = 'created_at' }) {
  const router = Router();
  router.get('/', async (req,res,next) => {
    try {
      const page=Math.max(1,Number.parseInt(req.query.page)||1), limit=Math.min(100,Math.max(1,Number.parseInt(req.query.limit)||10)), offset=(page-1)*limit;
      const search=String(req.query.search||'').trim(); let where='', params=[];
      if(search && searchable.length){ where='WHERE '+searchable.map((f,i)=>`${f} ILIKE $${i+1}`).join(' OR '); params=searchable.map(()=>`%${search}%`); }
      const count=await query(`SELECT COUNT(*)::int AS total FROM ${table} ${where}`,params);
      const rows=await query(`SELECT * FROM ${table} ${where} ORDER BY ${orderBy} DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`,[...params,limit,offset]);
      return success(res,`${table} retrieved successfully`,rows.rows,200,{page,limit,total:count.rows[0].total,totalPages:Math.ceil(count.rows[0].total/limit)});
    }catch(e){next(e);}
  });
  router.get('/:id',async(req,res,next)=>{try{if(!idPattern.test(req.params.id))return failure(res,'Invalid record ID',400);const r=await query(`SELECT * FROM ${table} WHERE id=$1`,[req.params.id]);return r.rowCount?success(res,'Record retrieved',r.rows[0]):failure(res,'Record not found',404);}catch(e){next(e);}});
  router.post('/',async(req,res,next)=>{try{const keys=Object.keys(req.body).filter(k=>fields.includes(k));if(!keys.length)return failure(res,'No valid fields supplied',422);const vals=keys.map(k=>req.body[k]);const cols=keys.join(',');const marks=keys.map((_,i)=>`$${i+1}`).join(',');const r=await query(`INSERT INTO ${table} (${cols}) VALUES (${marks}) RETURNING *`,vals);return success(res,'Record created successfully',r.rows[0],201);}catch(e){next(e);}});
  router.patch('/:id',async(req,res,next)=>{try{if(!idPattern.test(req.params.id))return failure(res,'Invalid record ID',400);const keys=Object.keys(req.body).filter(k=>fields.includes(k));if(!keys.length)return failure(res,'No valid fields supplied',422);const vals=keys.map(k=>req.body[k]);const set=keys.map((k,i)=>`${k}=$${i+1}`).join(',');const r=await query(`UPDATE ${table} SET ${set},updated_at=NOW() WHERE id=$${keys.length+1} RETURNING *`,[...vals,req.params.id]);return r.rowCount?success(res,'Record updated successfully',r.rows[0]):failure(res,'Record not found',404);}catch(e){next(e);}});
  router.delete('/:id',async(req,res,next)=>{try{if(!idPattern.test(req.params.id))return failure(res,'Invalid record ID',400);const r=await query(`DELETE FROM ${table} WHERE id=$1 RETURNING id`,[req.params.id]);return r.rowCount?success(res,'Record deleted successfully',{id:r.rows[0].id}):failure(res,'Record not found',404);}catch(e){next(e);}});
  return router;
}
