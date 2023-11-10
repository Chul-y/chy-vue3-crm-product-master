import http from "@/utils/request"

//获取所有菜单

export const getAllMenuApi = (params) => http.get("/menus/getMenus", { params })

//获取角色菜单

export const getRoleMenuApi = params => http.get("/menus/getRoleMenus", { params })