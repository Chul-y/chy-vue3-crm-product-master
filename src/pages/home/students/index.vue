<template>
    <router-view></router-view>
</template>
<script setup name="students">
    // 菜单鉴权 路由页面鉴权

    //1.先在本地配置一份完整的路由表

    //2.会在pinia或者vuex中声明一个属性用于存储菜单信息或者页面信息

    //3.发起请求,请求菜单数据,通过指定的字段和本地的路由表进行递归对比,获取用户的路由页面和菜单

    //4.通过addRoute方法,将用户的路由页面添加到路由表中
</script>
<script>
export default {
    //自己定义的属性
    meta: {
        key: "学员管理",
        icon:"icon-xueyuanguanli"
    }
}
</script>