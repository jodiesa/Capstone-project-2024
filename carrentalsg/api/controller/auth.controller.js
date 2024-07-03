import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
export const signup = async (req,res) => {

//save in db
const {username,email,password} = req.body;
const hashedPassword=bcryptjs.hashSync(password,10); // encryption
const newUser = new User ({username,email,password:hashedPassword});
await newUser.save()

try{
res.status(201).json("User created successfully!");

}
catch(error){
next(error);
}
};