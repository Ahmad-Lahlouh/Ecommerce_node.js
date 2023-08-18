import {Router} from "express"; 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ReviewController from './controller/Review.controller.js'
import * as validators from './Review.validation.js'
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Review.endpoint.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoint.create),ReviewController.createReview)
router.put('/updateReview/:reviewId',auth(endPoint.update),ReviewController.updateReview)




export default router