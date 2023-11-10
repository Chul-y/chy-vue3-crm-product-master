<template>
    <!-- 侧边栏 -->
    <el-aside width="200">
        <h1 class="logo"></h1>
        <el-menu
                 default-active="2"
                 class="el-menu-vertical-demo"
                 :collapse="isCollapse">
            <sub-menu :menu-list="menuList"></sub-menu>
        </el-menu>
    </el-aside>
</template>
<script setup>
import subMenu from './subMenu.vue'
//引入store获取菜单数据
import usePermission from "@/store/permission"

//菜单数据
let permissionStore = usePermission()
//菜单展开收起的变量,使用computed的目的是为了响应store中isCollapse的变化
let isCollapse = computed(() => permissionStore.isCollapse)
let menuList = permissionStore.userRoute
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.logo {
    height:60px;
    background-image:url(../../assets/imgs/logo.png);
    background-size:80%;
    background-repeat:no-repeat;
    background-position:20% 40%;
}
</style>
