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
        let locationsData = [];
        const pipeline = [
            {
              '$lookup': {
                'from': 'quests', 
                'localField': '_id', 
                'foreignField': 'locationId', 
                'as': 'result'
              }
            }, {
                '$match': {
                    'result': {
                        '$elemMatch': {
                            'status': false
                        }
                    }
                }
            }, {
                '$project': {
                    'locationName': 1,
                    'latitude': 1,
                    'longitude': 1,
                    'result': 1
                }
            }
        ]
        const result = await Location.aggregate(pipeline);

        for (let location of result) {
            let countQuest = 0
            for (let quest of location.result) {
                if (!quest.status) {
                    countQuest += 1
                }
            }
            locationsData.push({
                _id: location._id,
                locationName: location.locationName,
                latitude: location.latitude,
                longitude: location.longitude,
                count: countQuest
            })
        }

        return res.json(
            [...locationsData],
        );
    } catch (error) {
        console.error(error)
        next(error);
    }
}

export const getLocationById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        const location = await Location.findById({ _id: id });
        if (!location) { return next(createError(400, "location not found")); }

        let quests = await Quest.find({ locationId: id }).sort([["status", 1]]).populate("tagId")
        if (userId) {
            quests = quests.map(quest => {
                let isJoin = false
                let isCheckIn = false
                quest.participant.forEach((user) => {
                    if (user.userId == userId) {
                        isJoin = true
                        isCheckIn = user.status
                    }
                })
                return {
                    activityHour: quest.activityHour,
                    _id: quest._id,
                    questName: quest.questName,
                    creatorId: quest.creatorId,
                    locationId: quest.locationId,
                    timeStart: quest.timeStart,
                    timeEnd: quest.timeEnd,
                    description: quest.description,
                    status: quest.status,
                    picturePath: quest.picturePath,
                    tagId: quest.tagId,
                    countParticipant: quest.countParticipant,
                    maxParticipant: quest.maxParticipant,
                    autoComplete: quest.autoComplete,
                    participant: quest.participant,
                    createdAt: quest.createdAt,
                    updatedAt: quest.updatedAt,
                    isJoin,
                    isCheckIn
                }
            })
        }
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