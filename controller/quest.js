import Quest from '../model/quest.js'
import Admin from '../model/admin.js'
import Location from '../model/location.js'
import { createError } from '../util/createError.js'
import { cloudinaryUploadImg } from '../util/cloudinary.js'
import User from '../model/user.js'
import Notification from '../model/notification.js'
import { toDataURL } from 'qrcode'

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
        const quests = await Quest.find({}).populate('tagId')
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

        const userId = req.user?.id

        let isJoin = false
        let isCheckIn = false
        quest.participant.forEach((user) => {
            if (user.userId == userId) {
                isJoin = true
                isCheckIn = user.status
            }
        })

        const questDetail = {
            questName: quest.questName,
            creatorId: quest.creatorId._id,
            creatorName: quest.creatorId.organizeName,
            creatorPic: quest.creatorId?.picturePath,
            locationName: quest.locationId.locationName,
            locationId: quest.locationId._id,
            picturePath: quest.picturePath,
            timeStart: quest.timeStart,
            timeEnd: quest.timeEnd,
            description: quest.description,
            status: quest.status,
            tag: quest.tagId.map(tag => ({ tagName: tag.tagName, tagColor: tag.tagColor, _id: tag._id })),
            countParticipant: quest.countParticipant,
            maxParticipant: quest.maxParticipant,
            activityHour: quest.activityHour,
            isJoin,
            isCheckIn
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
        let quest = await Quest.findById(id).populate("creatorId").populate("locationId").populate("tagId")
        if (!quest) return next(createError(400, "Quest not found"));

        if (quest.status) {
            return next(createError(428, "ended"))
        }

        if (quest.participant.length >= quest.maxParticipant && quest.maxParticipant != null) {
            return next(createError(444, "fulled"))
        }

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
            // pull quest from user.joinedQuest
            await User.findByIdAndUpdate(req.user.id,
                { $pull: { joinedQuest: id } },
                { new: true }
            )
        }

        // join quest
        else {
            // push user to quest.participants
            quest = await Quest.findByIdAndUpdate(
                id,
                { $push: { participant: { userId: req.user.id, status: false } } },
                { new: true }
            );
            // push quest to user.joinedQuest
            await User.findByIdAndUpdate(req.user.id,
                { $push: { joinedQuest: id } },
                { new: true }
            )
        }
        quest.countParticipant = quest.participant.length
        await quest.save()
        const creator = await Admin.findById(quest.creatorId.toString())
        const questDetail = {
            questName: quest.questName,
            creatorName: creator.organizeName,
            creatorPic: creator.picturePath,
            locationName: quest.locationId.locationName,
            picturePath: quest.picturePath,
            timeStart: quest.timeStart,
            timeEnd: quest.timeEnd,
            status: quest.status,
            description: quest.description,
            tag: tagNames,
            countParticipant: quest.countParticipant,
            maxParticipant: quest.maxParticipant,
            isjoin: !alreadyJoin
        }
        console.log("bug")
        return res.json({ questDetail });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const getQuestParticipantsById = async (req, res, next) => {
    try {
        const { id } = req.params
        const quest = await Quest.findById(id).select('participant').populate({
            path: 'participant.userId',
            select: 'firstName lastName picturePath',
        }).populate('tagId')
        if (!quest) {
            return next(createError(400, "Quest not found"))
        }

        const participant = quest.participant.map((item) => {
            return ({ user: item.userId, status: item.status, pic: item.picturePath })
        })

        const response = {
            questId: id,
            participant
        }
        return res.json(response)
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

        if (quest.status == true) {
            return next(createError(301, "This quest is already complete"))
        }

        const actualQuestTime = (quest.timeEnd - quest.timeStart) / (1000 * 60 * 60)
        const xpGiven = Math.floor(actualQuestTime * 1237.6)

        // ถ้าเควสไม่มีชั่วโมงกิจกรรม
        // console.log(quest)
        if (!quest.activityHour?.hour) {
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
                    console.log(user.activityTranscript)
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
                    user.activityTranscript.category.empowerment.category[index].hour += hour
                    user.activityTranscript.category.empowerment.category[index].count += 1
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
        // set quest complete
        quest.status = true
        await quest.save()
        return res.json({ msg: `quest: ${quest.questName} complete successfully` });
    } catch (error) {
        // console.log(error)
        next(error);
    }
}

export const recommendQuest = async (req, res, next) => {
    try {
        const quests = await Quest.find({ status: false }).limit(4).populate('creatorId').populate('locationId').populate('tagId')

        return res.json(quests)

    } catch (error) {
        next(error)
    }
}

export const getCreatorQuests = async (req, res, next) => {
    try {
        const { id } = req.user
        const quests = await Quest.find({ creatorId: id }).sort("timeStart").populate("locationId").populate('tagId')
        return res.json(quests)
    } catch (error) {
        next(error)
    }
}

export const getUncompleteCreatorQuest = async (req, res, next) => {
    try {
        const { id } = req.user
        const quests = await Quest.find({ creatorId: id, status: false }).sort("timeStart").populate("locationId").populate('tagId')
        return res.json(quests)
    } catch (error) {
        next(error)
    }
}

export const getQuestQr = async (req, res, next) => {
    try {
        const { id } = await req.params
        const qrCodeDataUrl = await toDataURL(`/quests/${id}/attend`);
        const qrPath = await cloudinaryUploadImg(qrCodeDataUrl);
        const quest = await Quest.findById(id);

        return res.json({
            questName: quest.questName,
            picturePath: qrPath
        });
    }
    catch (error) {
        next(error);
    }
}

export const userAttend = async (req, res, next) => {
    try {
        const { id } = req.params;
        let quest = await Quest.findById(id).populate("creatorId").populate("locationId").populate("tagId")
        if (!quest) return next(createError(400, "Quest not found"));

        if (quest.status) {
            return next(createError(456, "Ended"))
        }

        // if already started: only alreadyJoin can check attendance
        const currentDate = new Date();
        const alreadyJoin = quest.participant.find((user) => user.userId == req.user.id);
        if ((!alreadyJoin) && currentDate < quest.timeStart) {
            if (quest.countParticipant >= quest.maxParticipant) {
                return next(createError(444, "fulled"))
            }

            await Quest.findByIdAndUpdate(
                id,
                { $push: { participant: { userId: req.user.id, status: false } } },
            );
            await User.findByIdAndUpdate(
                req.user.id,
                { $push: { joinedQuest: id } },
            )

        }
        if (alreadyJoin) {
            quest = await Quest.findByIdAndUpdate(
                id,
                { participant: { userId: req.user.id, status: false } },
            );
        }

        quest = await Quest.findByIdAndUpdate(
            id,
            {
                $set: { 'participant.$[elem].status': true }
            },
            { arrayFilters: [{ 'elem.userId': req.user.id, }], new: true },
            { new: true }
        ).populate("creatorId").populate("locationId").populate("tagId")

        quest.countParticipant = quest.participant.length
        await quest.save()

        return res.json(quest);
    }
    catch (error) {
        next(error);
    }
}

export const creatorRemoveUser = async (req, res, next) => {
    try {
        const { questId } = req.params;
        let quest = await Quest.findById(questId);
        if (!quest) { return next(createError(400, "Quest not found")); }

        // validate creator or admin
        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to manage this quest"));
            }
        }

        if (quest.status == true) {
            return next(createError(301, "This quest is already complete"))
        }

        // check that user is in quest
        const { users } = req.body;
        for (const userId of users) {
            const participantIndex = quest.participant.findIndex((user) => user.userId == userId);

            if (participantIndex === -1) {
                return next(createError(400, `User ${userId} not in quest`));
            }

            // Remove user from the participant array
            quest.participant.splice(participantIndex, 1);

            // Remove the quest from the user's joinedQuest array
            await User.findByIdAndUpdate(
                userId,
                { $pull: { joinedQuest: questId } },
                { new: true }
            );
        }

        // Update the quest's countParticipant
        quest.countParticipant = quest.participant.length;
        await quest.save();
        return res.json({ msg: `user: ${users} remove from quest: ${questId} successfully` });
    } catch (error) {
        next(error)
    }
}

