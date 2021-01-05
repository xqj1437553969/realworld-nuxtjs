import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4a582f39 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _2b39e0ae = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _3c3a7d7a = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _1e90510c = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _90f9af1c = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _3e89557c = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _50fbca72 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _4a582f39,
    children: [{
      path: "",
      component: _2b39e0ae,
      name: "home"
    }, {
      path: "/login",
      component: _3c3a7d7a,
      name: "login"
    }, {
      path: "/register",
      component: _3c3a7d7a,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _1e90510c,
      name: "profile"
    }, {
      path: "/settings",
      component: _90f9af1c,
      name: "settings"
    }, {
      path: "/editor/:slug?",
      component: _3e89557c,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _50fbca72,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
