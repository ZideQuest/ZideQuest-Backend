import Location from "../model/location.js"
import Admin from "../model/creator.js"
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
                creatorId: id
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
    const creatorId = req.user.id;
    const newData = req.body;

    try {
        if (await Admin.findById(creatorId).organizeName !== await Admin.findById(location.creatorId).organizeName) {
            next(createError(400, "no permission"));
        }
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

        // var { organizeName } = await Admin.findById(creatorId);
        // const newOrganize = organizeName;
        // var { organizeName } = await Admin.findById(location.creatorId);
        
        return res.json({
            locaiton: location,
            status: "success"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteLocaitonById = async (req, res, next) => {
    const creatorId = req.user.id;
	const { id } = req.params;

    try {
        if (await Admin.findById(creatorId).organizeName !== await Admin.findById(location.creatorId).organizeName) {
            next(createError(400, "no permission"));
        }

        const location = await Location.findByIdAndDelete({_id: id});

        if (!location) {

            return next(createError(400, "location not found"));
        }

        return res.json({status: "success"});
    } catch (error) {
        next(error);
    }
}