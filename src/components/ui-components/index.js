//此处可以导入所有组件使用import.global.meta
let modules = import.meta.glob("./**/index.vue", { eager: true })
//存储处理之后的组件名:组件实例键值对映射
let componentsMap = new Map()

Object.keys(modules).forEach(path => {
    // console.log(path)
    let regExp = /^\.\/(.*)\/.*\.vue$/
    // console.log(path.match(regExp))
    //根据文件夹名字获取组件名字
    let match = path.match(regExp) ? path.match(regExp)[1] : null
    //获取组件实例
    let component = modules[path].default;
    //判断如果没有默认导出组件
    if (!component) {
        throw Error("Did you forget to export a component by default")
    }
    //判断组件是否导出了name属性
    let componentName = component.name ?? match;
    // console.log(componentName)
    //如果没有对应的组件名字,提示错误,没有按照当前的文件创建规则创建组件
    //规则: 1.组件外层的文件夹目录名字是组件处理的名字 2.核心组件统一使用index.vue进行命名
    if (!componentName) {
        throw new Error('Did you forget to provide a name attribute for the component or failed to create one for the component according to the rules')
    }
    // componentsObj[componentName] = component;
    componentsMap.set(componentName, component)
})
// console.log(componentsObj)
// console.log(componentsMap.keys())
export default {
    install(app) {
        //可以循环批量注册
        [...componentsMap.keys()].forEach(key => {
            app.component(key, componentsMap.get(key))
        })
    }
}