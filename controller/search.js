import Quest from '../model/quest.js'
import { createError } from "../util/createError.js"

export const getSearch = async (req, res, next) => {
    try {
        const { Name, timeStart, timeEnd, tagId} = req.query;

        const query = {};
        if (Name) {
            query.questName = { $regex: Name, $options: "i" } ;
        }

        if (timeStart) {
            query.timeStart = { $gte: new Date(timeStart) };
        }

        if (timeEnd) {
            query.timeEnd = { $lte: new Date(timeEnd) };
        }

        if (tagId) {
            if (Array.isArray(tagId)) {
                query.tagId = { $in: tagId };
            } else {
                query.tagId = tagId;
            }
        }
        const quests = await Quest.find(query);
        const filteredQuests = quests.filter(quest => quest.status === false);
        return res.json(filteredQuests);
    } catch (error) {
        next(error)
    }
}