import { Request, Response, Router } from 'express'
import { DB, admins } from '../repositories/mongo-db'
import {
    TypeOfRequestP, TypeOfRequestBody, TypeOfRequestP_Body,
    PostViewModel, PostInputModel
} from "../types/models"

import basicAuth from "express-basic-auth"
import { Result, validationResult } from "express-validator";
import { postVdChain } from "../inputValidation";
import {postsRepo} from "../repositories/posts-repository";

export const postsRouter = Router({})



postsRouter.post('/', basicAuth({users: admins}), postVdChain, async (req: TypeOfRequestBody<PostInputModel>, res: Response) => {

    const result: Result = validationResult(req);

    if (result.isEmpty()) {

        const newEntry: PostViewModel = {
            id: await postsRepo.newID(),
            blogId: req.body.blogId,
            blogName: await DB.getProperty('blogs', req.body.blogId, 'name'),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            createdAt: new Date().toISOString()
        }

        await postsRepo.create({ ...newEntry })
        res.status(201).json(newEntry)
    } else {
        res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
    }
})



postsRouter.get('/', async (req: Request, res: Response<Array<object | null>>) => {
    res.status(200).json(await postsRepo.getAll())
})



postsRouter.get('/:id', async (req: TypeOfRequestP<{ id: string }>, res: Response<object | null>) => {

    if (!await postsRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {
        res.status(200).json(await postsRepo.get(req.params.id))
    }
})



postsRouter.put('/:id', basicAuth({users: admins}), postVdChain, async (req: TypeOfRequestP_Body<{ id: string },
    PostInputModel>, res: Response) => {
    if (!await postsRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {

            const updateEntry: PostInputModel = {
                blogId: req.body.blogId,
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content
            }

            await postsRepo.update(req.params.id, updateEntry)
            res.sendStatus(204)

        } else {
            res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
        }
    }
})



postsRouter.delete('/:id', basicAuth({users: admins}), async (req: TypeOfRequestP<{ id: string }>, res: Response) => {
    res.sendStatus(await postsRepo.delete(req.params.id))
})


