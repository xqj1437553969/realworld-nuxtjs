<template>
  <div>
    <form class="card comment-form" v-if="user" @submit.prevent="clickAddComment">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="formComment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img 
          :src="user.image" 
          class="comment-author-img" 
        />
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
    <div 
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" 
          class="comment-author"
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" 
          class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY')}}</span>
        <span class="mod-options" v-if="user && user.username === comment.author.username">
          <!-- <i class="ion-edit"></i> -->
          <i class="ion-trash-a" @click="clickDeleteComment(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAtricleCommnents, addAtricleComment, deleteAtricleComment } from '@/api/article'
export default {
  name: 'ArticleComments',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      formComment: ''
    };
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 发表文章评论
    async clickAddComment() {
      const { data } =  await addAtricleComment(this.article.slug, {
        comment: {
          body: this.formComment
        }
      })
      if (data.comment) {
        this.comments.unshift(data.comment)
        this.formComment = ''
      }
    },
    // 删除文章评论
    async clickDeleteComment(comment) {
      const { data } =  await deleteAtricleComment(this.article.slug, comment.id)
      this.comments.some((item, index) => {
        if (comment.id === item.id) {
          this.comments.splice(index, 1)
          return true
        }
      })
    }
  },
  created() {},
  async mounted() {
    const { data } = await getAtricleCommnents(this.article.slug)
    this.comments = data.comments
  },
};
</script>
<style></style>
