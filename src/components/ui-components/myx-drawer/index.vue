<template>
    <el-drawer
               :model-value="props.show"
               title="I have a nested table inside!"
               direction="rtl"
               custotom-class="drawer"
               @closed="handleClose"
               @open="handleOpen"
               :size="props.size">
        <!-- 自定义头 -->
        <template #header="{ close, titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#' + props.icon"></use>
                </svg>
                {{ props.title }}
            </h4>
            <slot name="customButton"></slot>
        </template>

        <!-- 自定义内容 -->
        <slot name="nested"></slot>
    </el-drawer>
</template>
<script setup>

//定义props来接受控制抽屉打开和隐藏的属性

let props = defineProps({
    //控制抽屉显示和隐藏的变量
    show: {
        type: Boolean,
        default: false
    },
    //抽屉标题图标
    icon: {
        type: String,
        default: "icon-jiaosezuguanli"
    },
    //抽屉标题
    title: {
        type: String,
        default: "分配权限"
    },
    //抽屉打开的时候
    openedFn: {
        type: Function
    },
    //抽屉关闭的时候
    closedFn: {
        type: Function
    },
    //抽屉宽度
    size: {
        type: String,
        default: '20%'
    }
})


//定义组件的事件

let emit = defineEmits(["drawer-close"]);

//抽屉关闭的时候

let handleClose = () => {
    console.log('guanbi le')
    //改父级model的值
    emit("drawer-close", false)
}


//抽屉打开的时候

let handleOpen = () => {
    // console.log('123')
    // console.log(props.openedFn)
    typeof (props['openedFn']) === 'function' && props['openedFn']()
}

</script>
