<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab ==='your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                 <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab ==='global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                 <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab ==='tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag'
                    }
                  }"
                >
                  #{{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="clickFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li 
                class="page-item"
                :class="{ active: item === page}"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    }
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                }" 
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex"
export default {
  name: "HomeIndex",
  // 监听参数字符串更改并在更改时执行组件方法 asyncData 等
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData({ query, store }) {
    // 当前页码
    const page = Number(query.page || 1);
    // 当前每页显示的条数
    const limit = 20;
    const { tag } = query;
    const tab = query.tab || 'global_feed';
    const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles;
    // 并行异步任务
    const res = await Promise.all([
      // 获取文章列表(用户关注的文章列表或者公共文章列表)
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      // 获取文章标签列表
      getTags()
    ])
    const [articlesRes, tagsRes] = res;
    const { articles, articlesCount } = articlesRes.data;
    const { tags } = tagsRes.data;
    articles.forEach( article => {
      article.favoriteDisabled = false
    })
    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tag,
      tab
    };
  },
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async clickFavorite(article) {
      if (!this.user) {
        // 未登录
        return this.$router.push({
          name: 'register'
        })
      }
      // 禁用点赞，防止重复点击
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      // 取消禁用点赞
      article.favoriteDisabled = false
    }
  },
  created() {},
  mounted() {},
};
</script>
<style></style>
