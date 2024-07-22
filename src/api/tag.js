import request from "@/utils/request";

export function createTag(data) {
  return request({
    url: '/tag/createTag',
    method: 'post',
    data
  })
}
export function deleteTag(id) {
  return request({
    url: '/tag/deleteTag',
    method: 'delete',
    params: {
      ID: id
    }
  })
}
export function editTag(data) {
  return request({
    url: '/tag/updateTag',
    method: 'put',
    data
  })
}
