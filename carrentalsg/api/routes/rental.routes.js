import express from 'express';
import { bookRental } from '../controllers/rental.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/book/:listingId', verifyToken, bookRental); // Book a listing


export default router;
