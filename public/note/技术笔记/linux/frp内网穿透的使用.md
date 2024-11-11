今天还好，算是吧frp搞明白了些许，有些时候，一些知识搞不懂， 也许睡醒了就能搞明白了

现在简单记录一下frp的简单使用

## frp是什么

简单地说，frp就是一个反向代理软件，它体积轻量但功能很强大，可以**使处于内网或防火墙后的设备对外界提供服务**，它支持HTTP、TCP、UDP等众多协议。我们今天仅讨论TCP和UDP相关的内容。

项目地址：https://github.com/fatedier/frp

其中frps是服务端的配置，frpc是客户端的配置，每个都有三个文件，服务端只保留服务端的三个，客户端只保留客户端的三个即可。

**Windows客户端启动方式**，打开当前文件夹，输入以下命令

```bash
frpc -c ./frpc.ini
```

**Linux服务端启动方式**，打开当前文件夹，输入以下命令

```bash
./frps -c ./frps.ini
```

## 通过ip穿透

这种情况只需要拥有一台服务器就可以了。

### 服务端配置

```bash
[common]
bind_port = 6001
dashboard_port = 6002
token = 12345678
dashboard_user = admin
dashboard_pwd = admin
vhost_http_port = 6003
```

现在解释一下服务端配置的一些

1. `bind_port`: FRP 服务端或客户端绑定的端口号。服务端用于接收来自客户端的请求，客户端用于连接服务端。（可自定义）
2. `dashboard_port`: FRP 的仪表盘（Dashboard）端口号。通过这个端口，您可以使用 Web 界面来查看 FRP 的状态和运行情况。（可自定义）
3. `token`: FRP 鉴权的 Token。Token 是客户端连接到服务端时进行验证的凭据，用于确保只有具有正确 Token 的客户端可以连接到服务端。（可自定义）
4. `dashboard_user`: FRP 仪表盘v的用户名。（可自定义）
5. `dashboard_pwd`: FRP 仪表盘的密码。（可自定义）
6. `vhost_http_port`: 虚拟主机 HTTP 端口。如果您启用了虚拟主机功能，这个端口将用于 HTTP 请求。（可自定义）

当然这里我之打开了http端口，如果你还想的话可以打开https，socket，tcp等各种链接的端口，这些都是可以自定义的

### 客户端配置

```bash
[common]
server_addr = 101.42.5.22
server_port = 6001
token = 12345678

[web] 
type = http
local_ip = 127.0.0.1
local_port = 4000
remote_port = 6003
custom_domains = 101.42.5.22
```

1. `[common]` 部分：
   - `server_addr`: FRP 服务端的 IP 地址或域名。
   - `server_port`: FRP 服务端的端口号。
   - `token`: FRP 鉴权的 Token，与服务端配置中的 Token 要一致。
2. `[web]` 部分：
   - `type`: 代理类型，这里是 http 类型，用于配置 HTTP 代理。
   - `local_ip`: 要代理的本地 IP 地址，这里设置为 `127.0.0.1` 表示代理本地。
   - `local_port`: 要代理的本地端口号，这里设置为 `4000`。
   - `remote_port`: 服务端映射的端口号，客户端请求该端口时将被代理到本地的 `local_port` 上。
   - `custom_domains`: 自定义域名，这里设置为 `101.42.5.22`。

其中`[web]`可以自定义但是要注意名称不能重复

## 通过域名穿透

这种情况需要配置好域名，服务器的解析，做好解析后才能开始配置。一些服务器提供厂商的还需要再控制台释放对应端口（比如腾讯云，阿里云）。

### 服务端配置

```bash
[common]
bind_port = 6001
dashboard_port = 6002
token = 12345678
dashboard_user = admin
dashboard_pwd = admin
vhost_http_port = 6003
subdomain_host = twoitmen.club
```

相同配置不做赘述，这里多出来一个`subdomain_host`，在这里`subdomain_host`的作用是自定义子域名的主机名。比如我的服务器绑定的域名是twoitmen.club（我解析的时候喜欢用*做解析，一次配置，随便使用）。那我我在这里填写twoitmen.club就可以了。

### 客户端配置

```bash
[common]
server_addr = 101.42.5.22
server_port = 6001
token = 12345678

[web] 
type = http
local_ip = 127.0.0.1
local_port = 4000
remote_port = 6003
subdomain = frp
```

相同配置不做赘述，这里多出来一个`subdomain`，在这里`subdomain`的作用是子域名，用于标识代理服务。也就是说，我要访问frp.twoitmen.club:6003就是我穿透完毕后的域名地址。

### nginx配置

在这里多出来一个nginx配置，它是用来反向代理的，就是省略后面端口号的书写

#### 通过域名穿透的方式的nginx配置

```bat

#user  nobody;
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    include /home/conf/*.conf;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        
	  location /memos {
		proxy_pass  http://101.42.5.22:6060; # 转发规则
	  }
      
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    server {
        listen       80;
        server_name  frp.twoitmen.club;
        	location / {
			proxy_pass http://frp.twoitmen.club:6003/;
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
		}
     }
}

```

在这里只是多出来一个server，这里简单讲述一下多出来的server配置

1. `listen 80;`: 监听来自端口 80 的 HTTP 请求。
2. `server_name frp.twoitmen.club;`: 指定该服务器块的域名为 `frp.twoitmen.club`。
3. `location / { ... }`: 这是一个代理规则，它会将来自 `/` 路径的请求转发到 `http://frp.twoitmen.club:6003/` 上。
4. `proxy_pass http://frp.twoitmen.club:6003/;`: 它指定了要转发到的目标地址为 `http://frp.twoitmen.club:6003/`。
5. `proxy_set_header Host $host;`: 在转发请求时，设置了 `Host` 请求头为原始请求的主机名。
6. `proxy_set_header X-Real-IP $remote_addr;`: 在转发请求时，设置了 `X-Real-IP` 请求头为原始请求的客户端 IP 地址。

## 将frps命令写入system

输入命令

```bash
vim /lib/systemd/system/frps.service
```

写入配置

```bash
[Unit]
Description=frps service
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
# 启动服务的命令（此处写你的frps的实际安装目录）
# ExecStart=/your/path/frps -c /your/path/frps.ini
ExecStart=/home/zhang/frpServer/frps -c /home/zhang/frpServerfrps.ini

[Install]
WantedBy=multi-user.target
```

