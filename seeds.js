const sequelize = require('./config/connection');
const { User, Activity, Split, Comment, Follower, History, Lap } = require('./models');

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

const histories = [
    {
        title: "Women's Outdoor Distance Medley World Record",
        description: "Current world record set by US team of Moser (1200), Richards-Ross (400), Wilson (800), and Rowbury (1600) on May 2, 2015",
        effort_type_id: 2,
        act_date: new Date(2015,4,2),
        distance: 4,
        duration: 636.5,
        type_id: 0,
        dist_type_id: 1
    },
    {
        title: "David Rudisha's Current 800-meter World Record",
        description: "David Rudisha proves that he is the greatest ever at the 800-meter distance at 2012 London Olympics, breaking his own world record and pacing many other records/personal bests.",
        effort_type_id: 2,
        act_date: new Date(2012,7,9),
        distance: 800,
        duration: 100.91,
        type_id: 0,
        dist_type_id: 2
    },
    {
        title: "Janet Evans - 1989 Pan Pacific 800 meters",
        description: "The legendary Janet Evans sets a world record in the 800-meter freestyle that would last almost 19 years",
        effort_type_id: 2,
        act_date: new Date(1989,7,20),
        distance: 800,
        duration: 496.22,
        type_id: 2,
        dist_type_id: 2
    }
]

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
const seedHistory = () => History.bulkCreate(histories);

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

    await seedHistory();
    console.log('\n----- History Seeded ------\n');
}

seedAll();