import express from 'express';import cors from 'cors';import helmet from 'helmet';import rateLimit from 'express-rate-limit';import dotenv from 'dotenv';
import authRoutes from './modules/auth.routes.js';import adminRoutes from './routes/admin.routes.js';import {authenticate,authorize} from './middleware/auth.js';import {notFound,errorHandler} from './middleware/errorHandler.js';import {query} from './config/db.js';import {success} from './utils/apiResponse.js';
dotenv.config();const app=express();app.use(helmet());app.use(cors({origin:process.env.CORS_ORIGIN?.split(',')||true}));app.use(express.json({limit:'1mb'}));app.use(rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:true,legacyHeaders:false}));
app.get('/health',async(req,res,next)=>{try{await query('SELECT 1');return success(res,'API and database are healthy',{database:'connected'});}catch(e){next(e);}});
app.use('/api/v1/auth',authRoutes);app.use('/api/v1/admin',authenticate,authorize('admin','super_admin'),adminRoutes);app.use(notFound);app.use(errorHandler);
const port=process.env.PORT||5000;app.listen(port,()=>console.log(`Brightloop API listening on port ${port}`));
