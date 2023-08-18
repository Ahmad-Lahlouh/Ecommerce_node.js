import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"
import productModel from "../../../../DB/model/Product.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"

export const addProductToCart =asyncHandler( async (req,res,next)=>{
const {productId,qty}=req.body
const product = await productModel.findById(productId)
if(!product){
    return next(new Error('product is not found',{cause:400}))
}
if(product.stock<qty){
    return next(new Error('quantity is not found',{cause:400}))
}
const cart = await cartModel.findOne({userId:req.user._id})
if(!cart){
    const newCart = await cartModel.create({
        userId:req.user._id,
        products:[{
            productId,qty

        }]
    })
    return res.status(201).json({message:'success'},newCart)
}
let matchProducts = false
for(let i=0;i<cart.products.length;i++){
    
    if(cart.products[i].productId.toString() === productId){
        cart.products[i].qty = qty
        matchProducts=true
        break
    }
}
if(matchProducts==false){
    cart.products.push({productId,qty})
}
await cart.save()
    return res.status(200).json({message:'success',cart})
})

export const deleteItem = asyncHandler(async(req,res,next)=>{

    const{productIds}=req.body

    const deleteItem = await cartModel.updateOne({userId:req.user._id},{

        $pull:{
            products:{
                productId:{$in:productIds}
    
            }
        }
    })

    return res.json({message:'success',deleteItem})
})

export const clearCart = asyncHandler(async(req,res,next)=>{
    const clearCart = await cartModel.updateOne({userId:req.user._id},{
        products:[]
    })
        return res.status(200).json({message:'success'})

})

export const getCart = asyncHandler(async(req,res,next)=>{
    const cart= await cartModel.findOne({userId:req.user._id})
    return res.status(200).json({message:'success',cart})

})





