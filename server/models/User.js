import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    img: {
        type: DataTypes.STRING,
        defaultValue: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
    },
    subscribers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    subscribedUsers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    fromGoogle:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

}, {
    tableName: 'users',
    timestamps: true,
});

export default User;