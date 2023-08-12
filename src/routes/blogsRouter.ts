import { Request, Response, Router } from 'express'
import { admins } from '../repositories/mongo-db'
import {
    TypeOfRequestP, TypeOfRequestBody, TypeOfRequestP_Body,
    BlogViewModel, BlogInputModel
} from '../types/models'

import basicAuth from 'express-basic-auth'
import { Result, validationResult } from 'express-validator'
import { blogVdChain } from '../inputValidation'
import { blogsRepo } from '../repositories/blogs-repository'

export const blogsRouter = Router({})



blogsRouter.post('/', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestBody<BlogInputModel>, res: Response) => {

    const result: Result = validationResult(req)

    if (result.isEmpty()) {

        const newEntry: BlogViewModel = {
            id: await blogsRepo.newID(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsRepo.create({ ...newEntry })
        res.status(201).json(newEntry)

    } else {
        res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
    }
})



blogsRouter.get('/', async (req: Request, res: Response<Array<object | null>>) => {
    res.status(200).json(await blogsRepo.getAll())
})



blogsRouter.get('/:id', async (req: TypeOfRequestP<{ id: string }>, res: Response<object | null>) => {

    if (!await blogsRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {
        res.status(200).json(await blogsRepo.get(req.params.id))
    }
})



blogsRouter.put('/:id', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestP_Body<{ id: string },
    BlogInputModel>, res: Response) => {
    if (!await blogsRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {

            const updateEntry: BlogInputModel = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl
            }

            await blogsRepo.update(req.params.id, updateEntry)
            res.sendStatus(204)

        } else {
            res.status(400).json({errorsMessages: result.array().map(({path, msg}) => ({message: msg, field: path}))})
        }
    }
})



blogsRouter.delete('/:id', basicAuth({users: admins}), async (req: TypeOfRequestP<{ id: string }>, res: Response) => {
    res.sendStatus(await blogsRepo.delete(req.params.id))
})


