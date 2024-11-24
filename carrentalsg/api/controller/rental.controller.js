import Rental from '../models/rental.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Helper function to find a listing by ID
const findListingById = async (listingId, next) => {
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) throw errorHandler(404, 'Listing not found!');
    return listing;
  } catch (error) {
    next(errorHandler(500, 'Error retrieving listing!'));
  }
};

// Helper function to find an active rental
const findActiveRental = async (userId, listingId, next) => {
  try {
    const rental = await Rental.findOne({ user: userId, listing: listingId, status: 'booked' });
    if (!rental) throw errorHandler(404, 'Active rental not found for this user and listing!');
    return rental;
  } catch (error) {
    next(errorHandler(500, 'Error retrieving rental!'));
  }
};

// Book a listing
export const bookListing = async (req, res, next) => {
  const { listingId } = req.params;
  try {
    const listing = await findListingById(listingId, next);
    if (!listing.isAvailable) {
      return res.status(400).json({ success: false, message: 'Listing is already booked!' });
    }

    // Mark the listing as unavailable
    listing.isAvailable = false;

    // Create a rental record
    const rental = new Rental({
      user: req.user.id,
      listing: listing._id,
      status: 'booked',
    });

    await Promise.all([listing.save(), rental.save()]);

    res.status(201).json({
      success: true,
      message: 'Listing booked successfully!',
      rental,
    });
  } catch (error) {
    next(error);
  }
};

// Return a listing
export const returnListing = async (req, res, next) => {
  const { listingId } = req.params;
  try {
    const rental = await findActiveRental(req.user.id, listingId, next);
    const listing = await findListingById(listingId, next);

    // Update listing availability
    listing.isAvailable = true;

    // Update rental details
    rental.status = 'returned';
    rental.returnedAt = new Date();

    await Promise.all([listing.save(), rental.save()]);

    res.status(200).json({
      success: true,
      message: 'Listing returned successfully!',
      rental,
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ user: req.user.id })
      .populate('listing', 'name isAvailable')
      .exec();

    if (!rentals.length) {
      return next(errorHandler(404, 'No rentals found for this user!'));
    }

    res.status(200).json({ success: true, rentals });
  } catch (error) {
    next(errorHandler(500, 'Failed to retrieve rentals!'));
  }
};
