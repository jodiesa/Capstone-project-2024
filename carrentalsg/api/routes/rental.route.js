import express from 'express';
import {
  getUserBookings,bookListing,returnListing
} from '../controller/rental.controller.js';
import { verifyToken,verifyAdmin} from '../utils/verifyUser.js';

const router = express.Router();

// Updated routes
router.post('/book/:listingId', verifyToken, bookListing);
router.post('/:listingId/return', verifyToken, returnListing);
router.get('/user', verifyToken, getUserBookings);


export default router;
