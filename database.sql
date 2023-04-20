-- DROP DATABASE stresstest;
-- CREATE DATABASE stresstest;
-- USE [stresstest];

DROP TABLE IF EXISTS oikeudet;
DROP TABLE IF EXISTS henkilo;
DROP TABLE IF EXISTS kortti;

CREATE TABLE henkilo (
    id SERIAL NOT NULL,
    nimi VARCHAR(5) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE kortti (
    id SERIAL NOT NULL,
    teksti VARCHAR(64) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE oikeudet (
    henkilo_id INT NOT NULL,
    kortti_id INT NOT NULL,
    hallitsija BOOLEAN NOT NULL,
    FOREIGN KEY (henkilo_id) REFERENCES henkilo(id),
    FOREIGN KEY (kortti_id) REFERENCES kortti(id),
    PRIMARY KEY (henkilo_id, kortti_id)
);

DO $$
DECLARE i INTEGER;
BEGIN
i := 1;

WHILE i <= 10000 LOOP
   INSERT INTO henkilo (nimi) VALUES (CAST(i AS varchar(5)));
   i := i + 1;
END LOOP;

i := 1;
WHILE i <= 50000 LOOP
   INSERT INTO kortti (teksti) VALUES (CONCAT('Kortin ', CAST(i AS varchar(64)), ' teksti'));
   i := i + 1;
END LOOP;

-- there will be some empty cards but thats ok
i := 1;
WHILE i < 10000 LOOP
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i, true);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 10000, true);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 20000, true);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 30000, true);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 40000, true);

   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i + 1, i, false);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i + 1, i + 10000, false);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i + 1, i + 20000, false);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i + 1, i + 30000, false);
   INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i + 1, i + 40000, false);
   i := i + 1;
END LOOP;
-- insert the last person as well (id 9999)
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i, true);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 10000, true);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 20000, true);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 30000, true);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (i, i + 40000, true);

INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (1, i, false);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (1, i + 10000, false);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (1, i + 20000, false);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (1, i + 30000, false);
INSERT INTO oikeudet (henkilo_id, kortti_id, hallitsija) VALUES (1, i + 40000, false);
END $$;