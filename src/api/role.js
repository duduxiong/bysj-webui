import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/system/role/list',
    method: 'get'
  })
}

export function addRole(data){
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

export function findRoleById(id) {
  return request({
    url: '/system/role/' + id + '',
    method: 'get'
  })
}

export function updateRoleById(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

export function deleteRoleById(id) {
  return request({
    url: '/system/role/delete?id=' + id + '',
    method: 'post'
  })
}

export function author(data){
  return request({
    url: '/system/role/author',
    method: 'post',
    data
  })
}

export function getRoleMenuList(roleId) {
  return request({
    url: '/system/role/rolemenu/' + roleId +'',
    method: 'get'
  })
}