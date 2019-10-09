 DROP TABLE IF EXISTS signatures;

 CREATE TABLE signatures(
   id SERIAL PRIMARY KEY,
   first VARCHAR(200)NOT NULL CHECK (first !=''),
   last VARCHAR(200)NOT NULL CHECK (last !=''),
   signature TEXT NOT NULL,
   user_id INT --REFERENCES users(id)

 );

 -- ALTER TABLE signatures ADD COLUMN  user_id INT REFERENCES users(id);
 INSERT INTO signatures(first,last,signature,user_id)VALUES('gfghch','hgfdhf','hgfhcfs',7);
 INSERT INTO signatures(first,last,signature,user_id)VALUES('gfghch','hgfdhf','hgfhcfs',3);
 INSERT INTO signatures(first,last,signature,user_id)VALUES('gfghch','hgfdhf','hgfhcfs',5);
 INSERT INTO signatures(first,last,signature,user_id)VALUES('gfghch','hgfdhf','hgfhcfs',1);
 INSERT INTO signatures(first,last,signature,user_id)VALUES('gfghch','hgfdhf','hgfhcfs',10);
 SELECT * FROM signatures;
