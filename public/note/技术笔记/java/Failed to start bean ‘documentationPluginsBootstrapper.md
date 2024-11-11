关于报错org.springframework.context.ApplicationContextException: Failed to start bean 'documentationPluginsBootstrapper'


```bash

Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2023-04-03 00:08:57.651 ERROR 15032 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.context.ApplicationContextException: Failed to start bean 'documentationPluginsBootstrapper'; nested exception is java.lang.NullPointerException
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:181) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.context.support.DefaultLifecycleProcessor.access$200(DefaultLifecycleProcessor.java:54) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.context.support.DefaultLifecycleProcessor$LifecycleGroup.start(DefaultLifecycleProcessor.java:356) ~[spring-context-5.3.22.jar:5.3.22]
	at java.base/java.lang.Iterable.forEach(Iterable.java:75) ~[na:na]
	at org.springframework.context.support.DefaultLifecycleProcessor.startBeans(DefaultLifecycleProcessor.java:155) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.context.support.DefaultLifecycleProcessor.onRefresh(DefaultLifecycleProcessor.java:123) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.context.support.AbstractApplicationContext.finishRefresh(AbstractApplicationContext.java:935) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:586) ~[spring-context-5.3.22.jar:5.3.22]
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:145) ~[spring-boot-2.6.10.jar:2.6.10]
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:745) ~[spring-boot-2.6.10.jar:2.6.10]
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:420) ~[spring-boot-2.6.10.jar:2.6.10]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:307) ~[spring-boot-2.6.10.jar:2.6.10]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1317) ~[spring-boot-2.6.10.jar:2.6.10]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1306) ~[spring-boot-2.6.10.jar:2.6.10]
	at com.wonder.UselessToolsApplication.main(UselessToolsApplication.java:14) ~[classes/:na]
Caused by: java.lang.NullPointerException: null
	at springfox.documentation.spi.service.contexts.Orderings$8.compare(Orderings.java:112) ~[springfox-spi-2.9.2.jar:null]
	at springfox.documentation.spi.service.contexts.Orderings$8.compare(Orderings.java:109) ~[springfox-spi-2.9.2.jar:null]
	at com.google.common.collect.ComparatorOrdering.compare(ComparatorOrdering.java:37) ~[guava-20.0.jar:na]
	at java.base/java.util.TimSort.countRunAndMakeAscending(TimSort.java:355) ~[na:na]
	at java.base/java.util.TimSort.sort(TimSort.java:220) ~[na:na]
	at java.base/java.util.Arrays.sort(Arrays.java:1441) ~[na:na]
	at com.google.common.collect.Ordering.sortedCopy(Ordering.java:855) ~[guava-20.0.jar:na]
	at springfox.documentation.spring.web.plugins.WebMvcRequestHandlerProvider.requestHandlers(WebMvcRequestHandlerProvider.java:57) ~[springfox-spring-web-2.9.2.jar:null]
	at springfox.documentation.spring.web.plugins.DocumentationPluginsBootstrapper$2.apply(DocumentationPluginsBootstrapper.java:138) ~[springfox-spring-web-2.9.2.jar:null]
	at springfox.documentation.spring.web.plugins.DocumentationPluginsBootstrapper$2.apply(DocumentationPluginsBootstrapper.java:135) ~[springfox-spring-web-2.9.2.jar:null]
	at com.google.common.collect.Iterators$7.transform(Iterators.java:750) ~[guava-20.0.jar:na]
	at com.google.common.collect.TransformedIterator.next(TransformedIterator.java:47) ~[guava-20.0.jar:na]
	at com.google.common.collect.TransformedIterator.next(TransformedIterator.java:47) ~[guava-20.0.jar:na]
	at com.google.common.collect.MultitransformedIterator.hasNext(MultitransformedIterator.java:52) ~[guava-20.0.jar:na]
	at com.google.common.collect.MultitransformedIterator.hasNext(MultitransformedIterator.java:50) ~[guava-20.0.jar:na]
	at com.google.common.collect.ImmutableList.copyOf(ImmutableList.java:249) ~[guava-20.0.jar:na]
	at com.google.common.collect.ImmutableList.copyOf(ImmutableList.java:209) ~[guava-20.0.jar:na]
	at com.google.common.collect.FluentIterable.toList(FluentIterable.java:614) ~[guava-20.0.jar:na]
	at springfox.documentation.spring.web.plugins.DocumentationPluginsBootstrapper.defaultContextBuilder(DocumentationPluginsBootstrapper.java:111) ~[springfox-spring-web-2.9.2.jar:null]
	at springfox.documentation.spring.web.plugins.DocumentationPluginsBootstrapper.buildContext(DocumentationPluginsBootstrapper.java:96) ~[springfox-spring-web-2.9.2.jar:null]
	at springfox.documentation.spring.web.plugins.DocumentationPluginsBootstrapper.start(DocumentationPluginsBootstrapper.java:167) ~[springfox-spring-web-2.9.2.jar:null]
	at org.springframework.context.support.DefaultLifecycleProcessor.doStart(DefaultLifecycleProcessor.java:178) ~[spring-context-5.3.22.jar:5.3.22]
	... 14 common frames omitted
```

