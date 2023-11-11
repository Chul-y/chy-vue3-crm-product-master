import { defineStore } from "pinia"

let useUsersStore = defineStore('users', () => {
    let userInfo = ref({});
    // 当前角色的权限数据
    let currentRolePermission = ref([])
    return {
        userInfo,
        currentRolePermission
    }
}, {
    persist: {
        //保存到缓存中的key
        key: 'myx-users',
        //使用哪种缓存
        storage: sessionStorage,
        //缓存哪个字段
        paths: ['userInfo', "currentRolePermission"]
    }
})

export default useUsersStore