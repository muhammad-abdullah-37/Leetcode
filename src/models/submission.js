const mongoose =  require('mongoose');
const {Schema} = mongoose;

// Creating the Schema
const submissionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','c++','java']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number, // Milliseconds
        default:0
    },
    memory:{
        type:Number, // KB
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    }
},
{timestamps : true}
) 

// Compound Indexing or indexing for creating the indexes to reduce the iteration time by combining two or more than two unique value like two id's of userId and problemId, here 1 being used for the ascending order. 
submissionSchema.index({userId:1, problemId:1})
const Submission = mongoose.model('submission',submissionSchema);

module.exports = Submission;