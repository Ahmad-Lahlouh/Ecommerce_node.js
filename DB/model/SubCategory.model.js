import mongoose,{Schema,Types, model} from "mongoose";
const subcategorySchema = new Schema({

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
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},


},
{  
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})

subcategorySchema.virtual('products',{
    localField:'_id',
    foreignField:'subCategoryId',
    ref:'product'
})



const subcategoryModel = mongoose.models.Subcategory || model("Subcategory",subcategorySchema)

export default subcategoryModel