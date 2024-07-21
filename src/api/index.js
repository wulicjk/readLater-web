import request from '@/utils/request'

export function addLinkToCard(data) {
  return request({
    url: '/readList/addLinkToCard',
    method: 'post',
    data
  })
}
export function deleteCard(id) {
  return request({
    url: 'readList/deleteReadList',
    method: 'delete',
    params: {
      ID: id
    }
  })
}
export function editCard(data) {
  return request({
    url: 'readList/updateReadList',
    method: 'put',
    data
  })
}
export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}