## 问题分析

> 因为Springfox 使用的路径匹配是基于AntPathMatcher的，而Spring Boot 2.6.X使用的是PathPatternMatcher。

## 修复方案

###  修复方案一：降低Spring Boot 版本到2.6.x以下版本

比如下面版本组合是兼容的

| Spring Boot版本 | Swagger 版本 |
| --------------- | ------------ |
| 2.5.6           | 2.9.2        |

### 修复方案二: SpringBoot版本不降级解决方案

比如下面版本组合是兼容的

| Spring Boot版本 | Swagger 版本 |
| --------------- | ------------ |
| 2.6.5           | 3.0.0        |

### 修复方案三：设置application配置文件

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```

### 修复方案四，修改spring源文件

我没找到这个java文件。。。。没试过，估计应该可以。。

参考地址：https://github.com/springfox/springfox/issues/3462

1. revert matching strategy `spring.mvc.pathmatch.matching-strategy` to `ant-path-matcher`

2. hack springfox [WebMvcRequestHandlerProvider](https://github.com/springfox/springfox/blob/master/springfox-spring-webmvc/src/main/java/springfox/documentation/spring/web/plugins/WebMvcRequestHandlerProvider.java#L63) to filter out actuator controllers which don't respect `spring.mvc.pathmatch.matching-strategy`

   ```java
   	public WebMvcRequestHandlerProvider(Optional<ServletContext> servletContext, HandlerMethodResolver methodResolver,
   			List<RequestMappingInfoHandlerMapping> handlerMappings) {
   		this.handlerMappings = handlerMappings.stream().filter(mapping -> mapping.getPatternParser() == null)
   				.collect(Collectors.toList());
   ```

## swagger配置类

.apis(RequestHandlerSelectors.basePackage("com.wonder.controller")) 

这里填写扫描包，对应类添加@API

   ```java
   package com.wonder.config;
   
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import springfox.documentation.builders.ApiInfoBuilder;
   import springfox.documentation.builders.PathSelectors;
   import springfox.documentation.builders.RequestHandlerSelectors;
   import springfox.documentation.service.ApiInfo;
   import springfox.documentation.spi.DocumentationType;
   import springfox.documentation.spring.web.plugins.Docket;
   import springfox.documentation.swagger2.annotations.EnableSwagger2;
   
   
   import javax.servlet.ServletContext;
   import java.util.Optional;
   
   @Configuration // 标明是配置类
   @EnableSwagger2
   public class SwaggerConfig {
       @Bean
       public Docket createRestApi() {
           return new Docket(DocumentationType.SWAGGER_2)  // DocumentationType.SWAGGER_2 固定的，代表swagger2
   //                .groupName("分布式任务系统") // 如果配置多个文档的时候，那么需要配置groupName来分组标识
                   .apiInfo(apiInfo()) // 用于生成API信息
                   .select() // select()函数返回一个ApiSelectorBuilder实例,用来控制接口被swagger做成文档
                   .apis(RequestHandlerSelectors.basePackage("com.wonder.controller")) // 用于指定扫描哪个包下的接口
                   .paths(PathSelectors.any())// 选择所有的API,如果你想只为部分API生成文档，可以配置这里
                   .build();
       }
   
       /**
        * 用于定义API主界面的信息，比如可以声明所有的API的总标题、描述、版本
        * @return
        */
       private ApiInfo apiInfo() {
           return new ApiInfoBuilder()
                   .title("项目API") //  可以用来自定义API的主标题
                   .description("项目SwaggerAPI管理") // 可以用来描述整体的API
                   //.termsOfServiceUrl("") // 用于定义服务的域名
                   .version("1.0") // 可以用来定义版本。
                   .build(); //
       }
   
   }
   ```

   访问地址：http://localhost:8080/swagger-ui.html
