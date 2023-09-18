import Location from "../model/location.js"
import Quest from "../model/quest.js"
import Admin from "../model/admin.js"
import { createError } from "../util/createError.js"
import { cloudinaryUploadImg } from '../util/cloudinary.js'

export const createLocation = async (req, res, next) => {
    try {
        // require 4 parameters from body and another 1 from auth
        const { locationName, latitude, longitude } = req.body;
        const { id } = req.user;
        // validate
        if (!(locationName && latitude && longitude && id)) {
            throw new Error("All fields are required");
        }

        let picturePath = ""
        if (req.file?.path) {
            let newPath = await cloudinaryUploadImg(req.file.path)
            picturePath = newPath.url
        }

        try {
            const newLocation = await Location.create({
                locationName,
                latitude,
                longitude,
                picturePath,
                creatorId: id
            });
            return res.json(newLocation);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        console.log(error)
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
        const location = await Location.findById({ _id: id });
        if (!location) { return next(createError(400, "location not found")); }
        const quests = await Quest.find({ locationId: id }).sort([["status", 1]])
        return res.json({
            location,
            quests
        });
    } catch (error) {
        next(error);
    }
}

export const updateLocationById = async (req, res, next) => {
    const { id } = req.params;
    const creatorId = req.user.id;
    const creatorRole = req.user.role;
    const newData = req.body;

    try {
        if (creatorRole == "creator") {
            if (await Admin.findById(creatorId).organizeName !== await Admin.findById(location.creatorId).organizeName) {
                return next(createError(400, "no permission"));
            }
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

        if (req.file?.path) {
            const newPath = await cloudinaryUploadImg(req.file.path)
            const picturePath = newPath.url
            location.picturePath = picturePath
            await location.save()
        }

        return res.json({
            location: location,
            status: "success"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteLocaitonById = async (req, res, next) => {
    const { id } = req.params;
    const creatorId = req.user.id;
    const creatorRole = req.user.role;

    try {
        if (creatorRole == "creator") {
            if (await Admin.findById(creatorId).organizeName !== await Admin.findById(location.creatorId).organizeName) {
                return next(createError(400, "no permission"));
            }
        }

        const location = await Location.findByIdAndDelete({ _id: id });

        if (!location) {
            return next(createError(400, "location not found"));
        }

        return res.json({ status: "success" });
    } catch (error) {
        next(error);
    }
}