import mongoose from "mongoose";
import Location from "../model/location.js"
import { createError } from "../util/createError.js"

export const createLocation = async (req, res, next) => {
    try {
        const { locationName, latitude, longitude } = req.body;
        // const { id } = req.user;
        // if (!(locationName && latitude && longitude && id)) {
        //     throw new Error("All field is required");
        // }
        if (!(locationName && latitude && longitude)) {
            throw new Error("All field is required");
        }
        try {
            const newLocation = await Location.create({
                locationName,
                latitude,
                longitude,
                // adminId: id
            });
            return res.json(newLocation);
        } catch (error) {
            throw error;
        }
    } catch (error) {
        throw(error);
    }
}

export const getAllLocation = (req, res, next) => {
    return
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