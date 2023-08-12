import { DB } from './mongo-db'
import { PostInputModel, PostViewModel } from '../types/models'

export const postsRepo = {

    async create(input: PostViewModel) {
        await DB.create('posts', input)
    },

    async get(id: string): Promise<PostViewModel | null> {
        return await DB.get('posts', id) as PostViewModel | null
    },

    async getAll(): Promise<Array<PostViewModel | null>> {
        return await DB.getAll('posts') as Array<PostViewModel | null>
    },

    async update(id: string, input: PostInputModel) {
        await DB.update('posts', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('posts', id)
    },

    async newID(): Promise<string> {
        return DB.generateUUID()
    },

    async exists(id: string): Promise<boolean> {
        return DB.exists('posts', id)
    }

}


