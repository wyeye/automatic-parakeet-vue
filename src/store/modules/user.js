import { login, logout, getInfo, loadMenu } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetMenu({ commit }, parmse) {
      return new Promise((resolve, reject) => {
        loadMenu().then(response => {
          const menu = response.result.data
          const getMenuList = (menu) => {
            if (!menu || !menu.length) {
              return
            }
            const res = []
            const tmpMap = []
            for (let i = 0; i < menu.length; i++) {
              tmpMap[menu[i].id] = menu[i]
              menu[i].component = menu[i].url
              menu[i].path = menu[i].url
              const name = menu[i].url.split('/')
              if (name.length === 2) {
                menu[i].name = name[1].charAt(0).toUpperCase() + name[1].slice(1)
              } else if (name.length === 3 || name.length === 4) {
                menu[i].name = name[2].charAt(0).toUpperCase() + name[2].slice(1)
              }
              menu[i].meta = { 'icon': menu[i].iconCls, 'title': menu[i].text }
              delete menu[i].leaf
              if (tmpMap[menu[i].pid] && menu[i].id !== menu[i].pid) {
                if (!tmpMap[menu[i].pid].children) {
                  tmpMap[menu[i].pid].children = []
                }
                tmpMap[menu[i].pid].children.push(menu[i])
              } else {
                res.push(menu[i])
              }
            }
            return res
          }
          const menuLists = getMenuList(menu)
          localStorage.setItem('menuList', JSON.stringify(menuLists))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
