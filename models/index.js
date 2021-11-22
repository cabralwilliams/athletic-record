//Import models
const User = require("./User");
const Activity = require("./Activity");
const Split = require("./Split");
const Comment = require("./Comment");

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

Comment.belongsTo(User, {
    foreignKey: "user_id"
});

User.hasMany(Comment, {
    foreignKey: "user_id"
});

Comment.belongsTo(Activity, {
    foreignKey: "activity_id"
});

Activity.hasMany(Comment, {
    foreignKey: "activity_id"
});

User.belongsToMany(Activity, {
    through: Comment,
    as: "commented_activity",
    foreignKey: "user_id"
});

Activity.belongsToMany(User, {
    through: Comment,
    as: "commented_activity",
    foreignKey: "activity_id"
});

module.exports = { User, Activity, Split, Comment };