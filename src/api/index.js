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
  const date = new Date(dateTimeString)
  // return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  // 将 UTC 时间转换为中国标准时间 (Asia/Shanghai)
  return date.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',  // 指定中国时区
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false  // 24小时制
  });
}

export function getReadList(params) {
  return request({
    url: '/readList/getReadListList',
    method: 'get',
    params
  })
}
