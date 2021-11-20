//Import modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Split extends Model {}

Split.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        dist_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        activity_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "activity",
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
        modelName: 'split'
    }
);

module.exports = Split;