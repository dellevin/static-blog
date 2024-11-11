主要依赖：

```xml
		<!--通过ip查询客户端位置-->
        <dependency>
            <groupId>org.lionsoul</groupId>
            <artifactId>ip2region</artifactId>
            <version>2.7.0</version>
        </dependency>
        <!-- Alibaba Fastjson -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.76</version>
        </dependency>
```

首先先获取到访问者的ip地址

访问必须是通过公网访问，要是内网互ip访问相测试的话，会返回127.0.0.1，或者访问者的内网ip地址。

通过X－FORWARDED－FOR等信息。跟踪原有的客户端IP地址和原来客户端请求的服务器地址。

```java
package com.wonder.utils;


import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class getIPutils {
    public static String resClientIP(HttpServletRequest request) {
        String ip = getClientIpAddress(request);
        boolean  isInner = isInnerIP(ip);
        if (!isInner) {
            return  ip;
        }else {
            return  "内网ip";
        }

    }
    public static String getClientIpAddress(HttpServletRequest request) {
        // 获取请求主机IP地址,如果通过代理进来，则透过防火墙获取真实IP地址
        String headerName = "x-forwarded-for";
        String ip = request.getHeader(headerName);
        if (null != ip && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
            // 多次反向代理后会有多个IP值，第一个IP才是真实IP,它们按照英文逗号','分割
            if (ip.indexOf(",") != -1) {
                ip = ip.split(",")[0];
            }
        }
        if (checkIp(ip)) {
            headerName = "Proxy-Client-IP";
            ip = request.getHeader(headerName);
        }
        if (checkIp(ip)) {
            headerName = "WL-Proxy-Client-IP";
            ip = request.getHeader(headerName);
        }
        if (checkIp(ip)) {
            headerName = "HTTP_CLIENT_IP";
            ip = request.getHeader(headerName);
        }
        if (checkIp(ip)) {
            headerName = "HTTP_X_FORWARDED_FOR";
            ip = request.getHeader(headerName);
        }
        if (checkIp(ip)) {
            headerName = "X-Real-IP";
            ip = request.getHeader(headerName);
        }
        if (checkIp(ip)) {
            headerName = "remote addr";
            ip = request.getRemoteAddr();
            // 127.0.0.1 ipv4, 0:0:0:0:0:0:0:1 ipv6
            if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) {
                //根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        System.out.println("getClientIp  IP is " + ip + ", headerName = " + headerName);
        return ip;
    }
    private static boolean checkIp(String ip) {
        if (null == ip || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            return true;
        }
        return false;
    }
    /**
     * 判断IP是否是内网地址
     * @param ipAddress ip地址
     * @return 是否是内网地址
     */
    public static boolean isInnerIP(String ipAddress) {
        boolean isInnerIp;
        long ipNum = getIpNum(ipAddress);
        /**
         私有IP：A类  10.0.0.0-10.255.255.255
         B类  172.16.0.0-172.31.255.255
         C类  192.168.0.0-192.168.255.255
         还有127这个网段是环回地址
         **/
        long aBegin = getIpNum("10.0.0.0");
        long aEnd = getIpNum("10.255.255.255");

        long bBegin = getIpNum("172.16.0.0");
        long bEnd = getIpNum("172.31.255.255");

        long cBegin = getIpNum("192.168.0.0");
        long cEnd = getIpNum("192.168.255.255");
        isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd)
                || ipAddress.equals("127.0.0.1");
        return isInnerIp;
    }

    private static long getIpNum(String ipAddress) {
        String[] ip = ipAddress.split("\\.");
        long a = Integer.parseInt(ip[0]);
        long b = Integer.parseInt(ip[1]);
        long c = Integer.parseInt(ip[2]);
        long d = Integer.parseInt(ip[3]);

        return a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
    }

    private static boolean isInner(long userIp, long begin, long end) {
        return (userIp >= begin) && (userIp <= end);
    }

    public static String getRealIP(HttpServletRequest request){
        // 获取客户端ip地址
        String clientIp = request.getHeader("x-forwarded-for");

        if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }

        String[] clientIps = clientIp.split(",");
        if(clientIps.length <= 1) return clientIp.trim();

        // 判断是否来自CDN
        if(isComefromCDN(request)){
            if(clientIps.length>=2) return clientIps[clientIps.length-2].trim();
        }

        return clientIps[clientIps.length-1].trim();
    }

    private static boolean isComefromCDN(HttpServletRequest request) {
        String host = request.getHeader("host");
        return host.contains("www.189.cn") ||host.contains("shouji.189.cn") || host.contains(
                "image2.chinatelecom-ec.com") || host.contains(
                "image1.chinatelecom-ec.com");
    }

}
```

