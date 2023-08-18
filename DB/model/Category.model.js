import mongoose,{Schema,Types, model} from "mongoose";
const categorySchema = new Schema({

    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},


},
{  
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})

categorySchema.virtual('subcategory',{
    localField:'_id',
    foreignField:'categoryId',
    ref:'Subcategory'
})

const categoryModel = mongoose.models.Category || model("Category",categorySchema)

export default categoryModel