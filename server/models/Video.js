import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.js";

const Video = sequelize.define('Video', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
    },
    videoUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://youtu.be/HNhqX3eeX5M",
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    dislikes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },

}, {
    tableName: 'videos',
    timestamps: true,
});

export default Video;