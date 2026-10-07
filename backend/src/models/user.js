const mongoose = require('mongoose');
const {Schema} = mongoose;



const userSchema = new Schema({
    firstName :{
        type : String,
        required : true,
        minLength : 3,
        maxLength : 20,
    },
    lastName :{
        type : String,
        minLength : 3,
        maxLength : 20,
    },
    emailId :{
        type : String,
        required : true,
        unique : true,
        maxLength : 50,
        trim : true,
        lowercase : true,
        immutable : true
    },
    age :{
        type : Number,
        min : 10,
        max : 80

    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    problemsSolved : {
        type : [{
            type: Schema.Types.ObjectId,
            ref:'problem'
            }
        ],
        unique:true,
    },
    password :{
        type : String,
        required : true
    },
},{timestamps : true})

// Using a post command , this post command runs on a particular function or process which is findOneDelete , here findOneAndDelete is mapped with the findByIdAndDelete of mongoose;
userSchema.post('findOneAndDelete',async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submissions').deleteMany({userId: userInfo._id})

    }
})
const User = mongoose.model('user', userSchema);

module.exports  = User