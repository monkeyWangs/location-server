CREATE TABLE IF NOT EXISTS  `users`(
  `id`  INT(20) not null AUTO_INCREMENT,
  `nick_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `gender` int(4) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `primaryId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=innodb DEFAULT CHARSET=utf8;