import Quest from '../model/quest.js'
import { createError } from "../util/createError.js"

export const getSearch = async (req, res, next) => {
    try {
        const { questName, timeStart, timeEnd, tagId } = req.query;

        const query = {};

        if (questName) {
            query.questName = { $regex: questName, $options: "i" };
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

        const quests = await Quest.find(query);

        return res.json(quests);
    } catch (error) {
        next(error)
    }
}