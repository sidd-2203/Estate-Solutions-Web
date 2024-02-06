import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}
export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!!'));
        }
        if (listing.userRef.toString() != req.user.id) {
            return next(errorHandler(401, 'You can only delete you own listings!!'));
        }
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, msg: 'Successfully deleted the listing' });
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
        if (listing.userRef.toString() != req.user.id) {
            return next(errorHandler(401, 'You are only allowed to edit your own listing'));
        }
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing);

    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        let furnished = req.query.furnished;
        let parking = req.query.parking;
        let type = req.query.type;

        if (offer === undefined || offer === false) {
            offer = { $in: [false, true] };
        }
        if (furnished === undefined || furnished === false) {
            furnished = { $in: [false, true] };
        }
        if (parking === undefined || parking === false) {
            parking = { $in: [false, true] };
        }
        if (type === undefined || type === 'all') {
            type = { $in: ['rent', 'sale'] };
        }
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';
        const listing = await Listing.find({
            // options 'i' for dont care about lower or uppercase 
            name: { $regex: searchTerm, $options: 'i' },
            furnished,
            parking,
            type,
            offer,
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);

        return res.status(200).json(listing);


    } catch (error) {
        next(error);
    }
}