import mongoose,{Schema,Types, model} from "mongoose";
const reviewSchema = new Schema({

    comment:{type:String,required:true,},
    productId:{type:Types.ObjectId,ref:'product',required:true},
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    rating:{type:Number,required:true,Min:1 ,Max:5},
    orderId:{type:Types.ObjectId,ref:'Order',required:true},



},
{  
    timestamps:true
})
const reviewModel = mongoose.models.Review || model("Review",reviewSchema)
export default reviewModel