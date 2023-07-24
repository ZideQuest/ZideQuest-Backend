import Location from "../model/locaiton.js"
import { createError } from "../util/createError.js"

export const createLocation = async (req, res, next) => {
    try {
        const { locationName, latitude, longitude, adminId } = req.body;
        if (!(locationName && latitude && longitude && adminId)) {
            throw new Error("All field is required");
        }
    } catch (error) {
        throw(error);
    }
    
    return
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