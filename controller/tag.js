import Tag from "../model/tag.js"
import { createError } from "../util/createError.js"
import { generateColor } from "../util/generateTagColor.js"
export const createTag = async (req, res, next) => {
    try {
        const { tagName } = req.body
        const newtag = await Tag.create({
            tagName: tagName
        })
        return res.json(newtag)
    } catch (error) {
        next(error)
    }
}

export const getTag = async (req, res, next) => {
    try {
        const tag = await Tag.find({}).select('tagName').select('_id')
        return res.json(tag)
    } catch (error) {
        next(error)
    }
}

export const getTagById = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id).select('tagName').select('_id')
        if (!tag) return next(createError(400, "Tag not found"))

        return res.json(tag)
    } catch (error) {
        next(error)
    }
}

export const deleteTagById = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id)
        if (!tag) return next(createError(400, "Tag not found"))

        return res.json({ msg: `Delete Tag: ${tag.tagName} successfully` })
    } catch (error) {
        next(error)
    }
}

export const updateTagById = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!tag) return next(createError(400, "Tag not found"))

        return res.json({ msg: `Update Tag: ${tag.tagName} successfully` })
    } catch (error) {
        next(error)
    }
}

export const getTagColor = async (req, res, next) => {
    try {
        const tag = await Tag.find({})
        tag.forEach(async (item) => {
            item.tagColor = generateColor()
            await item.save()
        })
        return res.json(tag)
    } catch (error) {
        next(error)
    }
}