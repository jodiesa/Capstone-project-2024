import express from 'express';
import {createListing, getListing, getListings,deleteListing} from '../controller/listing.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;