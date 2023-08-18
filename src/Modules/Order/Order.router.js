import {Router} from "express"; 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as OrderController from './controller/Order.controller.js'
import * as validators from './Order.validation.js'
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Order.endpoint.js";
const router = Router();

router.post('/',auth(endPoint.create),OrderController.createOrder)
router.post('/allItemFromCart',auth(endPoint.create),OrderController.createOrderWithAllItemFromCart)
router.patch('/cancel/:orderId',auth(endPoint.cancel),OrderController.cancelOrder)
router.patch('/changeStatusByAdmin/:orderId',auth(endPoint.updateOrderStatusByAdmin),OrderController.updateOrderStatusByAdmin)





export default router



