import { defineStore } from "pinia"

let useUsersStore = defineStore('users', () => {
    let userInfo = ref({});
    return {
        userInfo
    }
}, {
    persist: {
        //保存到缓存中的key
        key: 'myx-users',
        //使用哪种缓存
        storage: sessionStorage,
        //缓存哪个字段
        paths: ['userInfo']
    }
})

export default useUsersStore