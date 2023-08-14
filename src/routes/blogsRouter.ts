import { Response, Router } from 'express'
import { admins } from '../repositories/mongo-db'
import {
    TypeOfRequestP,
    TypeOfRequestBody,
    TypeOfRequestP_Body,
    BlogInputModel,
    TypeOfRequestP_Query,
    BlogPostInputModel,
    Paginator,
    BlogViewModel,
    APIErrorResult,
    TypeOfRequestQuery, PostViewModel
} from '../types/models'

import basicAuth from 'express-basic-auth'
import { Result, validationResult } from 'express-validator'
import { blogPostVdChain, blogVdChain } from '../inputValidation'
import { blogsService } from '../domain/blogs-service'
import { ErrorMapper } from '../utils/errorMapper'
import { blogsQueryRepo } from '../repositories/blogs-query-repository'
import { postsQueryRepo } from "../repositories/posts-query-repository";
import { postsService } from "../domain/posts-service";

export const blogsRouter = Router({})



blogsRouter.post('/', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestBody<BlogInputModel>, res: Response<BlogViewModel | APIErrorResult>) => {

    const result: Result = validationResult(req)

    if (result.isEmpty()) {
        res.status(201).json(await blogsService.create(req))
    } else {
        res.status(400).json(await ErrorMapper(result))
    }

})



blogsRouter.post('/:id/posts', basicAuth({users: admins}), blogPostVdChain, async (req: TypeOfRequestP_Body<{ id: string }, BlogPostInputModel>, res: Response<PostViewModel | APIErrorResult>) => {

    const result: Result = validationResult(req)

    if (result.isEmpty()) {
        res.status(201).json(await postsService.createByBlog(req, req.params.id))
    } else {
        res.status(400).json(await ErrorMapper(result))
    }

})



blogsRouter.get('/', async (req: TypeOfRequestQuery<{
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string }>, res: Response<Paginator<BlogViewModel | null>>) => {

    res.status(200).json(await blogsQueryRepo.getAll(req))
})



blogsRouter.get('/:id', async (req: TypeOfRequestP<{ id: string }>, res: Response<BlogViewModel | null>) => {

    if (!await blogsQueryRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {
        res.status(200).json(await blogsQueryRepo.get(req.params.id))
    }
})



blogsRouter.get('/:id/posts', async (req: TypeOfRequestP_Query<{ id: string }, {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string }>, res: Response<object | null>) => {

    if (!await blogsQueryRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {
        //all posts for current blog
        res.status(200).json(await postsQueryRepo.getAllByBlog(req))
    }
})



blogsRouter.put('/:id', basicAuth({users: admins}), blogVdChain, async (req: TypeOfRequestP_Body<{ id: string },
    BlogInputModel>, res: Response) => {
    if (!await blogsQueryRepo.exists(req.params.id)) {
        res.sendStatus(404)
    } else {

        const result: Result = validationResult(req)

        if (result.isEmpty()) {
            res.sendStatus(await blogsService.update(req))
        } else {
            res.status(400).json(await ErrorMapper(result))
        }
    }
})



blogsRouter.delete('/:id', basicAuth({users: admins}), async (req: TypeOfRequestP<{ id: string }>, res: Response) => {
    res.sendStatus(await blogsService.delete(req))
})


