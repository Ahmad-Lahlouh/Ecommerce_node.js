
import connectDB from '../../DB/connection.js';
import { globalErrorHandler } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import path from 'path'; 
import {fileURLToPath} from 'url';
import categoryRouter from './Category/Category.router.js'
import ProductRouter from './Product/Product.router.js'
import SubcategoryRouter from'./SubCategory/SubCategory.router.js'
import couponRouter from './Coupon/Coupon.router.js'
import brandRouter from './Brand/Brand.router.js'
import cartRouter from './Cart/Cart.router.js'
import ordertRouter from './Order/Order.router.js'
import reviewRouter from './Review/Review.router.js'
import cors from 'cors'





const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath=path.join(__dirname,'../upload');
const initApp=(app,express)=>{
    app.use(async(req,res,next)=>{

        // var whitelist = ['http://example1.com', 'http://example2.com']
    
        // if(!whitelist.indludes(req.header('origin'))){
        //     return next(new Error('ivalid origin',{cause:403}))
            
        // }
        next()
    })

    app.use(cors())
    connectDB();
    app.use(express.json());
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use("/category", categoryRouter);
    app.use("/subCategory", SubcategoryRouter);
    app.use("/coupon", couponRouter);
    app.use('/brand',brandRouter)
    app.use('/user', UserRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', cartRouter);
    app.use('/order', ordertRouter);
    app.use('/review',reviewRouter)



    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })
    //global error handler
    app.use(globalErrorHandler)
}
export default initApp;