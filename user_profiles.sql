CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE
);



-- SELECT users.first,users.last,user_p rofiles.age,user_profiles.city FROM users INNER JOIN user_profiles ON users.id=user_profiles.user_id;
-- SELECT users.first,users.last,user_profiles.age,user_profiles.city FROM users INNER JOIN user_profiles ON users.id=user_profiles.user_id;

-- SELECT users.first,users.last,user_profiles.age,user_profiles.city FROM users INNER JOIN user_profiles ON users.id=user_profiles.user_id  INNER JOIN signatures ON users.id=signatures.user_id;
