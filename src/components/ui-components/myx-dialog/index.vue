<template>
    <el-dialog
               @open="dialogOpen"
               @closed="dialogClose"
               v-model="dialogFormVisible" :title="props.title">

        <el-form :model="dialogForm" ref="dialogFormRef">
            <el-form-item label="上传头像" prop="headimgurl" v-if="props.showUpload">
                <s-upload v-model="dialogForm.headimgurl"></s-upload>
            </el-form-item>
            <el-form-item v-for="item in formItems" :key="item.key" :label="item.label" :prop="item.prop"
                          :rules="item.rules">
                <el-input :type="item.type ?? 'text'" v-model="dialogForm[item.modelProp ?? item.prop]" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="ok">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref, watch, watchEffect } from 'vue'



//引入上传组件

import sUpload from "./sUpload.vue"
import { ElMessage } from 'element-plus';


//定义组件未来接受的属性

let props = defineProps({
    //弹框的标题
    title: {
        type: String,
        default: '增加学员信息'
    },
    //弹框的操作类型
    action: {
        type: String,
        default: 'add'
    },
    //弹框显示和隐藏
    modelValue: {
        type: Boolean,
        default: false
    },
    //数据回显的字段
    reviewData: {
        type: Object
    },
    //表单item
    formItems: {
        type: Array,
        default: () => []
    },
    showUpload: {
        type: Boolean,
        default: () => true
    },
    formData: {
        type: Object,
        default: () => ({
            class: "",
            name: "",
            age: "",
            city: "",
            degree: "",
            productUrl: "",
            description: "",
            headimgurl: ""
        })
    }
})

//定义组件将来点击确定和取消触发的方法

let emit = defineEmits(['ok', 'cancel', 'update:modelValue'])

//控制当前组件dialog隐藏和现实的变量
const dialogFormVisible = ref(false)

//侦听父组件传递的props中的dialogVisible变化,变化了就给当前这个组件声明的dialogVisible复制

watch(() => props.modelValue, (newVal) => {
    // console.log(newVal)
    //要判断props中的modelValue是否和当前的dialogFormVisible的值一致
    //如果不一致 才要进行修改
    if (newVal !== dialogFormVisible.value) {
        dialogFormVisible.value = newVal
    }
})



// class	是	班级
// name	是	学员的名字
// age	是	学员的年龄
// city	是	目前居住的城市
// degree	是	学历
// productUrl	是	项目地址
// description	是	一句话对自己的评价
// headimgurl	否	头像

//声明一个响应式变量,存储需要修改的数据的sId

let sId = ref()

const dialogForm = reactive(props.formData)


//弹窗打开的事件处理函数

let dialogOpen = () => {
    //编辑的时候才需要对数据进行回显操作
    if (props.action === 'edit') {
        // console.log('123213123123123')
        // console.log(props.reviewData)
        //给sId赋值
        sId.value = props.reviewData.sId;

        //过滤掉reviewData中的sId和_id
        let keys = Object.keys(props.reviewData)

        let newKeys = keys.filter(key => (key !== 'sId' && key !== '_id'))

        newKeys.forEach(key => {
            dialogForm[key] = props.reviewData[key]
        })
    } else if (props.action === 'add') {
        //添加操作 不需要回显数据,所以需要清空输入框里面的内容


    }
}

//dialog关闭的时候触发的逻辑

let dialogClose = () => {
    //清空表单逻辑
    dialogFormRef.value.resetFields()
    //清空输入框的结果
    // Object.keys(dialogForm).forEach(key => {
    //     dialogForm[key] = ""
    // })
    // console.log('closed')
    dialogFormVisible.value = false
    //这段逻辑是为了更新父组件中的dialogVisible的值
    emit('update:modelValue', dialogFormVisible.value)
}

watchEffect(() => {
    console.log(dialogForm.headimgurl)
})


//声明dialogFormRef来对dialogForm组件中的form组件进行引用

let dialogFormRef = ref()

//声明取消和确定按钮的点击事件

let cancel = () => {
    dialogFormVisible.value = false
    emit('cancel')

}

let ok = () => {
    // 调用表单校验的方法
    dialogFormRef.value.validate(valid => {
        if (valid) {
            //表单校验通过,调用父组件自定义的ok方法
            // console.log(dialogFormRef.value)
            //声明一个对象,用于处理不同操作的时候参数的组成
            let newFormData = {};
            //判断是编辑还是增加操作
            if (props.action === 'edit') {
                // 数据需要sId
                newFormData = {
                    sId: sId.value,
                    ...dialogForm
                }
            } else if (props.action === 'add') {
                // 数据不需要sId
                newFormData = { ...dialogForm }
            }
            dialogFormVisible.value = false
            //触发组件自定义的方法,将参数传递给父组件 传递dialogForm中的数据
            emit('ok', newFormData)
        } else {
            ElMessage.error('选项填写不完整,带※号的都需要填写完整')
        }
    })
    // emit('ok')

}



</script>