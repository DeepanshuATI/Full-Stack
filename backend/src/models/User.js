const mongoose=require('mongoose')
const {Schema}=mongoose;

const UserSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true, //removes extra spaxes 
        lowercase:true, // accept only  char to lower case 
        immutable: true, //first time change allowed later on changes not allowed 

    },
    age:{
        type:Number,
        required:true,
        min:10,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    problemSolved:{
        type:[String],
    },
    photo:{
        type:String,
        default:"this is default photo"
    },
    password:{
        type:String,
        required:true,
    }

},{ timestamps:true})

const User=mongoose.model("user",UserSchema);//users is the name of model automatically creates a collections pluralise   
module.exports=User; //This line exports the User model so you can use it in other files of your Node.js app