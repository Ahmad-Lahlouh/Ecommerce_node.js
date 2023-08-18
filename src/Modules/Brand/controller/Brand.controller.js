import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"
export const getAllBrands = asyncHandler(async(req,res,next)=>{
    const {categoryId} = req.params
    const brands = await brandModel.find({categoryId})
    return res.status(200).json({message:'success',brands})
})
export const createBrand =asyncHandler( async (req,res,next)=>{
const {name} = req.body
const {categoryId}=req.body
if(await brandModel.findOne({name})){
    return next(new Error('Dublicate brand name',{cause:409}))
}
const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
const brand = await brandModel.create({name,image:{public_id,secure_url},categoryId,createdBy:req.user._id,updatedBy:req.user._id})
return res.status(201).json({message:'success',brand})
})


export const updateBrand = asyncHandler(async (req,res,next)=>{
    const brand = await brandModel.findById(req.params.brandId)
    if(!brand){
        return next(new Error(`invalid brand id ${req.params.brandId}`,{cause:400}))
    }
    if(req.body.name){
        if(brand.name== req.body.name){
            return next(new Error('old name match the new name'))
        }
        if(await brandModel.findOne({name:req.body.name})){
            return next(new Error('Dublicate brand name',{cause:409}))
        }
        brand.name = req.body.name
        brand.slug = slugify(req.body.name)
    }
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image = {public_id,secure_url}
    }
    category.updatedBy=req.user._id

    await brand.save()
    return res.json({message:'success',brand})
})


