//Import modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Activity extends Model {

}

Activity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1,50]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: ""
        },
        act_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        distance: {
            type: DataTypes.DECIMAL(10,3),
            allowNull: false
        },
        duration: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        effort_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dist_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id"
            }
        }
    },
    {
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'activity'
    }
);

module.exports = Activity;