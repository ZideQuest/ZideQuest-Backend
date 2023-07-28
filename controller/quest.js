import Quest from '../model/quest.js'
import Admin from '../model/admin.js'
import Location from '../model/location.js'
import { createError } from '../util/createError.js'
import User from '../model/user.js'

export const createQuest = async (req, res, next) => {
    try {
        // validate location
        const { id } = req.user
        const { locationId } = req.params
        const location = await Location.findById(locationId)
        if (!location) { return next(createError(400, "Location not found")) }

        // create quest
        const quest = await Quest.create({
            ...req.body,
            creatorId: id,
            locationId: locationId,
        }
        )
        return res.json(quest)
    } catch (error) {
        next(error)
    }
}
export const getQuest = async (req, res, next) => {
    try {
        const quests = await Quest.find({})
        return res.json(quests)
    } catch (error) {
        next(error)
    }
}

export const getQuestById = async (req, res, next) => {
    try {
        const { id } = req.params
        const quest = await Quest.findById(id)
        if (!quest) {
            return next(createError(400, "Quest not found"))
        }
        return res.json(quest)
    } catch (error) {
        next(error)
    }
}


export const updateQuestById = async (req, res, next) => {
    try {
        const { id } = req.params

        const quest = await Quest.findById(id)
        if (!quest) {
            return next(createError(400, "Quest not found"))
        }

        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to delete this quest"));
            }
        }

        const updatedQuest = await Quest.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updatedQuest)
    } catch (error) {
        next(error)
    }
}


export const deleteQuestById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const quest = await Quest.findById(id);

        if (!quest) {
            return next(createError(400, "Quest not found"));
        }

        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to delete this quest"));
            }
        }

        await quest.deleteOne();
        return res.json({ msg: `quest: ${quest.questName} delete successfully` });
    } catch (error) {
        next(error);
    }
};


export const joinOrLeaveQuest = async (req, res, next) => {
    try {
        const { id } = req.params;
        let quest = await Quest.findById(id);
        if (!quest) return next(createError(400, "Quest not found"));


        // leave quest
        const alreadyJoin = quest.participant.find((user) => user.userId == req.user.id);
        if (alreadyJoin) {
            quest = await Quest.findByIdAndUpdate(
                id,
                { $pull: { participant: { userId: req.user.id } } },
                { new: true }
            )
            return res.json(quest);

        }

        // join quest
        quest = await Quest.findByIdAndUpdate(
            id,
            { $push: { participant: { userId: req.user.id, status: false } } },
            { new: true }
        );

        return res.json(quest);
    } catch (error) {
        next(error);
    }
};

export const getQuestParticipantsById = async (req, res, next) => {
    try {
        const { id } = req.params
        const quest = await Quest.findById(id).select('participant').populate({
            path: 'participant.userId',
            select: 'firstName lastName'
        })
        if (!quest) {
            return next(createError(400, "Quest not found"))
        }
        return res.json(quest)
    } catch (error) {
        next(error)
    }
}





