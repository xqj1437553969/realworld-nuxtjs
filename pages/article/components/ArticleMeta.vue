<template>
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
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <!-- 编辑文章和删除文章按钮 -->
    <!-- 登录状态下，并且当前的文章作者是登录者，显示编辑文章和删除文章按钮 -->
    <template v-if="user && user.username === article.author.username">
      <span>
        <nuxt-link
          class="btn btn-outline-secondary btn-sm" 
          :to="{
            name: 'editor',
            params: {
              slug: article.slug
            }
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>
        <button class="btn btn-outline-danger btn-sm" @click="clickDeleteArticle">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
    <!-- /编辑文章和删除文章按钮 -->
    <!-- 关注作者和点赞文章 -->
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="article.author.followingDisabled"
        @click="clickFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "Unfollow " : "Follow "
        }}{{ article.author.username }}
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        :disabled="article.favoriteDisabled"
        @click="clickFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; {{ article.favorited ? "Unfavorite" : "Favorite" }} Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <!-- /关注作者和点赞文章 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addFavorite, deleteFavorite, deleteArticle} from "@/api/article";
import { addFollowAuthor, deleteFollowAuthor } from "@/api/author";
export default {
  name: "ArtivleMeta",
  components: {},
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState(["user"]),
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
      this.article.author.followingDisabled = true;
      if (this.article.author.following) {
        // 添加关注
        await deleteFollowAuthor(this.article.author.username);
        this.article.author.following = false;
      } else {
        // 取消关注
        await addFollowAuthor(this.article.author.username);
        this.article.author.following = true;
      }
      // 取消禁用点赞
      this.article.author.followingDisabled = false;
    },
    // 点赞文章
    async clickFavorite() {
      if (!this.user) {
        // 未登录
        return this.$router.push({
          name: "register",
        });
      }
      // 禁用点赞，防止重复点击
      this.article.favoriteDisabled = true;
      if (this.article.favorited) {
        // 取消点赞
        await deleteFavorite(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(this.article.slug);
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
      // 取消禁用点赞
      this.article.favoriteDisabled = false;
    },
    // 删除文章
    async clickDeleteArticle() {
      await deleteArticle(this.article.slug)
      // 跳转至首页--个人文章列表
      this.$router.push({
        name: 'home',
        query: {
          tab: 'your_feed'
        }
      })
    }
  },
  created() {},
  mounted() {
    console.log(this.article);
  },
};
</script>
<style></style>
