import express from 'express';
import {
  createListing,
  getListing,
  getListings,
  deleteListing,
  updateListing,
  bookListing,
  returnListing,
} from '../controller/listing.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

// Admin-only routes
router.post('/create', verifyToken, verifyAdmin, createListing);
router.delete('/delete/:id', verifyToken, verifyAdmin, deleteListing);
router.post('/update/:id', verifyToken, verifyAdmin, updateListing);

router.get('/get', getListings);
router.get('/get/:id', getListing);
// Routes available to regular users
router.post('/book/:id', verifyToken, bookListing);
router.post('/return-car/:id', verifyToken, returnListing);

export default router;
