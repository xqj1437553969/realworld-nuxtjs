<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="clickPublishArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="clickPublishArticle"
                :disabled="publishDisabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAtricleDetail, createArticle, updateArticle} from '@/api/article'
export default {
  name: "EditorIndex",
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  components: {},
  props: {},
  data() {
    return {
      tag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      publishDisabled: false,
      // 错误信息
      errors: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 发布文章
    async clickPublishArticle() {
      const { slug } = this.$route.params 
      // 路由动态参数 slug 存在，表示更新文章，否则就是创建文章
      const publishArticle = slug ? updateArticle : createArticle
      this.tag && (this.article.tagList = this.tag.split(' '))
      this.publishDisabled = true
      try {
        const { data } = await publishArticle({
          article: this.article
        }, slug)
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      } catch(err) {
        this.errors = err.response.data.errors;
      }
      this.publishDisabled = false
    }
  },
  created() {},
  async mounted() {
    const { slug } = this.$route.params 
    // 路由动态参数 slug 存在，则说明是点击编辑文章按钮跳转过来的
    // 需要获取文章详情
    if (slug) {
      const { data } = await getAtricleDetail(slug)
      const { title, description, body, tagList} = data.article
      this.article.title = title
      this.article.description = description
      this.article.body = body
      this.article.tagList = tagList
      debugger
      this.article.tagList.map(item => {
        this.tag += item + ' '
      })
    }
  },
};
</script>
<style></style>
