import http from "@/utils/request"

//登入接口

export const loginApi = data => http.post('/users/login', data);

//获取登入日志
export const getLoginLogApi = params => http.get('/getloginlog', {
    params
});

//搜索登入日志
export const searchLogApi = params =>http.get('/getloginlog/search',{
    params
})