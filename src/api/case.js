import request from '@/utils/request'

export function listCase(params) {
  return request({
    url: '/case/list',
    method: 'get',
    params
  })
}
export function deleteCase(id) {
  return request({
    url: '/case/delete',
    method: 'get',
    params: { id }
  })
}
export function addOrEditCase(id, title,theme_img,content) {
  return request({
    url: '/case/addOrEdit',
    method: 'get',
    params: { id, title,theme_img, content }
  })
}
export function queryOneCase(id) {
  return request({
    url: '/case/one',
    method: 'get',
    params: { id }
  })
}
