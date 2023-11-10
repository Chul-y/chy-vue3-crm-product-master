//编写一个hooks,用于获取token
//1.token存储对应的key
//2.token存储的缓存是哪个 'session' | 'local'
/**
 * 
 * @param {String} tokenKey token存储对应的key
 * @param {String} storage token存储的缓存是哪个 'session' | 'local'
 * @returns 
 */
let useToken = (tokenKey='myx-token', storage = 'session') => {
    if (!tokenKey) {
        throw error('tokenKey必须传递')
    }
    switch (storage) {
        case 'local':
            return localStorage.getItem(tokenKey)
        case 'session':
          
            return sessionStorage.getItem(tokenKey)
    }
}

export default useToken