<template>
  <div class="main">
    <div class="main-inner">
      <div class="content">
        <!-- 文章图片 -->
        <img
            src="https://dellevin.github.io/post-images/1680282079245.jpg"
            alt="雁过流痕"
            class="article-image"
        />

        <!-- 友情链接申请 -->
        <section>
          <p>
            欢迎各位大佬互换友链，可以
            <a href="https://github.com/dellevin/dellevin.github.io/issues" target="_blank" class="issue-click">
              点击链接
            </a>
            提交issue，或者通过邮箱（<a href="mailto:dellevin99@gmail.com" class="issue-click">dellevin99@gmail.com</a>）方式联系我，来申请友情链接呀！
          </p>
        </section>

        <hr />

        <!-- 友情链接 -->
        <section>
          <h2>以下排名不分先后：</h2>

          <!-- 友情链接列表 -->
          <ul class="friend-links">
            <li>
              <strong>作者：hiRipple</strong><br />
              地址：
              <a href="https://hiripple.com" target="_blank">https://hiripple.com</a><br />
              随便说说：超高校级的游戏玩家
            </li>
            <li>
              <strong>作者：gao_cai_shengの个人博客</strong><br />
              地址：
              <a href="https://qwq2333.top/" target="_blank">https://qwq2333.top/</a><br />
              随便说说：女子大学生 | 给岁月以文明，而不是给文明以岁月
            </li>
            <li>
              <strong>作者：小码博客</strong><br />
              地址：
              <a href="https://blog.hikki.site/" target="_blank">https://blog.hikki.site/</a><br />
              随便说说：喜欢的东西就努力去追求，万一成功了呢!
            </li>
            <li>
              <strong>作者：這個博客</strong><br />
              地址：
              <a href="https://thisblog.me/" target="_blank">https://thisblog.me/</a><br />
              随便说说：闲话多说
            </li>
          </ul>
        </section>

        <div id="eof">
          <span>EOF</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以加入需要的逻辑，如果有动态数据或交互行为，或者是从API加载数据
</script>

<style scoped>

section {
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}
hr {
  position: relative;
  margin: 2rem auto;
  width: calc(100% - 4px);
  border: 2px dashed #a4d8fa;
  background: #fff;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

.article-image{
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
}
.friend-links {
  list-style-type: none;
  padding-left: 0;
}

.friend-links li {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.friend-links a {
  color: #007bff;
  text-decoration: none;
}

.friend-links a:hover {
  text-decoration: underline;
}

.issue-click{
  color: #007bff;
  text-decoration: none;
}
.issue-click:hover{
  color:  #a4d8fa;
  text-decoration: underline;
}
</style>
