import { GITHUB } from '@/config'
import Layout from '@/layout/web'
import Home from '@/views/web/home'
import Article from '@/views/web/article'
import Archives from '@/views/web/archives'
import Categories from '@/views/web/categories'
import List from '@/views/web/tag'
import Lesson from '@/views/web/lesson'
import About from '@/views/web/about'
import Steps from '@/views/web/steps'
import Sections from '@/views/web/sections'

import lazy from '@/components/Lazy'
const PageNotFound = lazy(() => import('@/components/404'))
const GithubLogining = lazy(() => import('@/components/GithubLogining'))

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '/dipangshu-online', component: Categories },
    { path: '/dipangshu-online/article/:id', component: Article },
    { path: '/dipangshu-online/archives', component: Archives },
    { path: '/dipangshu-online/categories', component: Categories },
    { path: '/dipangshu-online/categories/:name', component: List },
    { path: '/dipangshu-online/tags/:name', component: List },
    { path: '/dipangshu-online/github', component: GITHUB.enable && GithubLogining },
    { path: '/dipangshu-online/login', component: About },
    { path: '/dipangshu-online/steps/:id', component: Steps },
    { path: '/dipangshu-online/sections/:id', component: Sections },
    { path: '/dipangshu-online/lesson/:id', component: Lesson },
    { path: '/dipangshu-online/*', component: Categories }
  ]
}
