<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏 菜单 -->
      <side-menu></side-menu>
      <!-- 右侧内容 -->
      <el-container class="el-container2">
        <!-- 顶栏 -->
        <header-layout></header-layout>
        <!-- 主题内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup name="layout-main">
import sideMenu from "layout/sideMenu/index.vue"
import headerLayout from "layout/headerLayout/index.vue"
import { onMounted } from "vue";
onMounted(() => {
  // console.log(document.querySelector('.el-menu'))
})
</script>


  
<style scoped>
.el-container2 {
  flex-direction: column;
}

.el-header {
  background-image: var(--theme-bg-color);
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-image: var(--theme-bg-color);
  color: #fff;
  /* text-align: center; */
  /* line-height: 200px; */
}

.el-main {

  color: #333;
}

body>.el-container {
  margin-bottom: 40px;
}
</style>