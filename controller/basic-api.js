import { createError } from "../util/createError.js";
import { logger } from "../util/logger.js";

export function helloWorld(req, res, next) {
    return res.json({ msg: "hello world !" })
}

export function de(req, res, next) {
    try {
        const body = req.body;
        const param = req.params.id;

        // next(createError(404, "bad req"))
        // const x = int(param)/0
    
        logger.info("hi :)");

        return res.json({
            msg: "test post",
            body: body.hi,
            // param1: x,
            param2: param
            }
        )
    } catch (error) {
        next(error)
    }
}