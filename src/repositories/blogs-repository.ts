import { DB } from './mongo-db'
import { BlogInputModel, BlogViewModel } from '../types/models'

export const blogsRepo = {

    async create(input: BlogViewModel) {
        await DB.create('blogs', input)
    },

    async get(id: string): Promise<BlogViewModel | null> {
        return await DB.get('blogs', id) as BlogViewModel | null
    },

    async getAll(): Promise<Array<BlogViewModel | null>> {
        return await DB.getAll('blogs') as Array<BlogViewModel | null>
    },

    async update(id: string, input: BlogInputModel) {
        await DB.update('blogs', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('blogs', id)
    },

    async newID(): Promise<string> {
        return DB.generateUUID()
    },

    async exists(id: string): Promise<boolean> {
        return DB.exists('blogs', id)
    }

}


