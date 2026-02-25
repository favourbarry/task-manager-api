const { Model } = require('objection')
class User extends Model {
    static get tableName() {
        return 'users';
    }
    static get idColumn() {
        return "id";
    }
    static get relationMappings() {
        const Task = require('./task.model');
        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: Task,
                join: {
                    from: 'task.user_id',
                    to: 'users.id',
                },
            },
        };
    }

    static async findByEmail(email) {
        return await this.query().where('email', email).skipUndefined().first();
    }

    static async createUser(data) {
        return await this.query().insert(data);
    }
}
module.exports = User;