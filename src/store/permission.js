import { defineStore } from "pinia";
import * as api from "@/api/menus"
import recursionRoute from "@/utils/recursionRoute"
import allRoute from "@/router/generateRoute"
import dynamicRoute from "@/router/dynamicRoute"
import router from "@/router/index"
export default defineStore('permission', () => {
    //控制菜单展开和收起
    let isCollapse = ref(false)
    //用户的菜单
    let userMenu = ref([]);
    //用户的路由
    let userRoute = ref([])
    //声明一个方法,用于获取修改userMenu
    let fetchMenu = async () => {
        try {
            let res = await api.getRoleMenuApi({
                type: 1,
                order_by: 1
            })
            // 当前角色(比如lbw就是普通用户)的菜单
            let roleMenu = res.data;
            //给userMenu这个状态赋值    
            userMenu.value = roleMenu;
            //通过角色的菜单数据和所有的路由配置数据进行对比,得到用户的路由和菜单数据
            userRoute.value = recursionRoute(allRoute, roleMenu);
            //开始动态添加路由
            // console.log(dynamicRoute)
            //将递归生成的路由,添加给dynamicRoute的children
            dynamicRoute.children = userRoute.value;
            //动态添加路由到实例中 addRoute
            router.addRoute(dynamicRoute)
            return Promise.resolve('ok')
        } catch (e) { 
            return Promise.reject(e)
        }
    }
    return {
        userMenu,
        fetchMenu,
        userRoute,
        isCollapse
    }
})