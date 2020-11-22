import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  })
}
export function loadMenu() {
  return request({
    url: '/sys/user/loadMenu',
    method: 'post'
  })
}
