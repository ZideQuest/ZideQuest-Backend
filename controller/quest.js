import Quest from '../model/quest.js'
import { createError } from '../util/createError.js'

export const createQuest = async (req, res, next) => {
    try {
        const { id } = req.user
        const { locationId } = req.params

        const quest = await Quest.create(
            {
                ...req.body,
                admindId: id,
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

        const quest = await Quest.findByIdAndUpdate(id, req.body, { new: true })

        if (!quest) {
            return next(createError(400, "Quest not found"))
        }
        return res.json(quest)
    } catch (error) {
        next(error)
    }
}


export const deleteQuestById = async (req, res, next) => {
    try {
        const { id } = req.params

        const quest = await Quest.findByIdAndDelete(id)

        if (!quest) {
            return next(createError(400, "Quest not found"))
        }
        return res.json({ msg: `quest: ${quest.questName} delete successfully` })
    } catch (error) {
        next(error)
    }
}






