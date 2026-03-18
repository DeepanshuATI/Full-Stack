const mongoose=require('mongoose');
const {Schema}=mongoose;

const ProblemSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['arrays','strings','linkedlist','stack','queue','tree','graph','greedy','dynamic programming'],
        required:true,
    },
    visibletestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },explanation:{
                type:String,
                required:true,  
            }
        }
    ],
    invisibltestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },explanation:{
                type:String,
                required:true,  
            }
        }
    ],
    startcode:[
        {
            language:{
                type:String,
                required:true,
            },
            intialcode:{
                type:String,
                required:true,
            }
        }

    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            intialcode:{
                type:String,
                required:true,
            }
        }

    ]
});

const Problem=mongoose.model("problem",ProblemSchema);
module.exports=Problem;