import Quest from '../model/quest.js'
import Location from '../model/location.js'
import { createError } from "../util/createError.js"

export const getSearch = async (req, res, next) => {
    try {
        const { Name, timeStart, timeEnd, tagId} = req.query;

        const query = {};
        console.log(Name)
        if (Name) {
            query.$or = [
                { questName: { $regex: Name, $options: "i" } },
                { locationName: { $regex: Name, $options: "i" } }
            ];
        }

        if (timeStart) {
            query.timeStart = { $gte: new Date(timeStart) };
        }

        if (timeEnd) {
            query.timeEnd = { $lte: new Date(timeEnd) };
        }

        if (tagId) {
            query.tagId = tagId;
        }        

        const quests = await Quest.find(query).populate('locationId');
        let locations = await Location.find(query);
        const locationFromQuest = quests.map(quest => quest.locationId);
        locations = locations.concat(locationFromQuest);
        locations = locations.filter((item, index, arr) => arr.indexOf(item) === index);
        return res.json({quests, locations});
    } catch (error) {
        next(error)
    }
}