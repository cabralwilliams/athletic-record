//Import models
const User = require("./User");
const Activity = require("./Activity");
const Split = require("./Split");

User.hasMany(Activity, {
    foreignKey: "user_id"
});

Activity.belongsTo(User, {
    foreignKey: "user_id"
});

Split.belongsTo(Activity, {
    foreignKey: "activity_id"
});

Activity.hasMany(Split, {
    foreignKey: "activity_id"
});

module.exports = { User, Activity, Split };