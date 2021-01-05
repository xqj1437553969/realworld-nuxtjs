import { request } from '@/plugins/request'
// 获取公共文章列表
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/api/articles',
    params
  })
}

// 获取用户关注的文章列表
export const getFeedArticles = params => {
  return request({
    method: 'get',
    url: '/api/articles/feed',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'post',
    url: `/api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'delete',
    url: `/api/articles/${slug}/favorite`
  })
}

// 获取文章详情
export const getAtricleDetail = slug => {
  return request({
    method: 'get',
    url: `/api/articles/${slug}`
  })
}

// 获取文章评论
export const getAtricleCommnents = slug => {
  return request({
    method: 'get',
    url: `/api/articles/${slug}/comments`
  })
}

// 发表评论
export const addAtricleComment = (slug, data) => {
  return request({
    method: 'post',
    url: `/api/articles/${slug}/comments`,
    data
  })
}

// 删除评论
export const deleteAtricleComment = (slug, id) => {
  return request({
    method: 'delete',
    url: `/api/articles/${slug}/comments/${id}`
  })
}

// 删除文章
export const deleteArticle = slug => {
  return request({
    method: 'delete',
    url: `/api/articles/${slug}`
  })
}

// 创建文章（发布文章）
export const createArticle = data => {
  return request({
    method: 'post',
    url: `/api/articles`,
    data
  })
}

// 更新文章（编辑文章重新发布）
export const updateArticle = (data, slug) => {
  return request({
    method: 'PUT',
    url: `/api/articles/${slug}`,
    data
  })
}