SET foreign_key_checks = 0;
drop table if exists usernames;

create table usernames (
    username varchar(100) not null,
    primary key (username),
    unique index username_index (username asc)
);

insert into usernames (username) values ('Orly_repudiative_59937');