export const creatorCheckUser = async (req, res, next) => {
    try {
        const { questId } = req.params;
        const quest = await Quest.findById(questId);
        if (!quest) { return next(createError(400, "Quest not found")); }

        // validate creator or admin
        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to manage this quest"));
            }
        }

        if (quest.status == true) {
            return next(createError(301, "This quest is already complete"))
        }

        // check that user is in quest
        const { users } = req.body;
        users.forEach(async (userId, index) => {
            const alreadyJoin = quest.participant.find((user) => user.userId == userId);

            if (!alreadyJoin) {
                return next(createError(400, `User ${userId} not in quest`))
            }

            await Quest.findByIdAndUpdate(
                questId,
                {
                    $set: { 'participant.$[elem].status': true }
                },
                {
                    arrayFilters: [{ 'elem.userId': userId, }], new: true
                },
                {
                    new: true
                }
            )
        })
        return res.json({ msg: `user: ${users} has been check with quest: ${questId} successfully` });
    } catch (error) {
        next(error)
    }
}

export const creatorUnCheckUser = async (req, res, next) => {
    try {
        const { questId } = req.params;
        const quest = await Quest.findById(questId);
        if (!quest) { return next(createError(400, "Quest not found")); }

        // validate creator or admin
        if (req.user.role === "creator") {
            const currentOrganizeName = (await Admin.findById(req.user.id)).organizeName;
            const creatorOrganizeName = (await Admin.findById(quest.creatorId)).organizeName;
            if (currentOrganizeName !== creatorOrganizeName) {
                return next(createError(401, "You are not allowed to manage this quest"));
            }
        }

        if (quest.status == true) {
            return next(createError(301, "This quest is already complete"))
        }

        // check that user is in quest
        const { users } = req.body;
        users.forEach(async (userId, index) => {
            const alreadyJoin = quest.participant.find((user) => user.userId == userId);

            if (!alreadyJoin) {
                return next(createError(400, `User ${userId} not in quest`))
            }

            await Quest.findByIdAndUpdate(
                questId,
                {
                    $set: { 'participant.$[elem].status': false }
                },
                {
                    arrayFilters: [{ 'elem.userId': userId, }], new: true
                },
                {
                    new: true
                }
            )
        })
        return res.json({ msg: `user: ${users} has been un-check with quest: ${questId} successfully` });
    } catch (error) {
        next(error)
    }
}


export const cancelQuest = async (req, res, next) => {
    try {
        const { questId } = req.params
        const { message } = req.body

        const notification = await Notification.create({
            questId: questId,
            message: message
        })

        const quest = await Quest.findByIdAndUpdate(questId, {
            isCancel: true,
            $push: { notifications: notification._id }
        }, { new: true })

        const { participant } = quest

        await User.updateMany(
            { _id: { $in: participant.map(participant => participant.userId) } },
            { $push: { notifications: notification._id } },
        )

        return res.json(notification);
    }
    catch (error) {
        console.log(error)
        next(error);
    }
}