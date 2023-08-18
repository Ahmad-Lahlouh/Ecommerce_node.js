import {Router} from "express"; 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CartController from './controller/Cart.controller.js'
import * as validators from './Cart.validation.js'
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Cart.endpoint.js";
const router = Router();

router.post('/',auth(endPoint.create),CartController.addProductToCart)
router.patch('/deleteItem/',auth(endPoint.update),CartController.deleteItem)
router.patch('/clearCart/',auth(endPoint.update),CartController.clearCart)
router.get('/',auth(endPoint.get),CartController.getCart)



export default router