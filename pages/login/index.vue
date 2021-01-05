<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLogin"
              >Need an account?</nuxt-link
            >
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="clickSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="user.username"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.password"
                type="password"
                placeholder="Password"
                required
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: "LoginIndex",
  middleware: 'notAuthenticated',
  components: {},
  props: {},
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  watch: {},
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  methods: {
    async clickSubmit() {
      try {
        console.log(this.user);
        const { data } = this.isLogin
        ? await login({
          user: this.user,
        })
        : await register({
          user: this.user,
        })
        console.log(data)
        // 存储用户的登录信息到容器（vuex）
        this.$store.commit('setUser', data.user)
        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set('user', data.user)
        // 跳转至首页
        this.$router.push({
          name: 'home',
          query: {
            tab: 'your_feed'
          }
        });
      } catch (err) {
        console.dir(err);
        this.errors = err.response.data.errors;
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style></style>
