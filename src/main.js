//引入样式
import './assets/styles/main.css'

import "./assets/styles/el-reset.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import useToken from "@/hooks/useToken"
//引入自己二次封装element-ui组件
import myxComponents from "components/ui-components/index.js"
//引入permissionStore
import usePermission from "@/store/permission"
//用intro.js来进行网站引导
//引入样式
import "intro.js/introjs.css"
import './assets/styles/base.css'
import introJs from "intro.js"
// 暗黑
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import '../src/assets/styles/dark/scc-vars.css'
const app = createApp(App)

//声明pinia
let pinia = createPinia();
//使用持久化存储的插件
pinia.use(piniaPluginPersistedState)
//使用全局的路由前置钩子beforeEach(路由守卫)来处理逻辑,比如用户未登入的情况
//用户在访问路由配置中的任何一个页面的时候,都会触发这个钩子
//如果return false 那么页面组件不展示
//return也可以返回一对象,对象中可以是符合路由规则的对象
//需求:如果用登入了,可以自由访问其他页面,如果没有只能访问login页,通过token来判断
router.beforeEach(async (to, from) => {
    //目标页面的路由对象
    // console.log('----to', to)
    //from是来源页面的路由对象
    // console.log('---from', from)
    //获取token 
    let token = useToken('myx-token');
    //如果没有token,说明没有登入
    if (!token) {
        //判断用户访问的是不是登入页login
        if (to.path !== '/login') {
            //不是登入页,那么要跳转到登入页
            return { path: "/login" }
        }
    } else {
        //获取菜单
        //使用store的方法
        let permissionStore = usePermission();

        //判断store中是否有用户路由,没有就发起请求
        // console.log(permissionStore.userRoute)
        if (!permissionStore.userRoute.length) {
            try {
                console.log('没有用户路由')
                //pinia中没有用户的路由数据,那么就去获取
                await permissionStore.fetchMenu();
                //动态路由添加之后,刷新页面容易匹配不上,所以这里要做逻辑处理
                return { ...to } //废弃之前进入的路由,重新进入新路由
            } catch (e) { }
        }
    }
})
//添加全局后置钩子,当路由页面完全进入之后,触发这个钩子
router.afterEach((to, from) => {
    // console.log('afterEach')
    // console.log(to)
    if (to.path === "/" || to.path === "/welcome") {
        nextTick(() => {
            introJs().setOptions({

                steps: [{
                    title: '侧边 菜单',
                    intro: '侧边菜单根据不同的角色,展示不同的菜单',
                    element: document.querySelector('.el-menu')
                },
                {
                    title: '展开收起按钮',
                    element: document.querySelector('.is-collapse .iconfont'),
                    intro: '点击按钮可以展开和收起菜单'
                },
                {
                    title: '下拉菜单',
                    element: document.querySelector('.el-dropdown-link'),
                    intro: '点击之后会展开下拉菜单'
                },
                {
                    title: '主内容',
                    intro: "这里是主题内容部分",
                    element: document.querySelector('.el-main'),
                }
                ],
                //勾选不在显示
                dontShowAgain: true,
                //勾选的文字描述
                dontShowAgainLabel: "不再显示",
                //存储的时间,天数
                dontShowAgainCookieDays: 1,
                //下一步按钮的文字
                nextLabel: "下一步",
                //上一步按钮的文字
                prevLabel: "上一步",
                //退出按钮的文字
                skipLabel: "x",
                //完成按钮的文字
                doneLabel: "完成",
                //是否可以按下esc退出
                exitOnEsc: true,
            }).start()
        })
    }

})
//全局解析钩子,解析动态组件
// router.beforeResolve((to, from) => {
//     console.log('beforeResolve')
// })
app.use(myxComponents)
app.use(router)
app.use(pinia)
app.mount('#app')
