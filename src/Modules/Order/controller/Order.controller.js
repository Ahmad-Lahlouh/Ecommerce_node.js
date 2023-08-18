import orderModel from "../../../../DB/model/Order.model.js"
import cloudinary from "../../../Services/cloudinary.js"
import slugify from "slugify"
import { asyncHandler } from "../../../Services/errorHandling.js"
import couponModel from "../../../../DB/model/Coupon.model.js"
import moment from 'moment'
import productModel from "../../../../DB/model/Product.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"
import createInvoice from "../../../Services/pdf.js"

export const createOrder =asyncHandler( async (req,res,next)=>{
    const {products,address,PhoneNumber, couponName,paymantType} = req.body

    if(couponName){
        const coupon = await couponModel.findOne({name: couponName.toLowerCase()})

        if(!coupon){
            return next(new Error(`invalid coupon ${couponName}`),{cause:400})
        }
        let now = moment()
        let parsed = moment(coupon.expireDate,'DD.MM.YYYY')
        let diff = now.diff(parsed,'days')
        if(diff>=0){
            return next(new Error('coupon is expired',{cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon is used by ${req.user._id}`))
        }
        req.body.coupon=coupon
    }

    const finalProductList = []
    const productIds = []
    let subTotal = 0
    for(const product of products){
        const checkProduct = await productModel.findOne({_id:product.productId,stock:{$gte:product.qty},isDeleted:false
        })
        if(!checkProduct){
            return next(new Error(`invalid product`,{cause:400}))
        }
        // product = product.toObject()
        product.name=checkProduct.name
        product.unitPrice=checkProduct.finalPrice
        product.finalPrice = product.qty * product.unitPrice
        subTotal += product.finalPrice
        productIds.push(product.productId)

        finalProductList.push(product)

    }
    const order = await orderModel.create({
        userId:req.user._id,
        address,
        PhoneNumber,
        products:finalProductList,
        subTotal,
        couponId:req.body.coupon?._id,
        paymantType,
        finalPrice:subTotal-((subTotal*(req.body.coupon?.amount|| 0)/100)),
        status:(paymantType=='card')?'approved':'pending',

    })

    for(const product of products){
        const newStock = await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})

    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }

    await cartModel.updateOne({userId:req.user._id},{

        $pull:{
            products:{
                productId:{$in:productIds}
    
            }
        }
    })

    const invoice = {
        shipping: {
          name: req.user.userName,
          address,
          city: "Jenin",
          state: "west bank",
          country: "palestine"
        },
        items:order.products,
        subTotal,
        total: order.finalPrice,
        invoice_nr: order._id
      };
      
      createInvoice(invoice, "invoice.pdf");




    return res.status(201).json({message:'success',order})
    // const dummyOrder= {
    //     userId:req.user._id,
    //     adress,
    //     PhoneNumber,
    //     products:finalProductList,
    //     subTotal,
    //     couponId:req.body.coupon?._id,
    //     paymantType,
    //     finalPrice:subTotal-((subTotal*(req.body.coupon?.amount|| 0)/100)),
    //     status:(paymantType=='card')?'approved':'pending'
    // }
})

export const createOrderWithAllItemFromCart =asyncHandler( async (req,res,next)=>{
    const {address,PhoneNumber, couponName,paymantType} = req.body
    const cart =await cartModel.findOne({userId:req.user._id})
    if(!cart?.products?.length ){
        return next(new Error('cart is empty',{status:400}))
    }
    req.body.products=cart.products

    if(couponName){
        const coupon = await couponModel.findOne({name: couponName.toLowerCase()})

        if(!coupon){
            return next(new Error(`invalid coupon ${couponName}`),{cause:400})
            
        }
        let now = moment()
        let parsed = moment(coupon.expireDate,'DD.MM.YYYY')
        let diff = now.diff(parsed,'days')
        if(diff>=0){
            return next(new Error('coupon is expired',{cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon is used by ${req.user._id}`))
        }
        req.body.coupon=coupon
    }

    const finalProductList = []
    const productIds = []
    let subTotal = 0
    for(let product of req.body.products){
        const checkProduct = await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.qty},
            isDeleted:false
        })
        if(!checkProduct){
            return next(new Error(`invalid product`,{cause:400}))
        }
        product = product.toObject()
        product.name = checkProduct.name
        product.unitPrice=checkProduct.finalPrice
        product.finalPrice = product.qty * product.unitPrice
        subTotal += product.finalPrice
        productIds.push(product.productId)

        finalProductList.push(product)

    }
    const order = await orderModel.create({
        userId:req.user._id,
        address,
        PhoneNumber,
        products:finalProductList,
        subTotal,
        couponId:req.body.coupon?._id,
        paymantType,
        finalPrice:subTotal-((subTotal*(req.body.coupon?.amount|| 0)/100)),
        status:(paymantType=='card')?'approved':'pending',

    })

    for(const product of  req.body.products){
        const newStock = await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})

    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }

    await cartModel.updateOne({userId:req.user._id},{
        products:[]

    })


    return res.status(201).json({message:'success',order})
    // const dummyOrder= {
    //     userId:req.user._id,
    //     adress,
    //     PhoneNumber,
    //     products:finalProductList,
    //     subTotal,
    //     couponId:req.body.coupon?._id,
    //     paymantType,
    //     finalPrice:subTotal-((subTotal*(req.body.coupon?.amount|| 0)/100)),
    //     status:(paymantType=='card')?'approved':'pending'
    // }
})

export const cancelOrder = asyncHandler(async(req,res,next)=>{
    const {orderId}=req.params
    const {reasonReject} = req.body
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id})
    if(!order|| order.status!='pending'|| order.paymantType!='cash'){
        return next(new Error('cant cancel order',{cause:400}));
    }

    await orderModel.updateOne({_id:orderId},{status:'canceled',reasonReject,updatedBy:req.user._id})

    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{
            $inc:{stock:product.qty}
        })
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{
            $pull:{usedBy:req.user._id}
        })
    }
    return res.json({message:'success'})

})

export const updateOrderStatusByAdmin = asyncHandler(async(req,res,next)=>{
    const{orderId}=req.params
    const{status}=req.body

    const order = await orderModel.findOne({_id:orderId},{})
    if(!order||order.status=='delivered'){
        return next(new Error(`this order is not found or this order status is :${order.status}`,{cause:400}));

    }
    const cahngeOrderStatus = await orderModel.updateOne({_id:orderId},{status,updatedBy:req.user._id})
    if(!cahngeOrderStatus.matchedCount){
        return next(new Error('faied to update status',{cause:400}))
    }
    return res.json({message:'success',order})

})