### 相关请求头

- `X-Forwarded-For` 记录一个请求从客户端出发到目标服务器过程中经历的代理，或者负载平衡设备的IP。这是由缓存代理软件 Squid 引入，用来表示 HTTP 请求端真实 IP，现在已经成为事实上的标准，被各大 HTTP 代理、负载均衡等转发服务广泛使用，并被写入 RFC 7239（Forwarded HTTP Extension）标准之中。格式为X-Forwarded-For:client1,proxy1,proxy2，一般情况下，第一个ip为客户端真实ip，后面的为经过的代理服务器的ip。现在大部分的代理都会加上这个请求头。
- `Proxy-Client-IP/WLProxy-Client-IP` 这个一般是经过apache http服务器的请求才会有，用apache http做代理时一般会加上Proxy-Client-IP请求头，而WL-Proxy-Client-IP是他的weblogic插件加上的头。
- `HTTP_CLIENT_IP`  有些代理服务器会加上此请求头。
- `X-Real-IP nginx`代理一般会加上此请求头。



### 通过ip获取位置

通过上面返还的ip地址进行解析，具体方式可以参考[Ip2region](https://github.com/lionsoul2014/ip2region)的官方文档。

```java
package com.wonder.utils;

import com.alibaba.fastjson.JSONObject;
import org.lionsoul.ip2region.xdb.Searcher;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;


public class FromIpToCtiy {
	//https://github.com/lionsoul2014/ip2region/tree/master/binding/java
    public static String  resLocation(String ip) {
        String dbPath = "src/main/resources/ip2region.xdb";
        // 1、从 dbPath 中预先加载 VectorIndex 缓存，并且把这个得到的数据作为全局变量，后续反复使用。
        byte[] vIndex;
        try {
            vIndex = Searcher.loadVectorIndexFromFile(dbPath);
        } catch (Exception e) {
            System.out.printf("failed to load vector index from `%s`: %s\n", dbPath, e);
            return "{\"error\":\"加载索引失败\"}";
        }

        // 2、使用全局的 vIndex 创建带 VectorIndex 缓存的查询对象。
        Searcher searcher;
        try {
            searcher = Searcher.newWithVectorIndex(dbPath, vIndex);
        } catch (Exception e) {
            System.out.printf("failed to create vectorIndex cached searcher with `%s`: %s\n", dbPath, e);
            return "{\"error\":\"创建缓存搜索器失败\"}";
        }
        // 3、查询
        long sTime;
        String region = null;
        long cost = 0;
        try {
            sTime= System.nanoTime();
            region= searcher.search(ip);
            cost= TimeUnit.NANOSECONDS.toMicros((long) (System.nanoTime() - sTime));
            System.out.printf("{region: %s, ioCount: %d, took: %d μs}\n", region, searcher.getIOCount(), cost);
            // 4、关闭资源
            searcher.close();
        } catch (Exception e) {
            System.out.printf("failed to search(%s): %s\n", ip, e);
        }
        Map<String,String>  resmap = new HashMap<>();
        resmap.put("location",region);
        resmap.put("ioCount", String.valueOf(searcher.getIOCount()));
        resmap.put("cost", cost+"μs");
        return JSONObject.toJSONString(resmap);
        // 备注：每个线程需要单独创建一个独立的 Searcher 对象，但是都共享全局的制度 vIndex 缓存。
    }
}
```

说实在的，其实没啥技术含量，就是互相调用查看的，通过客户端的请求进行解析。然后查询地址的，也就是通过一个人家写的库进行查询。很简单的。欸。。目前没啥好想法了。
