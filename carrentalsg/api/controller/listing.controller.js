import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    // Ensure `isAvailable` is set to true when creating a new listing
    const listingData = { ...req.body, isAvailable: true };
    
    // Create the listing with `isAvailable` set to true
    const listing = await Listing.create(listingData);
    
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let driveToMalaysia = req.query.driveToMalaysia;

    if (driveToMalaysia === undefined || driveToMalaysia === 'false') {
      driveToMalaysia = { $in: [false, true] };
    }

    let fuelType = req.query.fuelType;

    if (fuelType === undefined || fuelType === 'all') {
      fuelType = { $in: ['petrol', 'electronic'] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
  
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const bookListing = async (req, res, next) => {
  try {
    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));

    // Check if the listing is already booked
    if (!listing.isAvailable) {
      return res.status(400).json({ success: false, message: 'Listing is already booked' });
    }

    // Mark the listing as unavailable and assign `bookedBy` to the user making the booking
    listing.isAvailable = false;
    listing.bookedBy = req.user.id; // Track the booking customer

    await listing.save();

    res.status(200).json({ success: true, message: 'Listing booked successfully', listing });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Booking failed'));
  }
};


export const returnListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id); // Use req.params.id here
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    // Update listing availability
    listing.isAvailable = true;
    await listing.save();

    res.status(200).json({ success: true, message: 'Listing returned successfully', listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to return listing' });
  }
};


export const showUserBookings = async (req, res, next) => {
  try {
    // Find all bookings for the logged-in user where `isAvailable` is false
    const bookings = await Listing.find({ userRef: req.params.userId, isAvailable: false });
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'No bookings found for this user' });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings' });
  }
};
