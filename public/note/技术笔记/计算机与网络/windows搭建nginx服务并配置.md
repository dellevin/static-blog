下载直接去官网 [nginx.org](https://www.cnblogs.com/taiyonghai/p/nginx.org) ,选择windows版本进行下载

下载完成后，放到服务器指定路径，并开启cmd窗口进行命令行格式的运行。

**启动**

```bat
start nginx
```

**查看任务进程是否存在**

```bat
tasklist /fi "imagename eq nginx.exe"
```

**重新加载**

```bat
nginx -s reload
```

**快速停止**

```bat
nginx -s stop
```

## 简单配置：

首先正常启动是80端口，如果是阿里云服务器需要去安全组放行端口。

再然后是443端口，这里如果需要用到多个的话，我建议是加一个 ‘/’ 用来区分端口例如如下配置

```js

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }


    }
    
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

   server {
        listen       443 ssl;
        server_name  47.121.199.144;

        ssl_certificate         C:/dev/nginx/nginx-1.26.2/nginx-1.26.2/443/certificate.crt;
        ssl_certificate_key     C:/dev/nginx/nginx-1.26.2/nginx-1.26.2/443/private.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location /8081/ {
            proxy_pass http://47.121.199.144:8081/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}

```

其中这里的意思就是
```json
 location /8081/ {
            proxy_pass http://47.121.199.144:8081/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
```

将http://47.121.199.144:8081/这个网址指向https://47.121.199.144/8081/

## 注意：

1.在这里需要注意`C:/dev/nginx/nginx-1.26.2/nginx-1.26.2/443/certificate.crt;`的/ 是向右的。路径使用双反斜杠（\）或正斜杠（/）

2.在与zerossl.com交互的时候，涉及到地址验证的问题，其中需要创建`.well-known`文件夹，如果是简单的windows环境是无法创建的，会提示你“必须键入文件名”，这时候需要mkdir创建了，即`mkdir .well-known`