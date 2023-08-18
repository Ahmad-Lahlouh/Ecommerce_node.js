import categoryModel from "../../../../DB/model/Category.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"
import subcategoryModel from "../../../../DB/model/SubCategory.model.js"

export const getSpecificCategory = asyncHandler(async(req,res,next)=>{
    const category = await categoryModel.findById(req.params.categoryId)
    return res.status(200).json({message:'success',category})
})

export const getCategories = asyncHandler(async(req,res,next)=>{
    const categories = await categoryModel.find()
    return res.status(200).json({message:'success',categories})
})

export const createSubCategory =asyncHandler( async (req,res,next)=>{

const {categoryId}=req.params

const {name} = req.body
if(await subcategoryModel.findOne({name})){
    return next(new Error('Dublicate SubCategory name',{cause:409}))
}

const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Subcategory`})

const Subcategory = await subcategoryModel.create({name,slug:slugify(name),categoryId,image:{public_id,secure_url},createdBy:req.user._id,updatedBy:req.user._id})
return res.status(201).json({message:'success',Subcategory})
})

export const updateSubCategory = asyncHandler(async (req,res,next)=>{
    const{categoryId,subCategoryId} = req.params

    const Subcategory = await subcategoryModel.findOne({_id:subCategoryId,categoryId})
    if(!Subcategory){
        return next(new Error(`invalid subCategory id ${req.params.categoryId}`,{cause:400}))
    }
    if(req.body.name){
        if(Subcategory.name== req.body.name){
            return next(new Error('old name match the new name'))
        }
        if(await subcategoryModel.findOne({name:req.body.name})){
            return next(new Error('Dublicate Subcategory name',{cause:409}))
        }

        Subcategory.name = req.body.name
        Subcategory.slug = slugify(req.body.name)

    }

    if(req.file){
        
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Subcategory`})

        await cloudinary.uploader.destroy(Subcategory.image.public_id)

        Subcategory.image = {public_id,secure_url}

    }
    req.body.updatedBy=req.user._id
    await Subcategory.save()

    return res.json({message:'success',Subcategory})
})

export const getSpecificSubCategory = asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const subcategories= await subcategoryModel.find({categoryId})
    return res.status(200).json({messaeg:"sucess",subcategories})
})
export const getSubCategory = asyncHandler(async(req,res,next)=>{
    const subcategories= await subcategoryModel.find().populate({
        path:'categoryId',
        select:'-_id name'
    })
    return res.status(200).json({messaeg:"sucess",subcategories})
})

export const getProducts = asyncHandler(async(req,res,next)=>{
    const {subCategoryId} = req.params
    const products = await subcategoryModel.findById(subCategoryId).populate({
        path:'products',
        match:{isDeleted:{$eq:false}},
        populate:{path:'reviews'}
    })
    return res.json({message:'sucess',products})
})




