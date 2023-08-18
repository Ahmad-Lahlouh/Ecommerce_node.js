import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"
import orderModel from "../../../../DB/model/Order.model.js"
import reviewModel from "../../../../DB/model/Review.model.js"

export const createReview = asyncHandler(async(req,res,next)=>{
    const{comment,rating}=req.body
    const{productId}=req.params
    const order = await orderModel.findOne({
        userId:req.user._id,
        status:'delivered',
        'products.productId':productId
    })
    if(!order){
        return next(new Error('can not review product before receive'),{cause:400})
    }

    const checkReview = await reviewModel.findOne({
        createdBy:req.user._id,
        productId
    })

    if(checkReview){
        return next(new Error('already reviewed by you'),{cause:400})

    }
    const review  =await reviewModel.create({
        createdBy:req.user._id,
        orderId:order._id,
        productId,
        comment,
        rating
    })


    return res.status(201).json({message:'success',review})

})

export const updateReview = asyncHandler(async(req,res,next)=>{
    const {productId,reviewId}=req.params
    const review = await reviewModel.findByIdAndUpdate({_id:reviewId,createdBy:req.user._id,productId},req.body,{new:true})
    return res.status(200).json({message:'success',review})
})


