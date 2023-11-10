<template>
   <myx-table 
   showTableSearch
   searchField = "username"
   :data="data"
   :column = "column"
   :total = "total"
   :currentPage = "currentPage"
   :pageSize = "pageSize"
   @currentChange = "getAllMenu"
   >
    
</myx-table>
        
</template>
<script setup>

import {getAllMenuApi} from '@/api/menus.js'

// 分页
let total = ref(0)
let currentPage = ref(1)
let pageSize = ref(12)
let data = ref([])
let column =[ 
    {
        //唯一标识
        key: "name",
        //对应的数据字段
        dataIndex: "name",
        //表头的文字信息
        label: "菜单管理",
        align: 'center',
    },
    {
        //唯一标识
        key: "title",
        //对应的数据字段
        dataIndex: "title",
        //表头的文字信息
        label: "标识",
        align: 'center',
    },
    {
        //唯一标识
        key: "state",
        //对应的数据字段
        //表头的文字信息
        label: "菜单状态",
        align: 'center',
        tabCell: true,
    },
    {
        //唯一标识
        key: "menu_id",
        //对应的数据字段
        dataIndex: "menu_id",
        //表头的文字信息
        label: "菜单编号",
        align: 'center',
    },
    {
        //唯一标识
        key: "create_at",
        //对应的数据字段
        dataIndex: "create_at",
        //表头的文字信息
        label: "创建时间",
        align: 'center',
    },
    {
        //唯一标识
        key: "update_at",
        //对应的数据字段
        dataIndex: "update_at",
        //表头的文字信息
        label: "更新时间",
        align: 'center',
        tabCell: true,
    },
]

// 请求菜单管理的API
let getAllMenu = async (currentPage )=>{
    try{
        let res = await getAllMenuApi({
            page:currentPage,
            count:pageSize.value
        })
        console.log(res)
        data.value = res.data
        total.value = res.total

    }catch(e){
        console.log(e)
    }
}



onMounted(()=>{
    getAllMenu()
})
</script>

<script>
export default {
    //自己定义的属性
    meta: {
        key: "菜单管理",
        icon:"icon-caidanguanli1"
    },
    name:"Menu"
}
</script>