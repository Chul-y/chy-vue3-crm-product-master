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
                        show-checkbox
                        :data = "treeData"
                        :props = "{label:`desc`}"
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
                <el-button type = "primary" v-if="scope.column.key ==`action`" @click="grentPermission">分配权限</el-button>
            </template>
            </myxTable>
       </div>
</template>
<script setup name = "role">
import myxDrawer from "components/ui-components/myx-drawer/index.vue"
import myxTable from "components/ui-components/myx-table/index.vue"
import * as api from "@/api/role.js"

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


// 声明变量控制抽屉显示隐藏
let showDrawer = ref(false)

// 声明树型组件的data
let treeData = ref([])
// 获取授权权限树的方法
let getAllPermission = async ()=>{
    try{
        let res = await api.getAllPermissionApi()
        console.log("res",res)
        treeData.value = res.permissionPaths

    }catch(e){}
}

// 调用权限树的方法
let grentPermission = (row)=>{
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