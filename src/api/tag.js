import request from "@/utils/request";

export function getTagList(params) {
  return request({
    url: '/tag/getTagList',
    method: 'get',
    params
  })
}
