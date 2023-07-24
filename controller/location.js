import mongoose from "mongoose";
import Location from "../model/location.js"
import { createError } from "../util/createError.js"

export const createLocation = async (req, res, next) => {
    try {
        // require 4 parameters from body and another 1 from auth
        const { locationName, latitude, longitude, locationPicturePath } = req.body;
        const { id } = req.user;

        // validate
        if (!(locationName && latitude && longitude && locationPicturePath && id)) {
            throw new Error("All fields are required");
        }
        try {
            const newLocation = await Location.create({
                locationName,
                latitude,
                longitude,
                locationPicturePath,
                adminId: id
            });
            return res.json(newLocation);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export const getAllLocation = async (req, res, next) => {
    try {
        const locations = await Location.find({});
        return res.json(locations);
    } catch (error) {
        next(error);
    }
}

export const getLocationById = (req, res, next) => {
	const { id } = req.params;
	
    return
}

export const updateLocationById = (req, res, next) => {
    const { id, role } = req.user 

    return
}

export const deleteLocaitonById = (req, res, next) => {
    const { id, role } = req.user 

    return
}