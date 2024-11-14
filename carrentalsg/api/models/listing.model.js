import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
   type:{
    type: String,
    required : true,
   },
   offer: {
    type: Boolean,
    required: true,
   },
    driveToMalaysia: {
      type: Boolean,
      required: true,
    },
    fuelType:
  {
    type: String,
    required:true,
  },

  minAge:{
    type:Number,
    required:true,
  },
    pax: {
      type: Number,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user who booked the listing
      default: null
    },
    userRef: {
       type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The owner of the listing
    required: true
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;