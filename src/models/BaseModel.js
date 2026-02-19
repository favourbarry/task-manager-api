const { Model } = require("objection");

class BaseModel extends Model {
    static get tableName() {
        return "users";
    }
    static get idColumn(){
        return "id";
    }
    static get relationMappings(){
        const Task = require("./task.model");

        return {
            tasks: {
                modelClass: Task,
                join: {
                    from: "users.id",
                    to: "tasks.user_id"
                }
            }
        }
    }

}

module.exports = BaseModel;
