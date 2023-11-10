<template>
    <el-dropdown @command="dropDownChange">
        <span class="el-dropdown-link">
            <el-icon>
                <CaretBottom />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item divided command="upgread">
                    🔐升级
                    <b class="plus">Plus</b>
                </el-dropdown-item>
                <el-dropdown-item divided command="mine">
                    <i class="iconfont icon-yonghu"></i>
                    账号信息
                </el-dropdown-item>
                <el-dropdown-item divided command="product">
                    <i class="iconfont icon-shangpinguanli"></i>
                    项目管理
                </el-dropdown-item>
                <el-dropdown-item divided command="quit">
                    <i class="iconfont icon-tuichu2"></i>
                    退出
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { CaretBottom } from '@element-plus/icons-vue'
let router = useRouter()
let dropDownChange = (param) => {
    // console.log(param)
    switch (param) {
        case "quit":
            //退出登入
            //清空token
            sessionStorage.removeItem('myx-token')
            //跳转到登入页面
            router.push("/login");
            //刷新页面,清空用户的菜单页面数据
            location.reload();
            break;
        case "product":
            router.push("/students/product")
            break
        default:
            break;
    }
}
</script>
<style scoped lang="scss">
.icon {
    width: 3.5em;
    height: 3.5em;
    vertical-align: -1.25em;
    fill: currentColor;
    overflow: hidden;
}

.el-dropdown-menu,
:deep(.el-dropdown-menu__item),
:deep(.el-dropdown-menu__item--divided:before) {
    background-image: var(--theme-bg-color);
    color: #fff !important;
    text-align: center;
    font-weight: bolder;
    display: block;
}

.el-dropdown-menu {
    width: 200px;
    color: #fff;
}

.plus {
    font-weight: bold;
    display: inline-block;
    background: linear-gradient(90deg, #FFD706 0%, #CDFF06 100%);
    font-size: 18px;
    color: #000;
    padding: .2em .8em;
    border-radius: 6%;
}

.grid {
    border-radius: 4px;
    min-height: 60px;
    color: #fff;
    line-height: 60px;
    font-weight: 900;
}

.title {
    font-size: 2em;
    text-align: center;
}

.grid-content1 {
    text-align: left;

    :deep(.iconfont) {
        font-size: 25px;
        cursor: pointer;
        color: #fff;
    }
}


.grid-content3 {
    text-align: right;

    .icon {
        width: 5em;
        height: 2em;
        vertical-align: middle;
        margin-right: 5px;
    }
}

.el-dropdown {
    color: #fff;

    span {
        &:focus-visible {
            outline: none;
        }
    }

    .el-icon {
        width: 4em;
        height: 4em;
        justify-content: flex-start;

        svg {
            width: 2em;
            height: 2em;
        }
    }
}

.el-avatar {
    vertical-align: middle
}

.vip-gold {
    color: #e9b93f !important;
    font-weight: 900;
    font-size: 16px;
}

.nickname {
    display: inline-block;
    margin-left: 5px;
    max-width: 35%;
    // overflow:hidden;
}
</style>