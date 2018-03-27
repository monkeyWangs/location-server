CREATE TABLE IF NOT EXISTS  `collection`(
  `id`  INT(20) not null AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `product_id` INT(20) DEFAULT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=innodb DEFAULT CHARSET=utf8;