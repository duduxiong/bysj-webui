import request from '@/utils/request'

export function getMenuList() {
  return request({
    url: '/system/menu/list',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data
  })
}

export function getMenuById(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'get'
  })
}

export function updateMenuById(data) {
  return request({
    url: '/system/menu/update',
    method: 'post',
    data
  })
}

export function deleteMenuById(id) {
  return request({
    url: '/system/menu/delete?id=' + id + '',
    method: 'post'
  })
}

export function getUserMenu(){
  return request({
    url: '/system/menu/usermenu',
    method: 'get'
  })
}