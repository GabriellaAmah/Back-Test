import { Model, ModelAttributes } from "sequelize";
import { db } from '../db/dbConnection';
import { BaseModel } from "../lib/interface";

const sequelize = db.getConnection()

export class BaseRepository<TModel> {
    model: any;
    private name: string

    constructor(name: string, schema: ModelAttributes) {
        this.name = name
        this.model = sequelize.define(this.name, schema)
    }

    async create(values: TModel): Promise<BaseModel<TModel>> {
        try {
            const data = await Promise.resolve(this.model.create(values).then((data: any) => data))
            return data.dataValues
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async update(query: BaseModel<TModel>, values: BaseModel<TModel>): Promise<void> {
        try {
            await this.model.update({ ...values }, {
                where: { ...query }
            });
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async findOne(query: BaseModel<TModel>): Promise<BaseModel<TModel>> {
        try {
            const data = await this.model.findOne({ where: { ...query } });
            return data ? data.dataValues : null
        } catch (err) {
            return Promise.reject(err)
        }
    }
}