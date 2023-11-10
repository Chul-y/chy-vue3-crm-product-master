//这个方法的作用通过服务器返回的菜单数据
//1.得到用户的菜单数据
//2.得到用户的路由数据

/**
 * 
 * @param {Array} allRoutes 用户完整的路由表配置
 * @param {Array} roleMenu 服务器返回的菜单数据
 */

let recursionRoute = (allRoutes = [], roleMenu = []) => {
    // console.log(allRoutes, roleMenu)
    //存放处理好符合条件的路由的容器
    let userRoutes = []
    //遍历roleMenu
    roleMenu.forEach(menuItem => {
        //遍历allRoutes,用menuItem要和AllRoutes中的每一项进行比对,比对的条件是menuItem.name === allRoutes中某条数据的meta.key
        allRoutes.forEach(routeItem => {
            if (menuItem.name === routeItem.meta.key) {
                //递归处理children中的数据
                if (menuItem.children && menuItem.children.length > 0) {
                    // console.log(menuItem.children)
                    routeItem.children = recursionRoute(routeItem.children, menuItem.children)
                }
                userRoutes.push(routeItem)
            }
        })
    })

    return userRoutes
}

export default recursionRoute