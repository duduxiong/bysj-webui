import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/user/pagelist',
    method: 'post',
    data
  })
}

export function add(data){
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function update(data){
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/user/delete?id='+id,
    method: 'post'
  })
}

export function author(data){
  return request({
    url: '/user/author',
    method: 'post',
    data
  })
}

export function getUserRoles(userId){
  return request({
    url: '/user/roles/'+userId,
    method: 'get'
  })
}
