<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link
              v-if="user && user.username === profile.username" 
              class="btn btn-sm btn-outline-secondary action-btn" 
              :to="{
                name: 'settings'
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
             <button 
              v-else 
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: profile.following
              }"
              @click="clickFollow"
              :disabled="profile.followingDisabled"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? 'Unfollow ' : 'Follow ' }}{{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact 
                  class="nav-link" 
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'avorited_articles'
                  }" 
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'favorited_articles'
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
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
                  }
                }"
              >
                <img :src="article.author.image"/>
              </nuxt-link>
              <div class="info">
                <nuxt-link 
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }" 
                  class="author"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY')}}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                :disabled="article.favoriteDisabled"
                @click="clickFavorite(article)"
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
              <h1>
               {{ article.title }}
              </h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li 
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfile } from '@/api/author'
import { addFollowAuthor, deleteFollowAuthor } from "@/api/author";
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
export default {
  name: 'UserProfileIndex',
   watchQuery: ['tab'],
  async asyncData({ params, query }) {
    const tab = query.tab || 'my_articles'
    const [profileRes, articleRes] = await Promise.all([
      getProfile(params.username),
      getArticles({
        [tab === 'my_articles' ? 'author' : 'favorited']: params.username
      })
    ])
    const { profile } = profileRes.data
    const { articles } = articleRes.data
    // 防止重复点关注作者
    profile.followingDisabled = false
    // 防止重复点赞
    articles.forEach(item => {
      item.favoriteDisabled = false
    })
    return {
      profile,
      articles,
      tab
    }
  },
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 关注作者
    async clickFollow() {
      if (!this.user) {
        // 未登录
        return this.$router.push({
          name: "register",
        });
      }
      // 禁用点赞，防止重复点击
      this.profile.followingDisabled = true;
      if (this.profile.following) {
        // 添加关注
        await deleteFollowAuthor(this.profile.username);
        this.profile.following = false;
      } else {
        // 取消关注
        await addFollowAuthor(this.profile.username);
        this.profile.following = true;
      }
      // 取消禁用点赞
      this.profile.followingDisabled = false;
    },
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
