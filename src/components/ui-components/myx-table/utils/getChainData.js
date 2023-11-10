//一个工具函数,用于通过用户传递的字符串"list.data.data" 那么要读取对象 {list:{data:data:[]}}

export default function getChainData(obj, chainString) {
    // console.log('---obj',obj)
    if (!chainString) {
        console.warn('chianString is not defined')
        return
    }
    try {
        let chainArr = chainString.split(".");

        let prop = chainArr.reduce((currentObj, key) => {
            return currentObj[key]
        }, obj)

        return prop ?? "没有数据"

    } catch (e) {
        console.warn(e.toString());
        return "没有数据"
    }
}
