
import mongoose, {Schema,model,Types} from 'mongoose';
const userSchema = new Schema ({
    userName:{
        type:String,
        required:[true,'username is required'],
        min:[2],
        max:[20]
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean, 
        default:false,
    },
    image:{
        type:Object,
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        default:'User',
        enum:['User','Admin']
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active']
    },
    gender:{
        type:String,
        enum:['Male','Femal']
    },
    adress:{
        type:String,
    },
    forgetCode:{
        type:String,
        default:null
    } ,
    changePasswordTime:{
        type:Date
    },
    wishList:[{type:Types.ObjectId,ref:'Product',required:true}]

},
{timestamps:true})
const userModel = mongoose.models.User ||  model('User', userSchema);
export default userModel;


