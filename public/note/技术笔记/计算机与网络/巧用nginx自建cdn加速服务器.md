之前使用cloudflare加速网站的时候，虽然是负加速把。。。但好歹能用啊。结果周五早上，看网站的时候忽然死掉了。去cloudflare查看，结果解析的界面一直404所以没办法，就很绝望。想到自己有一台国内的服务器，便想着自建cdn服务器。

CDN 就是内容分发网络的意思，其英文全称为 Content Delivery Network。**简单地说，CDN 可以提前把数据存在离用户最近的数据节点，从而避免长途跋涉经过长途骨干网，最终达到减少骨干网负担、提高访问速度的目的。**其实很好理解，就是你访问网站的时候数据如果经过的那个cdn，就会有个缓存，如果你再次访问的时候，就会读取那个cdn的缓存，就不用再跑很远去找你的服务器了。

好了，闲话不多说，现在开始实操。

## 准备

一台国外服务器10.0.0.1 绑定域名 www.ittoolman.com

一台国内服务器10.0.0.2

## 操作

### 安装nginx

需要在所有CDN服务器节点安装Nginx。也就是链接10.0.0.2，给这台服务器安装nginx，这里我是用的是xiaoz的一键Nginx安装包。如果想自己用的话可以自己设置nginx。

```bash
wget https://raw.githubusercontent.com/helloxz/nginx-cdn/master/nginx.sh
chmod +x nginx.sh && ./nginx.sh
```

### 反向代理配置

反向代在这里你把它理解成CDN节点就行了

- 源站服务器: 10.0.0.1，就是网站数据真实存放的地方
- CDN服务器: 10.0.0.2

在10.0.0.2上编辑hosts，这样做的目的就是告知服务器从哪里去获取网站数据，也就是回源地址，需要在CDN上做如下修改

```bash
vi /etc/hosts
10.0.0.1   www.ittoolman.com
```

配置一下各种目录

```bash
#创建缓存目录
mkdir -p /data/wwwroot/caches/www.ittoolman.com
#设置缓存目录权限
chown -R www:www /data/wwwroot/caches/www.ittoolman.com
#如果网站是https创建证书路径
mkdir -p /data/wwwssl/www.ittoolman.com
#创建配置文件
vi /usr/local/nginx/conf/vhost/ittoolman.com.conf

```

在`ittoolman.com.conf`中添加下面的内容，缓存目录/缓存时间请根据实际情况调整，详细参数和含义请自行百度。

```bash
proxy_cache_path /data/wwwroot/caches/www.ittoolman.com levels=1:2 keys_zone=ittoolman:50m inactive=30m max_size=50m;

# HTTP 请求重定向到 HTTPS（可选）
server {
    listen 80;
    server_name www.ittoolman.com;
    return 301 https://$host$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl;
    server_name www.ittoolman.com;

    # 设置 SSL 证书和私钥路径
    ssl_certificate /data/wwwssl/www.ittoolman.com/fullchain.pem;
    ssl_certificate_key /data/wwwssl/www.ittoolman.com/privkey.pem;
    # 优化ssl配置
    ssl_session_timeout 1d;
    ssl_session_cache builtin:1000 shared:SSL:10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    access_log /data/wwwlogs/www.ittoolman.com_nginx.log combined;

    # 自定义 Server 头
    server_tokens off;
    add_header Server ittoolmanCDN;

    # 启用缓存
    location / {
        proxy_ssl_verify off;
	   proxy_pass https://www.ittoolman.com;
        proxy_set_header Accept-Encoding "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_cache ittoolman;
        proxy_cache_valid 200 304 30m;
        proxy_cache_valid 301 24h;
        proxy_cache_valid 500 502 503 504 0s;
        proxy_cache_valid any 1s;
        proxy_cache_min_uses 1;

        expires 12h;
        proxy_redirect off;
    }
}

```

nginx整体配置为

```bash
user  www www;
worker_processes  auto;
worker_rlimit_nofile 50000;
error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

pid        /var/run/nginx.pid;


events {
    use epoll;
    worker_connections 51200;
    #worker_connections  1024;
    multi_accept on;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    server_names_hash_bucket_size 128;
    client_header_buffer_size 32k;
    large_client_header_buffers 4 32k;
    client_max_body_size 1024m;
    client_body_buffer_size 10m;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 120;
    server_tokens off;
    tcp_nodelay on;
	proxy_headers_hash_max_size 51200;
	proxy_headers_hash_bucket_size 6400;
    #开启Brotli压缩
    brotli on;
	brotli_comp_level 6;
	#最小长度
	brotli_min_length   512;
	brotli_types text/plain text/javascript text/css text/xml text/x-component application/javascript application/x-javascript application/xml application/json application/xhtml+xml application/rss+xml application/atom+xml application/x-font-ttf application/vnd.ms-fontobject image/svg+xml image/x-icon font/opentype;
	brotli_static       always;

    gzip on;
    gzip_buffers 16 8k;
    gzip_comp_level 6;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
    text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
    text/javascript application/javascript application/x-javascript
    text/x-json application/json application/x-web-app-manifest+json
    text/css text/plain text/x-component
    font/opentype application/x-font-ttf application/vnd.ms-fontobject
    image/x-icon;
  	gzip_disable "MSIE [1-6]\.(?!.*SV1)";

	#If you have a lot of static files to serve through Nginx then caching of the files' metadata (not the actual files' contents) can save some latency.
	open_file_cache max=1000 inactive=20s;
	open_file_cache_valid 30s;
	open_file_cache_min_uses 2;
	open_file_cache_errors on;

	#limit connection
	limit_conn_zone $binary_remote_addr zone=addr:10m;
	

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

	include cdn/*.conf;
	include vhost/*.conf;
}

```

所有配置写完之后，需要检测文件是否写的正确，以及重载nginx配置让配置生效。

```bash
# 检查文件是否正确，如果是正确的，会有个successful提示
/usr/local/nginx/sbin/nginx -t
# 重载nginx配置
/usr/local/nginx/sbin/nginx -s reload
```

## dns解析

在腾讯云/阿里云/cloudflare等dns服务商上面添加a解析



主机记录：www

记录类型：A 

记录值：10.0.0.2



做完之后，等待一段时间让其生效，再次访问网站查看

![b5358d46396d5bb239e3828cb22cb23](./assets/%E5%B7%A7%E7%94%A8nginx%E8%87%AA%E5%BB%BAcdn%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%E5%99%A8/b5358d46396d5bb239e3828cb22cb23.png)

有这个，表示已经弄好了。