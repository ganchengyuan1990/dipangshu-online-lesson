import { GITHUB } from '@/config'
import Layout from '@/layout/web'
import Home from '@/views/web/home'
import Article from '@/views/web/article'
import Archives from '@/views/web/archives'
import Categories from '@/views/web/categories'
import List from '@/views/web/tag'
import Lesson from '@/views/web/lesson'
import Agent from '@/views/web/agent'
import AgentV2 from '@/views/web/agent/indexV2'
import Remark from '@/views/web/lesson/remark'

import About from '@/views/web/about'
import Steps from '@/views/web/steps'
import Express from '@/views/web/express'

import Sections from '@/views/web/sections'

import Command from '@/views/web/command'
import TextToImage from '@/views/web/textToImage/index'
import WorkTable from '@/views/web/workTable/index'
import AiDiagole from '@/views/web/aiDiagole/index'

import Exam from '@/views/web/exams'
import lazy from '@/components/Lazy'
const PageNotFound = lazy(() => import('@/components/404'))
const GithubLogining = lazy(() => import('@/components/GithubLogining'))

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    // { path: '', component: Categories },
    // { path: '/article/:id', component: Article },
    // { path: '/archives', component: Archives },
    // { path: '/categories', component: Categories },
    // { path: '/categories/:name', component: List },
    // { path: '/tags/:name', component: List },
    // { path: '/github', component: GITHUB.enable && GithubLogining },
    // { path: '/login', component: About },
    // { path: '/steps/:id', component: Steps },
    // { path: '/sections/:id', component: Sections },
    // { path: '/lesson/:id', component: Lesson },
    // { path: '/lesson/:id/remark/:remarkId', component: Remark },
    // { path: '/*', component: Categories }
    // { path: '', component: Categories },
    { path: '/article/:id', component: Article },
    { path: '/archives', component: Archives },
    { path: '/categories', component: Categories },
    { path: '/categories/:name', component: List },
    { path: '/tags/:name', component: List },
    { path: '/login', component: About },
    { path: '/steps/:id', component: Steps },
    { path: '/express/:id', component: Express },
    { path: '/sections/:id', component: Sections },
    { path: '/lesson/:id', component: Lesson },
    { path: '/agent/:id', component: Agent },
    { path: '/agentV2/:id', component: AgentV2 },
    { path: '/command/:id', component: Command },
    { path: '/exam/:id', component: Exam },
    { path: '/textToImage', component: TextToImage },
    { path: '/workTable', component: WorkTable },
    { path: '/aiDiagole', component: AiDiagole },
    { path: '/lesson/:id/remark/:remarkId', component: Remark },
    { path: '/*', component: Categories }
  ]
}
