<template>
    <div class="sub-menu-com" v-for="item in props.menuList" :key="item.menu_id">
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">
            <template #title>
                <el-icon>
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="`#${item.meta?.icon}`"></use>
                    </svg>
                </el-icon>
                <span>{{ item.meta?.key }}</span>
            </template>
            <sub-menu :menu-list="item.children"></sub-menu>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path" @click="handleClick">
            <el-icon>
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="`#${item.meta?.icon}`"></use>
                </svg>
            </el-icon>
            <template #title>{{ item.meta?.key }}</template>
        </el-menu-item>
    </div>
</template>
  
<script  setup name="sub-menu">
import { useRoute } from "vue-router"

let router = useRouter()
//声明props
let props = defineProps({
    menuList: {
        type: Array,
        default: []
    }
})

//el-menu-item的点击事件

let handleClick = (instance) => {
    // console.log(instance)
    let indexPath = instance.indexPath
    // console.log(indexPath)

    //通过indexPath获取当前菜单的对应的跳转路径

    let path = "/" + indexPath.join("/")

    router.push(path)
}
</script>
  

  