<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="clickUpdateUser">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </fieldset>
              <button 
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="submitDisabled"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="clickLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from "@/api/user";
const Cookie =  require('js-cookie');
export default {
  name: "SettingsIndex",
  middleware: 'authenticated',
  components: {},
  props: {},
  data() {
    return {
      user: {
        image: '',
        username: '',
        bio: '',
        email: '',
      },
      // 防止重复点击
      submitDisabled: false,
      // 错误信息
      errors: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 退出登录
    clickLogout() {
      // 清空vuex中存储的用户信息
      this.$store.commit('setUser', null)
      // 删除cookie中存储的用户信息
      Cookie.remove('user')
      this.$router.push({
        name: 'home'
      })
    },
    // 更新用户信息
    async clickUpdateUser() {
      this.submitDisabled = true
      if (this.password) {
        this.user.password = this.password
      }
      try {
        const { data } = await updateUser({
          user: this.user
        })
        // 更新vuex中的用户信息
        this.$store.commit('setUser', data.user)
        // 更新Cookie中的用户信息
        Cookie.set('user', data.user)
        this.$router.push({
          name: 'profile',
          params: {
            username: data.user.username
          }
        })
      } catch(err) {
        this.errors = err.response.data.errors;
      }
      this.submitDisabled = false
    }
  },
  created() {},
  async mounted() {
    const { data } = await getUser()
    const { image, username, bio, email } = data.user
    this.user.image = image
    this.user.username = username
    this.user.bio = bio
    this.user.email = email
    this.user.submitDisabled = false
  },
};
</script>
<style></style>
