INSERT INTO user (username, email, password)
VALUES
    ('Cabby','cabby@email.com','password'),
    ('Cab','cab@email.com','password'),
    ('Cabral','cabral@email.com','password'),
    ('Kbral','kbral@email.com','password'),
    ('theCMan','cman@email.com','password');

INSERT INTO activity (title, description, effort_type_id, act_date, distance, duration, type_id, dist_type_id, user_id)
VALUES
    ('Super Slow Run','I''m just trying to slowly get into the swing of things!',0,'2022-02-24',5,2670,0,0,1),
    ('Mid-Winter Dash','A race in Houston during the middle of the winter.',2,'2022-02-19',5,1182,0,1,2);

INSERT INTO split (distance, duration, dist_type_id, group_id, activity_id)
VALUES
    (1,536,0,0,1),
    (1,535,0,0,1),
    (1,534,0,0,1),
    (1,533,0,0,1),
    (1,532,0,0,1),
    (1,385,0,0,2),
    (1,384,0,0,2),
    (1,317,0,0,2),
    (0.107,36,0,0,2);

INSERT INTO comment (comment_text, user_id, activity_id)
VALUES
    ('That was an extremely fast race, Cab!',4,2),
    ('Thanks, Kbral!',4,2);