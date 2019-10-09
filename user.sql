
CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   first VARCHAR NOT NULL,
   last VARCHAR NOT NULL,
   email VARCHAR NOT NULL UNIQUE,
   password VARCHAR NOT NULL

)
 -- CREATE TABLE user_profiles(
 --   id SERIAL PRIMARY KEY,
 --   age INT,
 --   city VARCHAR,
 --   url VARCHAR,
 --   USER_id INT REFERENCES users(id) NOT NULL UNIQUE
 -- );
 SELECT * FROM users;
