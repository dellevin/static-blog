工作中用到了数据库和excel相结合的用法，来针对我这种mysql和excle都半斤八两的人。在mysql中针对数据字段的拼接，用的还不是很熟悉，所以结合了一下excel，但是数据量又很大，在网上找了好多办法，终于找到一个相对适应于自己的使用场景的。

先从MySQL中搜索到对应的数据条目
```mysql
SELECT 
snh.id,
mu.companyName AS '企业名',mu.supplierId AS '供应商id'
,snh.userneeds AS '用户需求' , snh.refuse AS '拒绝原因' ,snh.beizhu AS '备注', snh.createTime AS '创建时间'
,au.`name` AS '创建者'
FROM `表名` as snh 
LEFT JOIN member_user AS mu ON snh.userId = mu.id
LEFT JOIN admin_user AS au on snh.createUser = au.id
ORDER BY snh.createTime DESC
```

然后用navicate导出excel表

导出之后新建字段，拼入自己的excle的函数
```bash
=CONCAT("用户需求:", IF(D2<>"", D2, "无"), " - 拒绝原因:", IF(E2<>"", E2, "无"), " - 备注:", IF(F2<>"", F2, "无"))
```

**在左上角选择自己需要到的行数**
![image-20231022155003247](./assets/wps%20excel%20%E5%90%91%E4%B8%8B%E9%80%89%E4%B8%AD%E6%8C%87%E5%AE%9A%E8%A1%8C%E6%95%B0%E5%B9%B6%E5%A1%AB%E5%85%85%E6%A0%B9%E6%8D%AE%E5%85%AC%E5%BC%8F%E8%AE%A1%E7%AE%97%E5%A5%BD%E7%9A%84%E6%95%B0%E6%8D%AE/image-20231022155003247.png)

**选中之后，按住ctrl+enter（回车）**

**按住ctrl+D 即可填充好计算的结果**

然后就可以填充完毕了，当然在小数据量的时候直接下拉就行，这种方式适合数据量相对大一丢i都的。



