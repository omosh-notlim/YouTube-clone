import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.js";

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    tableName: 'comments',
    timestamps: true,
});

export default Comment;