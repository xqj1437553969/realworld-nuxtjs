import { request }from '@/plugins/request'
// 关注作者
export const addFollowAuthor = username => {
  return request({
    method: 'post',
    url: `/api/profiles/${username}/follow`,
  })
}
// 取消关注作者
export const deleteFollowAuthor = username => {
  return request({
    method: 'delete',
    url: `/api/profiles/${username}/follow`
  })
}
// 获取个人信息
export const getProfile = username => {
  return request({
    method: 'get',
    url: `/api/profiles/${username}`
  })
}