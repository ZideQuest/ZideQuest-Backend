import Quest from '../model/quest.js'
import Admin from '../model/admin.js'
import Location from '../model/location.js'
import { createError } from '../util/createError.js'
import { cloudinaryUploadImg } from '../util/cloudinary.js'
import User from '../model/user.js'

export const createQuest = async (req, res, next) => {
    try {
        // validate location
        const { id } = req.user
        const { locationId } = req.params
        const location = await Location.findById(locationId)
        if (!location) { return next(createError(400, "Location not found")) }
        // if quest has a picture
        let picturePath = "";
        if (req.file?.path) {
            const newPath = await cloudinaryUploadImg(req.file.path)
            picturePath = newPath.url
        }

        // create quest
        const quest = await Quest.create({
            ...req.body,
            creatorId: id,
            locationId: locationId,
            picturePath
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
        const quest = await Quest.findById(id).populate("creatorId").populate("locationId").populate("tagId")
        if (!quest) {
            return next(createError(400, "Quest not found"))
        }

        const tagNames = quest.tagId.map(tag => ({ tagName: tag.tagName }));
        const userId = req.user?.id

        let isJoin = false
        quest.participant.forEach((user) => {
            if (user.userId == userId) {
                isJoin = true
            }
        })

        const questDetail = {
            questName: quest.questName,
            creatorName: quest.creatorId.organizeName,
            creatorPic: quest.creatorId?.picturePath,
            locationName: quest.locationId.locationName,
            picturePath: quest.picturePath,
            timeStart: quest.timeStart,
            timeEnd: quest.timeEnd,
            description: quest.description,
            status: quest.status,
            tag: tagNames,
            countParticipant: quest.countParticipant,
            maxParticipant: quest.maxParticipant,
            isJoin
        }
        return res.json(questDetail)
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
        if (req.file?.path) {
            const newPath = await cloudinaryUploadImg(req.file.path)
            const picturePath = newPath.url
            updatedQuest.picturePath = picturePath
            await updatedQuest.save()
        }

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
        const tagNames = quest.tagId.map(tag => ({ tagName: tag.tagName }));

        // leave quest
        const alreadyJoin = quest.participant.find((user) => user.userId == req.user.id);
        if (alreadyJoin) {
            // pull user from quest.participants
            quest = await Quest.findByIdAndUpdate(
                id,
                {
                    $pull: { participant: { userId: req.user.id } }
                },
                { new: true }
            )
            await quest.save()
            // pull quest from user.joinedQuest
            await User.findByIdAndUpdate(req.user.id,
                { $pull: { joinedQuest: id } },
                { new: true }
            )
            quest.countParticipant = quest.participant.length
            const questDetail = {
                questName: quest.questName,
                creatorName: quest.creatorId.organizeName,
                creatorPic: quest.creatorId?.picturePath,
                locationName: quest.locationId.locationName,
                picturePath: quest.picturePath,
                timeStart: quest.timeStart,
                timeEnd: quest.timeEnd,
                description: quest.description,
                status: quest.status,
                tag: tagNames,
                countParticipant: quest.countParticipant,
                maxParticipant: quest.maxParticipant,
                isjoin: false
            }

            return res.json({ questDetail });
        }

        // join quest
        // push user to quest.participants
        quest = await Quest.findByIdAndUpdate(
            id,
            { $push: { participant: { userId: req.user.id, status: false } } },
            { new: true }
        );

        const questDetail = {
            questName: quest.questName,
            creatorName: quest.creatorId.organizeName,
            creatorPic: quest.creatorId?.picturePath,
            locationName: quest.locationId.locationName,
            picturePath: quest.picturePath,
            timeStart: quest.timeStart,
            timeEnd: quest.timeEnd,
            description: quest.description,
            status: quest.status,
            tag: tagNames,
            countParticipant: quest.countParticipant,
            maxParticipant: quest.maxParticipant,
            isJoin: true
        }

        // push quest to user.joinedQuest
        await User.findByIdAndUpdate(req.user.id,
            { $push: { joinedQuest: id } },
            { new: true }
        )
        return res.json({ questDetail });
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

export const questComplete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const quest = await Quest.findById(id);
        if (!quest) { return next(createError(400, "Quest not found")); }

        // validate creator or admin
        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to complete this quest"));
            }
        }

        // set quest complete
        quest.status = true
        await quest.save()

        const actualQuestTime = (quest.timeEnd - quest.timeStart) / (1000 * 60 * 60)
        const xpGiven = Math.floor(actualQuestTime * 1237.6)

        // ถ้าเควสไม่มีชั่วโมงกิจกรรม
        if (!quest.activityHour) {
            for (const participant of quest.participant) {
                const user = await User.findById(participant.userId)
                user.exp += xpGiven
                await user.save()
            }
        }
        // ถ้าเควสมี ชั่วโมงกิจกรรม
        else {
            const { category, hour } = quest.activityHour
            // กิจกรรมมหาวิทยาลัย
            if (category === "1") {
                for (const participant of quest.participant) {
                    const user = await User.findById(participant.userId)
                    user.activityTranscript.category.university.hour += hour
                    user.activityTranscript.category.university.count += 1
                    user.exp += xpGiven
                    await user.save()
                }
            }
            // กิจกรรมเพื่อเสริมสร้างสมรรถนะ
            else if (category === "2.1" || category === "2.2" || category === "2.3" || category === "2.4") {
                let index;
                if (category === "2.1") index = "morality"
                else if (category === "2.2") index = "thingking"
                else if (category === "2.3") index = "relation"
                else if (category === "2.4") index = "health"

                for (const participant of quest.participant) {
                    const user = await User.findById(participant.userId)
                    user.activityTranscript.category.empowerment.category["index"].hour += hour
                    user.activityTranscript.category.empowerment.category["index"].count += 1
                    user.exp += xpGiven
                    await user.save()
                }
            }
            // กิจกรรมเพื่อเสริมสร้างสมรรถนะ
            else {
                for (const participant of quest.participant) {
                    const user = await User.findById(participant.userId)
                    user.activityTranscript.category.university.hour += hour
                    user.activityTranscript.category.university.count += 1
                    user.exp += xpGiven
                    await user.save()
                }
            }
        }
        return res.json({ msg: `quest: ${quest.questName} complete successfully` });
    } catch (error) {
        next(error);
    }
}

export const recommendQuest = async (req, res, next) => {
    try {
        const quests = await Quest.find({ status: false }).limit(4)
        return res.json(quests)
    } catch (error) {
        next(error)
    }
}