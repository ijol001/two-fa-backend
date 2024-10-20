import mongoose from "mongoose";
var Schema = mongoose.Schema;

var ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    id: {
        type: String, default: function () {
            return new ObjectId().toString()
        }
    },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },    
    email: { type: String, required: true, trim: true },         
    password: { type: String, required: true, minlength: 5, trim: true },
    otp: { type: String }
})

const userModel = mongoose.model("user", userSchema);  


export default userModel;