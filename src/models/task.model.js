const BaseModel = require('./BaseModel');

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
module.exports = Task;