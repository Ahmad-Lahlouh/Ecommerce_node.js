import {Router} from "express"; 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import reviewRouter from '../Review/Review.router.js'
import * as ProductController from './controller/Product.controller.js'
import * as validators from './Product.validation.js'
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Product.endpoint.js";
const router = Router({mergeParams:true});


router.use('/:productId/review',reviewRouter)

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),ProductController.createProduct)

router.put('/update/:productId',auth(endPoint.update),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),ProductController.updateProduct)

router.patch('/softDelete/:productId',auth(endPoint.softDelete),ProductController.softDelete)
router.delete('/forceDelete/:productId',auth(endPoint.forceDelete),ProductController.forceDelete)
router.patch('/restore/:productId',auth(endPoint.restore),ProductController.restore)
router.get('/softDelete',auth(endPoint.get),ProductController.getSoftDeleteProducts)
router.get('/:productId',ProductController.getProduct)
router.get('/',ProductController.getProducts)

export default router