<template>
       <div>
            <myxDrawer 
            :show = "showDrawer"
            @drawer-close = "handleDrawerClose"
            @opend-fn = "handleDrawerOpen"
            >
                <!-- v3语法 #name -->
                <template #customButton>
                    <!-- 按钮 -->
                    <el-button type = "danger">保存</el-button>
                </template>
                <!-- 树型控件内容 -->
                <template #nested>
                    <el-tree
                        ref = "tree"
                        show-checkbox
                        :data = "treeData"
                        :props = "{label:`desc`, disabled :`disabled`}"
                        default-expand-all
                        node-key="id"
                        check-strictly="true"
                       
                    />
                </template>
            </myxDrawer>
            <myxTable 
            :showTableSearch = "false"
            :showAddButton = "false"
            :showSelection = "true"
            :data = "data"
            :column = "column"
            :tableAttr = "tableAttr"
            searchField
            >
            <template #tableCell = "{scope}">
                <!-- 传递参数拿去当前的id -->
                <el-button type = "primary" v-if="scope.column.key ==`action`" @click="grentPermission(scope.row)">分配权限</el-button>
            </template>
            </myxTable>
       </div>
</template>
<script setup name = "role">
import myxDrawer from "components/ui-components/myx-drawer/index.vue"
import myxTable from "components/ui-components/myx-table/index.vue"
import * as api from "@/api/role.js"
import useUsersStore from "../../../../store/users"
// pinia引入的数据
let userStore = useUsersStore()

// 等待
let loading = ref(false)

// 透传
let tableAttr = {
    cellStyle:{textAlign:"center"},
    defaultExpandAll:true,
    headerCellStyle:{textAlign:"center"},
    border:true
}

// 声明数据展示表格
let data = ref([])
let column = [
    {
        key:"roleid",
        dataIndex:"roleid",
        label:"角色ID"
        
    },
    {
        key:"roleName",
        dataIndex:"roleName",
        label:"角色名称"
    },
    {
        key:"desc",
        dataIndex:"desc",
        label:"角色描述"
    },
    {
        key:"status",
        dataIndex:"status",
        label:"角色状态"
    },
    {
        key:"action",
        label:"操作",
        tableCell:true
    },
]
// 分页
let total = ref(0)

// 获取角色列表
let getAllRole = async ()=>{
    loading.value = true
    try{
        let res = await api.getAllRoleApi()
        console.log(res)
        data.value = res.data
        total.value = res.total
        loading.value = false
    }catch(e){}
}





// -------授权树模块----------

let tree = ref(null)

// 声明变量控制抽屉显示隐藏
let showDrawer = ref(false)

// 声明树型组件的data
let treeData = ref([])
// 获取授权权限树的方法
let getAllPermission = async ()=>{
    try{
        let res = await api.getAllPermissionApi()
        console.log("res",res)

        // 将树形数据转为扁平数据  意为：只要有children，就要把children放到一个单独的数组里
        let faltData = (data = []) => {
            //扁平化处理后的数据
            let flatArr = []
            //递归函数
            let recursion = (arr = []) => {
                arr.forEach(item => {
                    //声明一个对象,用来存储扁平化处理后的数据
                    let obj = {
                        "_id": item._id,
                        "id": item.id,
                        "path": item.path,
                        "desc": item.desc,
                        "method": item.method,
                        "parentid": item.parentid,
                        "permissions": item.permissions
                    }

                    //如果item有children

                    if (item.children && item.children.length > 0) {
                        //递归调用
                        recursion(item.children)
                    }
                    flatArr.push(obj)
                })
            }
            recursion(data)
            return flatArr;
        }

        // 获取所有扁平后的数据
        let AllPermissionDataFlat = faltData(res.permissionPaths)

        // 获取当前角色扁平化之后的数据 从pinia存储了，从那里拿
        let currentPermissionFlat = userStore.currentRolePermission.map(item=>item.id)
        // 和当前角色拥有的数据对比
        let newData = AllPermissionDataFlat.map(item=>{
            if(!currentPermissionFlat.includes(item.id)){
                // 判断依据：两个数据做对比，若里面的没有外面的数据，就禁用，结果：完成授权之前看自己是否有权限 ，自己没有的权限就添加禁选属性；
                item.disabled= true
            }
            // 因为是扁平数据，不能直接使用；方法在文档代码都要return —- 这是因为map，不return就会undefined；扁平的再转为树型的才能使用
            return item
        })
        let flatToTree = (data = []) => {

            let tree = []

            data.forEach(item => {
            
                //先看看自己有没有parentid
            
                if (!item.parentid) {
                    //没有parentid,说明是根节点
                    tree.push(item)
                } else {
                
                    //通过parentid找到自己的父亲
                    let parent = data.find(v => v.id === item.parentid)
                    if (parent) {
                        //说明找到了父亲
                        if (!parent.children) {
                            parent.children = []
                        }
                        parent.children.push(item)
                    }
                }
            
            })

            return tree;
        }
        
        // 最后赋值给el-tree
        treeData.value = flatToTree(newData)
    }catch(e){console.log(e)}
}

// 调用权限树的方法
let grentPermission = (row)=>{
    nextTick(async ()=>{
        try{
        // 获取点击角色拥有的权限
        let res = await api.getCurrentRolePermissionApi({roleid:row.roleid,type:1})
        // 将当前觉得的id全部映射到一个数组中
        let CheckedKeys =res.data.map(item=>item.id)
        // console.log(CheckedKeys)
        tree.value.setCheckedKeys(CheckedKeys)
    }catch(e){}
    })
    // 控制抽屉打开
    showDrawer.value = true
}

//抽屉关闭的时候
let handleDrawerClose = ()=>{
    showDrawer.value = false
}

// 抽屉打开的时候
let handleDrawerOpen=()=>{
    // 获取树型数据
    getAllPermission()
}




onMounted(()=>{
    getAllRole()
    getAllPermission()
})
</script>

<script>
export default {
    //自己定义的属性
    meta: {
        key: "角色管理",
        icon:"icon-jiaoseguanli"
    }
}
</script>