<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <!-- 文章内容 -->
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>
      <!-- /文章内容 -->

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <ArticleComments :article="article"></ArticleComments>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAtricleDetail } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/ArticleMeta'
import ArticleComments from './components/ArticleComments'
export default {
  name: "ArticleIndex",
  async asyncData({ params }) {
    const slug = params.slug
    const md = new MarkdownIt()
    const { data } = await getAtricleDetail(slug)
    const { article } = data
    article.body = md.render(article.body)
    // 防止重复关注作者和重复点赞
    article.author.followingDisabled = false
    article.favoriteDisabled = false
    return {
      article
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style></style>
