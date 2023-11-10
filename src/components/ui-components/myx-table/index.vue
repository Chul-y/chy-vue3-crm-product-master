<template>
    <div class="log-container">
        <div class="search">
            <el-select
                       v-if="props.showTableSearch"
                       v-model="selectValue"
                       filterable
                       clearable
                       remote
                       :suffix-icon="Search"
                       reserve-keyword
                       remote-show-suffix
                       placeholder="输入用户名进行搜索"
                       :remote-method="remoteMethod"
                       @change="selectChange"
                       :loading="selectLoading">
                <el-option
                           v-for="item in options"
                           :key="item"
                           :value="item" />
            </el-select>
        </div>
        <slot name="tableMiddle" v-if="props.showTableMiddle">
            <div class="middle">
                <el-button v-if="props.showAddButton" type="primary" @click="addData" plain>
                    <el-icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiaoseguanli2"></use>
                        </svg>
                    </el-icon>
                    &nbsp;
                    添加
                </el-button>
                <el-button type="success" @click="exportSelection" plain>
                    <el-icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-excel"></use>
                        </svg>
                    </el-icon>
                    &nbsp;
                    导出选中数据
                </el-button>
                <el-button type="warning" @click="exportAll" plain>
                    <el-icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-excel"></use>
                        </svg>
                    </el-icon>
                    &nbsp;

                    导出全部数据
                </el-button>
            </div>
        </slot>

        <el-table v-loading="tableLoading"
                  @selection-change="selectionChange"
                  :row-key="getRowKey"
                  :data="tableData"
                  v-bind="props.tableAttr"
                  style="width: 100%">
            <el-table-column v-if="props.showSelection" reserve-selection type="selection"></el-table-column>
            <template v-if="tableData.length">
                <el-table-column v-for="(col, i) in props.column"
                                 :prop="col.dataIndex"
                                 v-bind="col">
                    <!-- <slot :column="{ ...col, ...tableData[i] }" name="tableCell">{{ getChainData(tableData[i],
                        col.dataIndex)
                    }}</slot> -->

                    <template #default="{ row, $index }">
                        <slot v-if="col.tableCell" name="tableCell" :scope="{ column: col, row, $index }"></slot>
                    </template>

                </el-table-column>
            </template>


        </el-table>

        <div class="pagenation-content">
            <el-pagination @size-change="sizeChange"
                           v-model:page-size="pageSize"
                           @current-change="pageCurrentChange"
                           v-model:current-page="currentPage"
                           hide-on-single-page
                           background
                           layout="prev, pager, next,jumper" :total="pageTotal" />
        </div>
    </div>
</template>

<script setup>

import { Search } from '@element-plus/icons-vue'
// console.log(Search)
import myxProps from "./props"
import getChainData from "./utils/getChainData"
import { watch } from "vue";
import qee from "qf-export-excel"
import { ElMessage } from "element-plus"
//获取当前实例


//定义props

let props = defineProps(myxProps)

//定义事件

let emits = defineEmits(['handleSearch', 'currentChange', 'selectionChange', 'addData', 'exportSelection', 'exportAll']);
//midd按钮模块

// 添加数据的方法

let addData = () => {
    emits('addData')
}


//定义导出数据的表头

let titleList = props.titleList

//表格数据被选中的方法

let selectionChange = selection => {
    // console.log(selection)
    selections.value = selection;
    emits('selectionChange', selection)

}


//导出选中数据
let exportSelection = () => {
    // emits('exportSelection')
    //声明titleList
    if (!titleList || !titleList.length) {
        ElMessage.error('没有传递表格表头数据')
        return
    }
    if (!selections.value.length) {
        //如果没有选中数据,要提示用户
        ElMessage.error('没有选中数据')
        return
    }
    qee(titleList, selections.value, props.exportFileName)
    ElMessage.success('导出成功')
}

//导出全部数据

let exportAll = () => {
    emits('exportAll')
}

let { pagenationPosition } = toRefs(props)

//给表格跨页选中的时候,增加唯一标识

let getRowKey = row => {
    return row._id
}

//存储勾选的数据
let selections = ref([])


