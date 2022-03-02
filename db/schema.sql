DROP TABLE IF EXISTS follower;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS split;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL
);

CREATE TABLE activity (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    effort_type_id INTEGER NOT NULL,
    act_date DATE NOT NULL,
    distance DECIMAL(10,3) NOT NULL,
    duration DECIMAL(10,2) NOT NULL,
    type_id INTEGER NOT NULL,
    dist_type_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE split (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(10,3) NOT NULL,
    duration DECIMAL(10,2) NOT NULL,
    dist_type_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    CONSTRAINT fk_activity FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE
);

CREATE TABLE comment (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    comment_text TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    CONSTRAINT fk_user_c FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_c FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE
);

CREATE TABLE follower (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followee_id INTEGER NOT NULL,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_followee FOREIGN KEY (followee_id) REFERENCES user(id) ON DELETE CASCADE
);