<template>
    <el-header>
        <el-row :gutter="20">
            <!-- 展开收起的图标按钮 -->
            <el-col :span="8">
                <div class="grid is-collapse">
                    <i @click="handleCollapse()" :class="['iconfont', collapseClass]"></i>
                </div>
            </el-col>
            <!-- 中间标题部分 -->
            <el-col :span="8">
                <div class="grid title">
                    <h1>chyCRM管理系统</h1>
                </div>
            </el-col>
            <!-- 右侧信息下拉菜单部分 -->
            <el-col :span="8">
                <div class="grid info">
                    <!-- 头像 -->
                    <el-avatar :size="45" :src="userStore.userInfo.headimgurl" class="info-inner">
                        <img
                             src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                    </el-avatar>
                    <!-- 昵称 -->
                    <b class="info-inner">{{ userStore.userInfo.nickname }}</b>
                    <!-- 下拉菜单 -->
                    <dropdown-com></dropdown-com>
                    <!-- 主题 -->
                    <span>主题</span>
                    <el-switch
                        v-model="value4"
                        class="ml-2"
                        inline-prompt
                        style="--el-switch-on-color: #4e61ed; --el-switch-off-color: #000"
                        active-text="☀"
                        inactive-text="🌙"
                    />

                </div>
            </el-col>
        </el-row>
    </el-header>
</template>
<script setup>
//引入store
import usePermission from "@/store/permission"
//引用userStore
import useUser from "@/store/users"
//引入封装好的dropdown
import dropdownCom from "components/ui-components/myx-drop-down/index.vue"
// 主题
import { useDark, useToggle } from '@vueuse/core'


let userStore = useUser();
console.log(userStore.userInfo)
let permissionStore = usePermission()
let handleCommand = key => {
    console.log(key)
}
// 主题
const value4 = ref(true)
const isDark = useDark({
    selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',}
)
const toggleDark = useToggle(isDark)


//使用vueuse库中的useToggle
//1.开关的值,一般是一个布尔值
//2.控制开关的方法
let [tg, handleCollapse] = useToggle(false)

let collapseClass = computed(() => {
    // console.log('------', tg.value)
    permissionStore.isCollapse = tg.value; //将开关的值赋值给store中的isCollapse
    return tg.value ? 'icon-fold-right' : 'icon-shouqi1'
})

// 切换主题
import { Check, Close } from '@element-plus/icons-vue'
const value2 = ref(true)
</script>





<style scoped lang="scss">
.el-header {
    .grid {
        // background:#ccc;
        min-height: 60px;
    }

    .is-collapse {
        text-align: left;

        :deep(.iconfont) {
            font-size: 30px;
            cursor: pointer;
        }
    }

    .info {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .info-inner {
            margin: 0 10px;
        }

        .el-icon {
            color: #fff;
            width: 3em;
            height: 3em;

            svg {
                width: 100%;
                height: 100%;
            }
        }


    }
}
</style>