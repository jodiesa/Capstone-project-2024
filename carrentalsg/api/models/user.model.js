import mongoose from 'mongoose';


//unique username

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    password: {
        type: String,
        required:true,
       
    },
    avatar: {
        type : String,
        default: "https://www.pngall.com/wp-content/uploads/12/Avatar-No-Background.png"

},

},
{timestamps:true}



);

const User = mongoose.model('User', userSchema);

export default User;