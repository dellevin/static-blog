今天遇到了一个简单的场景，需要sql连接两个字段显示。

语法是这样的

```mysql
SELECT CONCAT_WS(' ',snh.userneeds, snh.beizhu) AS connect_info  ,snh.createTime, lmu.createTime as regTime
FROM  `supplier_needs_history` as snh
LEFT JOIN member_user as mu
ON snh.userId = mu.id
LEFT JOIN login_member_user as lmu
on mu.companyCode  = lmu.companyCode
WHERE mu.companyName ='诚润建工集团有限公司'
ORDER BY snh.createTime DESC
LIMIT 3;
```

一开始用的是CONCA函数，但是当时出现了以下的情况

![3fd146fb62442730cca16bc014011f6](./assets/mysql%E7%9A%84%E8%BF%9E%E6%8E%A5%E5%87%BD%E6%95%B0/3fd146fb62442730cca16bc014011f6.png)

也就是说，当我连接的两个字段里面其中一个为null的时候，拼接后的结果也是null

在查询之后使用了CONCAT_WS函数

这是结果

![d1b107f7bf219f8976f198856647cf1](./assets/mysql%E7%9A%84%E8%BF%9E%E6%8E%A5%E5%87%BD%E6%95%B0/d1b107f7bf219f8976f198856647cf1.png)



1. `CONCAT()`: `CONCAT()` 函数用于拼接两个或多个字符串。
   
   ```sql
   SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;
   ```
   
2. `CONCAT_WS()`: `CONCAT_WS()` 函数用于拼接字符串，并在每个字符串之间插入指定的分隔符。
   
   ```sql
   SELECT CONCAT_WS(', ', last_name, first_name) AS full_name FROM employees;
   ```
   
3. `CONCAT_NULL_YIELDS_NULL`: 这是 MySQL 的系统变量，用于控制拼接操作的行为。如果设置为 `ON`（默认值），当任何一个操作数为 `NULL` 时，拼接结果将为 `NULL`。如果设置为 `OFF`，则不会将 `NULL` 视为 `NULL`。
   
4. 字符串运算符 (`||`): MySQL 支持标准 SQL 中的字符串拼接运算符 `||`。
   ```sql
   SELECT first_name || ' ' || last_name AS full_name FROM employees;
   ```

这些函数和运算符允许您在 SQL 查询中执行字符串拼接操作。您可以根据自己的需求选择适当的函数或运算符。