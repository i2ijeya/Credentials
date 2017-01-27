create table credential.user(

  USER_EMAIL CHAR(40) NOT NULL,
  USER_PASSWORD CHAR(150) NOT NULL,
  PRIMARY KEY(USER_EMAIL)
);

drop table credentials.user
  
ALTER TABLE credential.user ADD INDEX (USER_EMAIL);