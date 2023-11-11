<template>
    <div class="login-container">
        <img class="bg" src="../home//imgs/mm.jpg" alt="">
        <div id="captcha-container" v-if="showCaptcha">
            <div class="title">
                <b>请先进行安全验证!</b>
                <b class="close" @click="closeCaptcha">x</b>
            </div>
            <div id="captcha"></div>
        </div>
        <el-form
                 ref="loginFormRef"
                 :model="loginForm"
                 status-icon
                 :rules="rules"
                 label-width="120px"
                 class="demo-loginForm">
            <h1 class="title">快坐！</h1>
            <!-- 账号  -->
            <el-form-item label-width="50" label="账号" prop="username">
                <el-input v-model="loginForm.username" type="text" autocomplete="on"  />
            </el-form-item>
            <!-- 密码  -->
            <el-form-item label-width="50" label="密码" class="password" prop="password">
                <el-input
                          show-password
                          v-model="loginForm.password"
                          type="password"
                          @keydown.enter="submitForm(loginFormRef)"
                          autocomplete="off" />
            </el-form-item>

            <el-form-item class="submit-btn__outer">
                <el-button class="submit-btn" type="primary" @click="submitForm(loginFormRef)">登入</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script  setup name="login">
//引入滑块验证码的依赖
import "myx-slider-captcha/slider-captcha.min.css"
import sliderCaptcha from "myx-slider-captcha"
import { loginApi } from '@/api/users';
//引入用户store
import useUsersStore from "@/store/users"
import {getCurrentRolePermissionApi} from "../../api/role"
//登入流程:
//1.获取用户输入的用户名和密码
//2.请求服务器,将用户密码携带给接口
//3.服务器进行验证,验证通过会返回token(令牌)
//4.本地需要存储token(sessionStorage)

//调试接口的工具:apipost postman swagger...

const loginFormRef = ref()
//校验用户名的函数
const validateUsername = (rule, value, callback) => {
    //callback传参表示校验不通过
    //不传参表示校验通过
    //value就是输入框里面的输入值
    let parttern = /[a-zA-Z0-9]{3,12}/
    if (parttern.test(value)) {
        callback()
    } else {
        callback('账号必须是3-12位的字母和数字组合')
    }
}
//校验密码的函数
const validatePassword = (rule, value, callback) => {
    let parttern = /[a-zA-Z0-9]{3,12}/
    if (parttern.test(value)) {
        callback()
    } else {
        callback('密码必须是3-12位')
    }
}
//form表单的数据
const loginForm = reactive({
    username: '',
    password: '',
})
//form表单的校验规则
const rules = reactive({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
})

//使用用户store
// console.log(useUsersStore)
let usersStore = useUsersStore();
//使用路由的hook
let router = useRouter()
//提交表单的方法
//声明一个变量,控制滑块容器的显示和隐藏
let showCaptcha = ref(false)
//关闭滑块的处理函数
let closeCaptcha = () => {
    // console.log(123)
    showCaptcha.value = false;
}
const submitForm = (formEl) => {
    console.log(formEl)
    if (!formEl) return
    //校验表单的方法,是从el-form组件上自带的,通过ref获取到el-form组件的实例,然后调用validate方法
    formEl.validate(async (valid) => {
        //valid是一个布尔值,表示校验是否通过
        if (valid) {
            //显示滑块容器
            showCaptcha.value = true;
            //调用滑块验证码,生成滑块
            nextTick(() => {
                sliderCaptcha({
                    id: 'captcha',
                    //背景图片宽度
                    width: 280,
                    //背景图片高度
                    height: 150,
                    // 拼图宽度
                    sliderL: 50,
                    //拼图突出半径
                    sliderR: 9,
                    // 验证容错差
                    offset: 15,
                    //图片加载中显示的文本信息
                    loadingText: '正在加载中...',
                    failedText: '再试一次',
                    barText: '向右滑动填充拼图',
                    repeatIcon: 'fa fa-redo',
                    setSrc() {
                        // 生成随机数
                        let random = Math.ceil(Math.random() * 3);
                        return `/imgs/kun${random}.jpeg`
                    },
                    async onSuccess() {
                        //添加loading动画
                        const loading = ElLoading.service({
                            lock: true,
                            text: '正在登入...',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        // console.log('验证成功')
                        //关闭滑块
                        showCaptcha.value = false;
                        try {
                            //发起登入请求
                            let res = await loginApi({
                                username: loginForm.username,
                                password: loginForm.password
                            })
                            // console.log(res)
                            //存储token
                            sessionStorage.setItem('myx-token', res.token);
                            //存储用户信息
                            usersStore.userInfo = res.userInfo;
                            // 发起请求获取当前角色权限数据
                            let currentRolePermission=await getCurrentRolePermissionApi({roleid:res.userInfo.roleid,type:1})
                            usersStore.currentRolePermission = currentRolePermission.data
                            //跳转到主页
                            router.push("/")
                            //关闭动画
                            loading.close()
                        } catch (err) {
                            console.log(err.toString())
                            loading.close()
                        }
                    },
                    onFail() {
                        console.log('验证失败')
                    }
                })
            })

        } else {
            console.log('error submit!')
            return false
        }
    })
}
//创建滑块验证码的引用
let captcha = ref(null);

</script>
<style scoped lang="scss">
.login-container {
    #captcha-container {
        width: 280px;
        height: 240px;
        background-image: var(--theme-bg-color);
        border-radius: 5%;
        padding: 20px;
        position: fixed;
        right: 42%;
        bottom: 37%;
        z-index: 999;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 35px;

            b {
                color: #fff;

            }

            .close {
                display: inline-block;
                width: 20px;
                height: 20px;
                cursor: pointer;
                border: 1px solid #fff;
                text-align: center;
                line-height: 20px;
                user-select: none;
                
            }
        }

        #captcha {
            border-top: 1px solid #fff;
        }
    }


    .bg {
        position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  z-index: -99;
    }

    .el-form {
        width: 400px;
        height: 400px;
        border-radius: 5%;
        display: flex;
        flex-direction: column;
        // border: 1px solid #ccc;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, .4);
        position: fixed;
        right: 40%;
        bottom: 30%;
        z-index: 99;
        box-sizing: border-box;

        .title {
            color: #fff;
            margin: 20px 0;
        }

        .submit-btn {
            width: 250px;
            background-image: var(--theme-bg-color);
            height: 40px;
        }

        .el-form-item {
            .el-input {
                width: 245px;
                height: 45px;
            }

            :deep(.el-form-item__label) {
                color: #fff;
                font-weight: bolder;
                font-size: 16px;
            }
        }

        .submit-btn__outer {
            :deep(.el-form-item__content) {
                margin-left: 50px !important;

            }
        }
    }
}
</style>  