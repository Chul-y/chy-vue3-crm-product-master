export default {
    // flex-start center flex-end
    pagenationPosition: {
        type: String,
        default: () => 'center'
    },
    //表格数据源
    data: {
        type: Array,
        default: () => []
    },
    //列数据
    column: {
        type: Array,
        default: () => []
    },
    //分页数据
    total: {
        type: Number,
        default: () => 0
    },
    //一页显示多少条
    pageSize: {
        type: Number,
        default: () => 13
    },
    //当前第几页
    currentPage: {
        type: Number,
        default: () => 1
    },
    //模糊搜索显示内容对应的字段
    searchField: {
        type: String,
        required: true,
        default: ""
    },
    searchMethod: {
        type: Function
    },
    searchDataField: {
        type: String,
        default: () => 'data'
    },
    searchDataTotalField: {
        type: String,
        default: () => 'total'
    },
    tableLoading: {
        type: Boolean,
        default: false
    },
    showSelection: {
        type: Boolean,
        default: false
    },
    titleList: {
        type: Array,
        default: () => []
    },
    exportFileName: {
        type: String,
        default: () => '表格数据'
    },
    tableAttr: {
        type: Object,
        default: () => { }
    },
    showTableSearch: {
        type: Boolean,
        default: () => true
    },
    showTableMiddle: {
        type: Boolean,
        default: () => true
    },
    showAddButton: {
        type: Boolean,
        default: () => true
    }
}