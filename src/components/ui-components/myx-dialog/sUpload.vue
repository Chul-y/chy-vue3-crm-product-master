<template>
    <el-upload
               @click="handleRemove"
               class="avatar-uploader"
               ref="upload"
               :before-upload="beforeAvatarUpload"
               :on-success="handleAvatarSuccess"
               action="/api/upload/uploadImg"
               name="img"
               :limit="1"
               :show-file-list="false"
               list-type="picture-card">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>

    </el-upload>

    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>
<script  setup>
import { ref, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import { ElMessage } from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

//点击垃圾桶删除触发的逻辑
const handleRemove = (file) => {
    upload.value.handleRemove(file)
}

//图片预览的逻辑
// const handlePictureCardPreview = (file) => {
//     dialogImageUrl.value = file.url
//     dialogVisible.value = true
// }

// const handleDownload = (file) => {
//     console.log(file)
// }

//定义组件v-model默认接受的modelValue

let props = defineProps(['modelValue'])

watchEffect(() => {

    imageUrl.value = props.modelValue

}, {
    flush: 'post'
})


//定义emit事件

let emit = defineEmits(['update:modelValue'])

// console.log(props)

//控制文件上传的大小和格式 

//关键的核心属性

//1.action 上传的接口地址

//2.name 后台指定的这个文件对应的字段是什么



const beforeAvatarUpload = (rawFile) => {

    // console.log(rawFile.type)
    //运行上传的文件类型
    let rawType = ['image/webp', 'image/png', 'image/jpeg', 'image/gif']

    if (!rawType.includes(rawFile.type)) {
        ElMessage.error('上传的文件类型必须是:' + rawType.join(',') + '中的一种')
        return false
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage.error('文件上传大小不能超过1MB!')
        return false
    }
    return true
}

//回顾组件上使用v-model的流程

//上传成功
let imageUrl = ref('')
const handleAvatarSuccess = (response, uploadFile) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
    // console.log(response)
    //将上传成功之后服务器返回的结果中的图片资源地址,通过组件的model的形式传递给dialog组件中的form表单

    if (response.state) {
        //上传成功了
        emit('update:modelValue', response.imgUrl)

    } else {
        ElMessage.error('上传出错')
    }
}

//upload组件的引用

let upload = ref()

// console.log(upload)

</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>

  