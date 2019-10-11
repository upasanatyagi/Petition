 DROP TABLE IF EXISTS signatures;

 CREATE TABLE signatures(
   id SERIAL PRIMARY KEY,
   signature TEXT NOT NULL,
   user_id INT REFERENCES users(id)

 );

 -- ALTER TABLE signatures ADD COLUMN  user_id INT REFERENCES users(id);
 INSERT INTO signatures(signature,user_id)VALUES('hgfhcfs',7);
 INSERT INTO signatures(signature,user_id)VALUES('hgfhcfs',3);
 INSERT INTO signatures(signature,user_id)VALUES('hgfhcfs',5);
 INSERT INTO signatures(signature,user_id)VALUES('hgfhcfs',1);
 INSERT INTO signatures(signature,user_id)VALUES('hgfhcfs',10);
 SELECT * FROM signatures;
