import axios from "axios"
import useToken from "@/hooks/useToken"
import router from "@/router/index"
let http = axios.create({
    baseURL: import.meta.env.VITE_APP_AXIOS_BASE,
    timeout: 1000 * 15,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

//拦截器

//请求拦截器
http.interceptors.request.use(config => {
    config.headers['authorization'] = useToken()
    return config
})
//响应拦截器
//作用:可以统一处理接口响应的结果,添加统一的错误反馈提示
http.interceptors.response.use(res => {
    // console.log('interceptors--', res)
    //服务器响应了
    if (res.data.state) {
        if (res.data.msg !== '请求成功') {
            ElMessage({
                //显示关闭按钮
                showClose: true,
                //持续时间
                duration: 2000,
                //提示的信息
                message: res.data.msg,
                //提示的类型
                type: 'success'
            })
        }

        //数据响应正确,直接返回数据
        return res.data
    } else {

        //调用反馈的组件提示用户错误
        ElMessage({
            //显示关闭按钮
            showClose: true,
            //持续时间
            duration: 2000,
            //提示的信息
            message: res.data.msg,
            //提示的类型
            type: 'error'
        })
        //登入过期
        if (res.data.code === '10022' || res.data.code === '1004') {
            //清除token
            sessionStorage.removeItem('myx-token')
            //跳转到登入页
            router.push('/login')
        }
        //直接通过reject抛出异常
        return Promise.reject(res.data.msg)
    }

})

export default http