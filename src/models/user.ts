
import { DataTypes } from "sequelize"
import { BaseRepository } from "./baseRepo"
import { IUserModel } from "../lib/interface"


const User = {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    full_name: {
        type: DataTypes.STRING,
    },

    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    password: {
        type: DataTypes.STRING,
    }
}

export class UserRepository extends BaseRepository<IUserModel>{
    constructor() {
        super("user", User)
    }
}






