import request from "@/utils/request";

export function getReadList(params) {
  return request({
    url: '/readList/getReadListList',
    method: 'get',
    params
  })
}

