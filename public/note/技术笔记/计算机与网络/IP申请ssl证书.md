实现方式是通过 https://zerossl.com 来申请免费的ssl证书的，有效期为90天，90天之后还需要自行申请

进入到ZeroSSL官网，注册一个账号，然后点击免费 SSL 证书申请。
[![ZeroSSL](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/003.png)

填写你的IP地址，然后选择免费SSL证书时长。
[![ZeroSSL](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/004.png)

中间那个步骤三个都不选然后进行下一步，选择自动生成CSR
[![CSR](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/005.png)

验证域名，ZeroSSL免费SSL证书提供了两种域名验证方式，最简单的就是Web验证，但是前提是你要让你的IP地址实现Web访问。如果没有，你可以选择使用域名DNS添加TXT记录验证。
[![Web验证](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/006.png)

选择网站Web访问的话，直接下载验证文件，然后上传到IP地址默认的Web目录下，用你的浏览器打开IP，保证可以访问到验证文件。

![验证文件](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/007.png)

最后，回到ZeroSSL验证页面，点击完成验证。

[![ZeroSSL验证](./assets/IP%E7%94%B3%E8%AF%B7ssl%E8%AF%81%E4%B9%A6/008.png)

下载证书文件，ZeroSSL证书验证成功后，就可以下载证书文件了。ZeroSSL SSL证书提供了多种形式，包括了Nginx、Apache等。