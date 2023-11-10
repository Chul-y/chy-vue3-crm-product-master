<template>
    <myx-table
               :data="dataSource"
               :total="total"
               :pageSize="pageSize"
               :tableAttr="tableAttr"
               :column="column"
               :tableLoading="loading"
               searchField='name'
               :search-method='searchMethod'
               :show-selection="true"
               export-file-name="学员信息"
               :title-list="titleList"
               @export-all="exportAll"
               @add-data="handleAdd"
               @current-change="currentChange">
        <template v-slot:tableCell="{ scope }">
            <div class="action" v-if="scope.column.key === 'action'">
                <el-button type="success" :icon="Check" size="small">查看</el-button>
                <el-button type="primary" :icon="Edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" :icon="Delete" size="small" @click="del(scope.row.sId)">删除</el-button>
            </div>
            <div class="avatar" v-if="scope.column.key === 'avatar'">
                <el-image
                          style="width: 50px; height: 50px"
                          :src="scope.row.headimgurl"
                          :zoom-rate="1.2"
                          :max-scale="7"
                          :min-scale="0.2"
                          :preview-src-list="srcList"
                          :initial-index="scope.$index"
                          fit="cover" />
            </div>
        </template>
    </myx-table>
    <myx-dialog
                :fromData="dialogFormData"
                @ok="handleOk"
                :review-data="reviewData"
                :title="dialogTitle"
                :formItems="formItems"
                :action="action"
                v-model="dialogVisible">
    </myx-dialog>
</template>
<script setup name="product">
import myxTable from "components/ui-components/myx-table/index.vue"
import * as api from "@/api/students";
import { onMounted } from "vue";
import qee from "qf-export-excel";
import {
    Check,
    Delete,
    Edit,
} from '@element-plus/icons-vue'
//声明表格透传的属性

let tableAttr = {
    border: true,
    'header-cell-style': {
        'font-weight': 700,
        textAlign: 'center',
        height: '50px',
        // backgroundImage: "var(--theme-bg-color)",
        // color:"#FFF"
    }
}

//声明表格的数据和列数据

let dataSource = ref([]);

let column = [
    {
        key: 'avatar',
        label: '头像',
        dataIndex: "headimgurl",
        tableCell: true,
        align: 'center',
        width: 80
    },
    {
        key: 'name',
        label: '姓名',
        dataIndex: "name",
        align: 'center'
    },
    {
        key: "class",
        label: "班级",
        dataIndex: "class",
        align: 'center'
    },
    {
        key: "degree",
        label: "学历",
        dataIndex: "degree",
        align: 'center'
    },
    {
        key: "product",
        label: "项目",
        dataIndex: "productUrl",
        align: 'center'
    },
    {
        key: "cTime",
        label: "创建时间",
        dataIndex: "cTime",
        align: 'center'
    },
    {
        tableCell: true,
        key: "action",
        label: "操作",
        align: 'center',
        width: 250
    }
]

let total = ref(0)

//控制表格的loading

let loading = ref(false)

//声明页码和每页条数

let page = ref(1)

let pageSize = ref(6)

//声明一组用于预览的图片地址数据
let srcList = ref([])

//封装一个方法用于获取数据

let getStuList = async () => {
    loading.value = true
    try {
        let res = await api.getStudentListApi({ page: page.value, count: pageSize.value })
        dataSource.value = res.data;
        total.value = res.total;
        // console.log(res)
        srcList.value = res.data.map(item => item.headimgurl)
        loading.value = false;
    } catch (e) {
        console.log(e.toString())
    }
}

//currentChange页码变更的时候
let currentChange = (currentPage) => {
    // console.log(page)
    page.value = currentPage;
    //重新获取数据
    getStuList()
}

//searchMethod搜索的时候

let searchMethod = (key, cur, size) => {
    return api.searchStuListApi({
        key,
        page: cur,
        count: size
    })
}

//定义titleList用于导出选中数据
let titleList = column.map(item => ({
    key: item.dataIndex,
    title: item.label
})).filter(item => item.key)

//导出全部数据

let exportAll = () => {
    ElMessageBox.confirm(
        '是否确认要导出全部数据?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
        .then(async () => {
            let loading = ElLoading.service({
                lock: true,
                text: '正在导出全部信息,请耐心等待...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            try {
                //请求服务器中全部的数据
                let res = await api.getStudentListApi({ count: total.value });
                qee(titleList, res.data, '全部学员信息')
                loading.close()
            } catch (e) {
                console.log(e.string())
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消导出',
            })
        })

}

//---------------------dialog弹窗--------------------------
//控制dialog的显示隐藏
let dialogVisible = ref(false);
//dialog的标题
let dialogTitle = ref("添加学员");

//声明dialog的操作类型 
let action = ref("add");

//声明数据回显对象
let reviewData = ref({})

//弹窗表单的数据

let dialogFormData = ref({
    name: "",
    class: "",
    degree: "",
    productUrl: "",
    headimgurl: "",
    age: "",
    city: "",
    description: ""
})

//弹窗中formItem元素的配置
let labels = ['姓名', '班级', '学历', '项目', '头像', '年龄', '城市', '描述'];
//根据labels和dialogFormData生成formItems
let formItems = Object.keys(dialogFormData.value).map((key, index) => ({
    type: 'input',
    rules: [{ required: true, message: `请输入${labels[index]}` }],
    label: labels[index],
    prop: key,
    modelProp: key,
    key
})).filter(item => item.key !== 'headimgurl')


//点击dialog确定按钮的回调

let handleOk = async (newData) => {
    // console.log(newData)
    //发起请求,将数据传递给后台
    try {
        //判断是编辑还是添加
        if (action.value === 'add') {
            await api.addStuListApi(newData);
        } else if (action.value === 'edit') {
            await api.editStuListApi(newData)
        }
        // console.log(res)
        //更新表格
        getStuList();
    } catch (e) { }
}

//添加
let handleAdd = () => {
    action.value = 'add'
    dialogTitle.value = '添加学员'
    dialogVisible.value = true;
}
//编辑
let handleEdit = (row) => {
    // console.log(row)
    action.value = 'edit'
    dialogTitle.value = '编辑学员'
    //给reviewData重新赋值,数据回显
    reviewData.value = { ...row }
    // console.log('-------',reviewData.value)
    dialogVisible.value = true;
}
//删除
let del = sId => {
    ElMessageBox.confirm(
        '是否确认要删除这条信息?',
        '⚠️警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                //发起请求删除数据
                await api.delStuListApi({ sId })
                //更新列表
                getStuList()
            } catch (e) {
                console.log(e.toString())
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

onMounted(() => {
    getStuList()
})

</script>
<script>
export default {
    //自己定义的属性
    meta: {
        key: "学员项目管理",
        icon:"icon-peixunxiangmu2"
    }
}
</script>
