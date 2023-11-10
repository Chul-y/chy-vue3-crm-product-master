//扁平数据转换成树形,爸爸去哪儿,先找父节点,还得区分1级的节点

    //每条数据,只会有一条根数据

    // currentKey 当前节点的字段标识(属性名)

    // parentKey 父节点的字段标识(属性名)

    // childKey 子节点的字段标识(子节点的字段名,属性名)
    /**
     * 
     * @param {Array} data 扁平数据
     * @param {String} currentKey 当前节点的字段标识(属性名)
     * @param {String} parentKey 父节点的字段标识(属性名)
     * @param {String} childKey 子节点的字段标识(子节点的字段名,属性名)
     * @returns 
     */
    export default function toTree(data, currentKey = "id", parentKey = "parentid", childKey = 'children') {
        //储存树形数据的数组
        let treeArr = [];
        //再次声明一个函数
        function recursion(data) {
            data.forEach(item => {
                //说明这个是一个子节点
                if (item[parentKey]) {
                    //爸爸去哪儿,找父节点
                    let parent = data.find(p => p[currentKey] === item[parentKey]);
                    //判断父节点是否有children属性
                    if (!parent[childKey]) {
                        //添加一个children属性,并且是一个空数组
                        parent[childKey] = []
                    }
                    parent[childKey].push(item)
                } else {
                    treeArr.push(item)
                }
            })
        }
        recursion(data)
        return treeArr;
    }

