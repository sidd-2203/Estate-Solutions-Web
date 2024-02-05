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