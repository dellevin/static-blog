## 查看docker日志有哪些以及日志大小

ls -lh $(find /var/lib/docker/containers/ -name *-json.log)

其中可以进入对应目录下面进行清理
/var/lib/docker/containers/ 这里面是docker容器的各种文件
然后里面的json.log是他们的日志文件
我们需要 cat /dev/null > *-json.log 就可以对某个日志进行清理了

## sh文件进行清理
！！！！！！！！！！！以下bash必须在linux中完成，若在windows下面写了传到linux中会因为换行符的原因提示 Syntax error: word unexpected (expecting "do")
这样解决方式是使用vim编辑器对文件进行重新设置 :set ff=unix 设置成unix就可以

但是这样解决完还有一个bug就是Syntax error: word unexpected
这个估计是因为ftp传输格式的文件，具体方式还没有深入研究

```bash
#!/bin/sh
echo "==================== start clean docker containers logs =========================="
logs=$(find /var/lib/docker/containers/ -name *-json.log)
for log in $logs
do
echo "clean logs : $log"
cat /dev/null > $log
done
echo "==================== end clean docker containers logs   =========================="
```