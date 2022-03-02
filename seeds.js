const sequelize = require('./config/connection');
const { User, Activity, Split, Comment, Follower } = require('./models');

const users = [
    {
        username: 'Cabby',
        email: 'cabby@email.com',
        password: 'password'
    },
    {
        username: 'Cab',
        email: 'cab@email.com',
        password: 'password'
    },
    {
        username: 'Cabral',
        email: 'cabral@email.com',
        password: 'password'
    },
    {
        username: 'Kbral',
        email: 'kbral@email.com',
        password: 'password'
    },
    {
        username: 'theCMan',
        email: 'cman@email.com',
        password: 'password'
    }
];

const activities = [
    {
        title: 'Super Slow Run',
        description: "I'm just trying to slowly get into the swing of things!",
        effort_type_id: 0,
        act_date: new Date(),
        distance: 5,
        duration: 2670,
        type_id: 0,
        dist_type_id: 0,
        user_id: 1
    },
    {
        title: 'Mid-Winter Dash',
        description: "A race in Houston during the middle of the winter.",
        effort_type_id: 2,
        act_date: new Date(),
        distance: 5,
        duration: 1182,
        type_id: 0,
        dist_type_id: 1,
        user_id: 2
    }
];

const splits = [
    {
        distance: 1,
        duration: 536,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 1
    },
    {
        distance: 1,
        duration: 535,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 1
    },
    {
        distance: 1,
        duration: 534,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 1
    },
    {
        distance: 1,
        duration: 533,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 1
    },
    {
        distance: 1,
        duration: 532,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 1
    },
    {
        distance: 1,
        duration: 385,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 2
    },
    {
        distance: 1,
        duration: 384,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 2
    },
    {
        distance: 1,
        duration: 377,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 2
    },
    {
        distance: 0.107,
        duration: 36,
        dist_type_id: 0,
        group_id: 0,
        activity_id: 2
    }
];

const comments = [
    {
        comment_text: "That was an extremely fast race, Cab!",
        user_id: 4,
        activity_id: 2
    },
    {
        comment_text: "Thanks, Kbral!",
        user_id: 2,
        activity_id: 2
    }
];

const followers = [
    {
        follower_id: 1,
        followee_id: 2
    },
    {
        follower_id: 2,
        followee_id: 3
    },
    {
        follower_id: 3,
        followee_id: 4
    },
    {
        follower_id: 4,
        followee_id: 5
    },
    {
        follower_id: 5,
        followee_id: 1
    }
];

const seedUsers = async () => {
    for(let i = 0; i < users.length; i++) {
        await User.create(users[i]);
    }
};
const seedActivities = () => Activity.bulkCreate(activities);
const seedSplits = () => Split.bulkCreate(splits);
const seedComments = () => Comment.bulkCreate(comments);
const seedFollowers = () => Follower.bulkCreate(followers);

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n------ Users Seeded ------\n');

    await seedActivities();
    console.log('\n----- Activities Seeded -----\n');

    await seedSplits();
    console.log('\n------ Splits Seeded ------\n');

    await seedComments();
    console.log('\n----- Comments Seeded -----\n');

    await seedFollowers();
    console.log('\n---- Followers Seeded -----\n');
}

seedAll();