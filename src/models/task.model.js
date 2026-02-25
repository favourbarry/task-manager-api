const BaseModel = require('./BaseModel');
const db = require('../config/knex');

class Task extends BaseModel{
    static get tableName() {
        return "tasks";
    }
    static get idColumn(){
        return "id";
    }
    static get relationsMappings(){
        const User = require('./user.model');
        return {
            user: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "user.user_id",
                    to: 'tasks.user'
                }
            }
        }
    }
}

module.exports = {
    Task,
    create: async (data, userId) => {
        return await db('tasks').insert({...data, user_id: userId}).returning('*');
    },
    findAll: async () => {
        return await db('tasks').select('*');
    }
};