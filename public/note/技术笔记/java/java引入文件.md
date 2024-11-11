好久没写java，差点都忘了。。。

起因是一个资源文件在resources目录下面，转换后的地址类型是string类型不是file，于是用类加载器获取文件资源路径

```java
String dbPath = GetIpAddr.class.getClassLoader().getResource("ip2region/ip2region.xdb").getPath();
```

但是这样在编译部署完毕后会报错

```java
Generating unique operation named: userInfoUsingGET_1
2024-09-26 17:15:40.345  INFO 3992 --- [nio-8081-exec-1] o.a.c.c.C.[.[localhost].[/sys_api]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
failed to load vector index from file:/C:/Users/Administrator/Desktop/jar/api.jar!/BOOT-INF/classes!/ip2region/ip2region.xdb: java.io.FileNotFoundException: file:\C:\Users\Administrator\Desktop\jar\api.jar!\BOOT-INF\classes!\ip2region\ip2region.xdb (文件名、目录名或卷标语法不正确。)
2024-09-26 17:15:40.664 ERROR 3992 --- [nio-8081-exec-1] i.d.exception.RenExceptionHandler        :
### Error updating database.  Cause: com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: Data truncation: Data too long for column 'ip_addr' at row 1
### The error may exist in URL [jar:file:/C:/Users/Administrator/Desktop/jar/api.jar!/BOOT-INF/classes!/mapper/MarkVisiter.xml]
### The error may involve io.dellevin.dao.MarkVisiterDao.insertVisitRecord-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO mark_visiter             ( visit_url, ip, ip_addr, create_time)         VALUES             (                  ?, ?, ?, NOW()             )
### Cause: com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: Data truncation: Data too long for column 'ip_addr' at row 1
; Data truncation: Data too long for column 'ip_addr' at row 1; nested exception is com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: Data truncation: Data too long for column 'ip_addr' at row 1

org.springframework.dao.DataIntegrityViolationException:
```

只能用流方式加载文件，于是采用如下方式：可以使用一个临时文件来处理这个问题。首先读取输入流，然后将其写入一个临时文件，最后将该临时文件的路径作为 `dbPath`

```java
String dbPath = null;

        // 1、从 dbPath 中预先加载 VectorIndex 缓存
        try (InputStream inputStream = GetIpAddr.class.getClassLoader().getResourceAsStream("ip2region/ip2region.xdb")) {
            if (inputStream == null) {
                throw new FileNotFoundException("Resource not found: ip2region/ip2region.xdb");
            }

            // 创建临时文件
            File tempFile = Files.createTempFile("ip2region", ".xdb").toFile();
            try (FileOutputStream outputStream = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            // 获取临时文件路径
            dbPath = tempFile.getAbsolutePath();
        } catch (IOException e) {
            System.out.printf("failed to load vector index: %s\n", e);
            return "failed to load vector index: " + e + " ";
        }
```



