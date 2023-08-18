import couponModel from "../../../../DB/model/Coupon.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"


export const getCoupons = asyncHandler(async(req,res,next)=>{
    const coupons = await couponModel.find()
    return res.status(200).json({message:'success',coupons})
})

export const getSpecificCoupon = asyncHandler(async(req,res,next)=>{
    const {couponId} = req.params
    const coupon = await couponModel.findById(couponId)
    if(!coupon){
        return next(new Error('this coupon is not available',{cause:404}))
    }
    return res.status(200).json({message:'success', coupon})
})
export const createCoupon =asyncHandler( async (req,res,next)=>{
const {name} = req.body
let date= new Date(req.body.expireDate)
let now = new Date()
if(now.getTime()>= date.getTime()){
    return next(new Error('invalid date',{cause:404}))
}
date = date.toLocaleDateString()
if(await couponModel.findOne({name})){
    return next(new Error('Dublicate coupon name',{cause:409}))
}

req.body.createdBy=req.user._id
req.body.updatedBy=req.user._id

const coupon = await couponModel.create(req.body)
return res.status(201).json({message:'success',coupon})
})

export const updateCoupon = asyncHandler(async (req,res,next)=>{
    const coupon = await couponModel.findById(req.params.couponId)
    if(!coupon){
        return next(new Error(`invalid coupon id ${req.params.couponId}`,{cause:400}))
    }
    if(req.body.name){
        if(coupon.name== req.body.name){
            return next(new Error('old name match the new name'))
        }
        if(await couponModel.findOne({name:req.body.name})){
            return next(new Error('Dublicate coupon name',{cause:409}))
        }

        coupon.name = req.body.name
    }

    if(req.body.amount){
        coupon.amount = req.body.amount
    }
    
    req.body.updatedBy=req.user._id

    await coupon.save()
    return res.status(200).json({message:'success',coupon})
})


