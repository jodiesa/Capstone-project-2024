import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    bookedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['booked', 'returned', 'canceled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