//表格数据
let tableData = ref([])
//表格列数据
// let tableColumn = props.column
//表格加载动画
let tableLoading = ref(false)

watch(() => props.tableLoading, (newVal) => {
    // console.log(newVal)
    tableLoading.value = newVal
})


//侦听propsData的变化
watch(() => props.data, (newVal) => {
    tableData.value = newVal;
})

//侦听props.total的变化,对total重新赋值

watch(() => props.total, (newVal) => {
    pageTotal.value = newVal
})

//分页器模块


//声明当前页码,第几页
let currentPage = ref(props.currentPage)

//一页显示几条

let pageSize = ref(props.pageSize)

//总数,一共有多少条数据

let pageTotal = ref(props.total)

//事件处理函数
let sizeChange = (e) => {
    // console.log('size-change', e)
}

let pageCurrentChange = (currentPage) => {
    // console.log('pageCurrentChange')
    //判断远程搜索输入框是否有输入值,如果有输入值,说明在搜索状态,要显示搜索的分页结果
    if (selectValue.value) {
        searchLog(selectValue.value, currentPage, pageSize.value)
    } else {
        // getLoginLog(currentPage, pageSize.value)
        emits('currentChange', currentPage)
    }

}


//搜索逻辑 通过选择器进行搜索
//搜索请求回来的数据
let options = ref([])
//选择器中选项的值
const selectValue = ref("")
//选择器的加载动画
const selectLoading = ref(false)


// 声明一个开关,用于区分当前是选中状态还是远程模糊搜索状态
let isSelect = false;
//远程搜索方法
const remoteMethod = (query) => {
    // console.log('remoteMethod', isSelect)
    // console.log(selectValue.value)
    // 如果query是空字符串,那么就不需要请求搜索数据
    if (query) {
        isSelect = false
        searchLog(query, "", "")
    }
    emits('handleSearch', query)
}

//选择器选中内容的时候
let selectChange = () => {
    //清空输入值的时候
    // if (!selectValue.value) {
    //     //让页码数变成1
    //     currentPage.value = 1;
    // }

    currentPage.value = 1;

    isSelect = true;
    // console.log('change', isSelect)
    //选中数据的时候要再次发起请求,只展示选中的搜索之后的数据

    searchLog(selectValue.value, currentPage.value, pageSize.value)
    //触发搜索函数
    emits('handleSearch', selectValue.value)
}

//搜索加载

let searchLoading = ref(false)

//封装一个用于搜索的方法

let searchLog = async (key, currentPage, pageSize) => {

    // 需要判断是否传入searchField

    if (!props.searchField || !props.searchMethod) {
        throw new Error('searchField或者searchMethod字段没有传递,搜索模糊结果不予显示')
    }
    //打开搜索loading
    selectLoading.value = true;
    try {
        let res = await props.searchMethod(key, currentPage, pageSize)
        // console.log('-----res', key, res)
        selectLoading.value = false;
        // console.log(res)
        let searchData = getChainData(res, props.searchDataField)
        // console.log('----searchData', searchData)
        //赋值给了option,要进行去重操作
        let norepeatOptions = [...new Set(searchData.map(item => item[props.searchField]))]
        // console.log(options)
        //正在模糊搜索
        !isSelect && (options.value = norepeatOptions);
        // console.log(options.value)
        // console.log(res)
        //如果是选中了搜索结果
        if (isSelect) {
            //给表格数据进行赋值
            tableData.value = searchData
            // console.log('-----264', searchData)
            // console.log('select', tableData.value)
            //给分页器赋值
            pageTotal.value = getChainData(res, props.searchDataTotalField)
        }

    } catch (e) {
        console.log(e.toString())
    }
}

</script>
<script>
export default {
    name: 'myx-table'
}
</script>

<style scoped lang="scss">
.log-container {
    .pagenation-content {
        margin-top: 20px;
        display: flex;
        // align-items: center;
        justify-content: v-bind(pagenationPosition)
    }

    .middle {
        border: 1px solid #ebeef5;
        padding: 20px 10px;
        margin: 10px 0;
        border-radius: 10px;
    }

    .search {
        margin: 20px 0;

        .el-select {
            width: 30%;
        }
    }
}
</style>
