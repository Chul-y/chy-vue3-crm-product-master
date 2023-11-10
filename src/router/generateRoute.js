import toTree from "@/utils/toTree"
let modules = import.meta.glob("../pages/home/**/*.vue")
//vite中还有个方法 eager 可以获取默认导入的组件
let syncComponents = import.meta.globEager("../pages/home/**/*.vue")

// console.log(modules)

//目的:将读取到的modules转变成我们的route配置
//一个route配置是这样的{ path:"xxx",component:"xxx" }

//约定式路由
//1.约定所有的页面都必须卸载pages/home这个文件夹下面

//2.所有的页面都需要使用文件夹+index.vue这种编写方式

//声明一个扁平的路由配置数组

let flatRoutes = []

//遍历modules
for (let path in modules) {
    // console.log(path)
    // ../pages/home/welcome/index.vue
    let component = modules[path]//获取读取的组件
    let syncCom = syncComponents[path].default;
    // console.log(syncCom)
    let reg = /^\.{2}\/pages\/home\/(.+)\/index\.vue$/
    //使用正则匹配路径
    let match = path.match(reg)
    // console.log(match)
    //排除掉匹配到null的这一次,../pages/home/index.vue
    if (match) {
        //创建一个路由对象
        let route = {
            path: match[1],
            component,
            meta: syncCom['meta'] ?? {},
        }
        //如果添加了重定向,那么就给route配置重定向
        if (syncCom['meta']?.redirect) {
            route.redirect = syncCom['meta'].redirect
        }
        flatRoutes.push(route)
    }
}
// console.log(flatRoutes)

//二次处理数据,因为扁平转树形,需要有id或者pid,现在给每个对象都添加上id和pid

flatRoutes.forEach(route => {
    //给每个对象添加上id和pid
    let pathArr = route.path.split("/")
    // console.log(pathArr)
    if (pathArr.length === 1) {
        //说明这些都是父节点,只需要添加id就行
        route.id = pathArr.join("")
    } else {
        //不是父节点,需要加上id和pid 
        //先拷贝pathArr
        let newPathArr = [...pathArr]
        route.id = newPathArr.join("-")
        let path = newPathArr.pop()
        route.pid = newPathArr.join("-")
        //这句话的目的是为了让我们的子路由的配置符合vue路由的配置
        route.path = path;
    }
})
// console.log(toTree)
//扁平转树形
let routes = toTree(flatRoutes, 'id', 'pid')
// console.log(routes)
export default routes