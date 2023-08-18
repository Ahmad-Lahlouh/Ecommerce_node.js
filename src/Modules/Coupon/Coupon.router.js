import {Router} from "express"; 
import * as CouponController from './controller/Coupon.controller.js'
import * as validators from './Coupon.validation.js'
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Coupon.endpoint.js";
const router = Router();

router.post('/',auth(endPoint.create),validation(validators.createCoupon),CouponController.createCoupon)
router.get('/',CouponController.getCoupons)
router.get('/:couponId',validation(validators.getSpecificCoupon),CouponController.getSpecificCoupon)

router.put('/update/:couponId',validation(validators.updateCoupon),CouponController.updateCoupon)



export default router