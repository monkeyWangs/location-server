CREATE TABLE IF NOT EXISTS  `product`(
  `id`  INT(20) not null AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `sales` bigint(20) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `tag` int(4) DEFAULT NULL,
  `mainImg` varchar(255) DEFAULT NULL,
  `detailImg` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=innodb DEFAULT CHARSET=utf8;
INSERT INTO product (name,price,sales,origin,description,create_time, tag, mainImg) VALUES ('口红','100',8,'france','来自法国的口红','1519646501732', 1, 'https://img.alicdn.com/imgextra/i2/2549841410/TB2wLOsxUhnpuFjSZFEXXX0PFXa_!!2549841410.jpg_430x430q90.jpg');