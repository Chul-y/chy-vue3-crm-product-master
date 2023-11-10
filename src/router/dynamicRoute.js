
export default {
    path: '/',
    // redirect:"/login",
    name: 'home',
    component: () => import("layout/index.vue"),
    //children中的路由都是需要鉴权的,并且当前这个对象要通过动态添加的方式添加到路由中
    children:[]
}