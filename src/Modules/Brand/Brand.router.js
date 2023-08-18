import {Router} from "express"; 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as BrandController from './controller/Brand.controller.js'
import * as validators from './Brand.validation.js'
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Brand.endpoint.js";
const router = Router();

router.get('/:categoryId',validation(validators.getAllBrands),BrandController.getAllBrands)
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),validation(validators.createBrand),BrandController.createBrand)
router.put('/update/:brandId',fileUpload(fileValidation.image).single('image'),validation(validators.updateBrand),BrandController.updateBrand)


export default router