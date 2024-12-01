import { errorHandler } from "../utils/error.js";
import bycrptjs from 'bcryptjs';
import User from '../models/user.model.js'
import Listing from '../models/listing.model.js';
import Rental from '../models/rental.model.js'; 

export const test = (req,res)=> {
    res.json({
        message:'API ROUTE IS WORKING!'
    });

};

export const updateUser = async (req,res,next) => {
if (req.user.id !== req.params.id) 
    return next (errorHandler(401,"You can only update your own account!"));
    try{
if(req.body.password){
    req.body.password= bcryptjs.hashSync(req.body.password,10);
}

const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
    $set:{
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
},
}, 
{new:true}
);

const{password, ...rest} = updatedUser._doc;
res.status(200).json(rest);

} catch (error){
    next(error);
}
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Listing.find({
      bookedBy: req.user.id, // Fetch bookings for the current user
      isAvailable: false
    });

    if (!bookings || bookings.length === 0) {
      return next(errorHandler(404, 'No bookings found for this user!'));
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersWithBookings = async (req, res, next) => {
  try {
    console.log("Fetching users...");
    const users = await User.find({}, 'username email').lean();
    console.log("Users fetched:", users);

    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookings = await Rental.find({ user: user._id })
          .populate('listing', 'name imageUrls')
          .exec();
        console.log(`Bookings for user ${user._id}:`, bookings);
        return { ...user, bookings };
      })
    );

    res.status(200).json({ success: true, users: usersWithBookings });
  } catch (error) {
    console.error("Error in getAllUsersWithBookings:", error);
    next(errorHandler(500, 'Failed to retrieve users with bookings!'));
  }
};
