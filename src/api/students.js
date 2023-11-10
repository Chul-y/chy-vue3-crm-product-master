import http from "utils/request"

// 获取学生列表
export const getStudentListApi = (params) => http.get("/students/getstulist", {
    params
})
//添加学员信息
export const addStuListApi = (params) => http.post('/students/addstu', params)

//删除学员信息

export const delStuListApi = (params) => http.get('/students/delstu', { params })

//修改学员信息

export const editStuListApi = (params) => http.post('/students/updatestu', params)

//搜索学员信息

export const searchStuListApi = (params) => http.get('/students/searchstu', { params })