<template>
    <myx-table :data="data"
               :column="column"
               :showAddButton="false"
               :tableAttr="tableAttr"
               :total="total"
               :pageSize="pageSize"
               :showSelection="true"
               :tableLoading="loading"
               searchField="username"
               :searchMethod="searchLog"
               :titleList="titleList"
               exportFileName="登入日志"
               @export-all="exportAll"
               @currentChange="getLoginLog">
        <template v-slot:tableCell="{ scope }">
            <el-tag effect="dark" type="danger" v-if="scope.column.key === 'username'">
                {{ scope.row.username }}
            </el-tag>
            <el-tag type="warning" v-if="scope.column.key === 'lastip'">
                {{ scope.row.lastLogin.ip }}
            </el-tag>
            <el-tag type="warning" v-if="scope.column.key === 'nowip'">
                {{ scope.row.nowLogin.ip }}
            </el-tag>
            <el-tag v-if="scope.column.key === 'lasttime'">
                {{ scope.row.lastLogin.loginTime }}
            </el-tag>
            <el-tag v-if="scope.column.key === 'nowtime'">
                {{ scope.row.nowLogin.loginTime }}
            </el-tag>
        </template>
    </myx-table>
</template>
<script setup name="welcome">
import { getLoginLogApi, searchLogApi } from '@/api/users'
import qee from "qf-export-excel"
//声明一些响应式变量
//声明一个表格的数据
let data = ref([])
//声明总数的响应式变量
let total = ref(0)
//每页显示的数量
let pageSize = ref(10)
//声明一个控制表格加载动画的响应式变量
let loading = ref(false)
//声明一个列的数据

let column = [
    {
        //唯一标识
        key: "username",
        //对应的数据字段
        dataIndex: "username",
        //表头的文字信息
        label: "登入账号",
        align: 'center',
        tableCell: true
    },
    {
        //唯一标识
        key: "lastip",
        //对应的数据字段
        dataIndex: "lastLogin.ip",
        //表头的文字信息
        label: "上次登入ip",
        align: 'center',
        tableCell: true
    },
    {
        //唯一标识
        key: "lasttime",
        //对应的数据字段
        dataIndex: "lastLogin.loginTime",
        //表头的文字信息
        label: "上次登入时间",
        align: 'center',
        sortable: true,
        tableCell: true
    },
    {
        //唯一标识
        key: "nowip",
        //对应的数据字段
        dataIndex: "nowLogin.ip",
        //表头的文字信息
        label: "本次登入ip",
        align: 'center',
        tableCell: true
    },
    {
        //唯一标识
        key: "nowtime",
        //对应的数据字段
        dataIndex: "nowLogin.loginTime",
        //表头的文字信息
        label: "本次登入时间",
        align: 'center',
        sortable: true,
        tableCell: true
    },
]

//声明一组透传属性

let tableAttr = {
    border: true
}

//声明一个方法专门用于请求日志数据

let getLoginLog = async (currentPage = 1) => {
    loading.value = true;
    try {
        let res = await getLoginLogApi({
            page: currentPage,
            count: pageSize.value
        });
        console.log(res)
        data.value = res.data;
        total.value = res.total;
        //关闭表格加载动画
        loading.value = false;
    } catch (e) {
        console.log(e.toString())
    }
}

//搜索的方法

let searchLog = (key, currentPage, pageSize) => {
    // console.log(key,currentPage,pageSize)
    return searchLogApi({
        key,
        page: currentPage,
        count: pageSize
    })
}
//声明一组数据,里面包含了要导出的内容的字段和表头

let titleList = [
    {
        title: '标识',
        key: '_id'
    },
    {
        title: '登入账号',
        key: 'username'
    },
    {
        title: '本次登入ip',
        key: 'nowLogin.ip'
    },
    {
        title: '本次登入时间',
        key: 'nowLogin.loginTime'
    }
]

//导出全部数据,请求服务器中所有的数据,并且导出到表格中
let exportAll = async () => {
    //添加loading动画
    const loading = ElLoading.service({
        lock: true,
        text: '到处内容较多,请耐心等待...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    let res = await getLoginLogApi({
        count: total.value
    })
    //调用一次导出的插件
    qee(titleList, res.data, '登入日志(全部)');
    //关闭loading动画
    loading.close()
}

// 发起请求
onMounted(() => {
    getLoginLog()
})
</script>
<script>
export default {
    //自己定义的属性
    meta: {
        key: "管理首页",
        icon:"icon-shouye1"
    }
}
</script>
