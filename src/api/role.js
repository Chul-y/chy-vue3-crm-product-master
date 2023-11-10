import http from "@/utils/request"

// 获取所有角色列表
export const getAllRoleApi = (params) => http.get("/role/getRole", { params })

// 获取当前角色的权限列表
export const getCurrentRolePermissionApi = (params) => http.get("/role/getRolePermission", { params })

// 角色授权
export const grantRoleApi = (data) => http.post("/role/grantRole", data)

// 获取所有权限列表
export const getAllPermissionApi = (params) => http.get("/permission/getPermissionPath", { params })