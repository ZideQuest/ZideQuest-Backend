import Location from "../model/location.js"
import Admin from "../model/admin.js"
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

export const getLocationById = async (req, res, next) => {
	const { id } = req.params;

    try {
        const location = await Location.findById({_id: id});
        if (!location) {
            return next(createError(400, "location not found"));
        }
        return res.json(location);
    } catch (error) {
        next(error);
    }
}

export const updateLocationById = async (req, res, next) => {
    const { id } = req.params;
    const adminId = req.user.id;
    const newData = req.body;

    try {
        const location = await Location.findByIdAndUpdate(
            id,
            newData,
            {
                new: true
            }
        );
        if (!location) {
            return next(createError(400, "location not found"));
        }

        // var { organizeName } = await Admin.findById(adminId);
        // const newOrganize = organizeName;
        // var { organizeName } = await Admin.findById(location.adminId);
        
        if (await Admin.findById(adminId).organizeName !== await Admin.findById(location.adminId).organizeName) {
            next(createError(400, "unautherized"));
        }
        return res.json({
            locaiton: location,
            status: "success"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteLocaitonById = async (req, res, next) => {
	const { id } = req.params;

    try {
        const location = await Location.findByIdAndDelete({_id: id});
        if (!location) {
            return next(createError(400, "location not found"));
        }
        return res.json({status: "success"});
    } catch (error) {
        next(error);
    }
}