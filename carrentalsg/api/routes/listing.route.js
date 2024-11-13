import express from 'express';
import {createListing, getListing, getListings,deleteListing,updateListing,bookListing} from '../controller/listing.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();


router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.post('/book/:id', verifyToken, bookListing);


export default router;