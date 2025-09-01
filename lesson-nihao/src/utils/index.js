import marked from 'marked'
import { COLOR_LIST } from '@/utils/config'
import xss from 'xss'
import { clear, get } from '@/utils/storage'

// 转化 md 语法为 html
export const translateMarkdown = (plainText, isGuardXss = false) => {
  return marked(isGuardXss ? xss(plainText) : plainText, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      /*eslint no-undef: "off"*/
      return hljs.highlightAuto(code).value
    }
  })
}

// 获取 url query 参数
export const decodeQuery = url => {
  const params = {}
  const paramsStr = url.replace(/\.*\?/, '') // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach(v => {
    const d = v.split('=')
    if (d[1] && d[0]) params[d[0]] = d[1]
  })
  return params
}

// 计算 评论数
export const calcCommentsCount = commentList => {
  let count = commentList.length
  commentList.forEach(item => {
    count += item.replies.length
  })
  return count
}

// 取数组中的随机数
export const randomIndex = arr => Math.floor(Math.random() * arr.length)

/**
 * 对数组进行分组
 * @param {Array} arr - 分组对象
 * @param {Function} f
 * @returns 数组分组后的新数组
 */
export const groupBy = (arr, f) => {
  const groups = {}
  arr.forEach(item => {
    const group = JSON.stringify(f(item))
    groups[group] = groups[group] || []
    groups[group].push(item)
  })
  return Object.keys(groups).map(group => groups[group])
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|http:)/.test(path)
}

// 获取 token
export function getToken() {
  let token = ''
  const userInfo = get('userInfo')

  if (userInfo && userInfo.token) {
    token = 'Bearer ' + userInfo.token
  }

  return token
}

/**
 * 生成随机 ID
 * @param {Number} len - 长度
 */
export function RandomId(len) {
  return Math.random()
    .toString(36)
    .substr(3, len)
}

/**
 * debounce
 */
export function debounce(func, wait) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}

export function throttle(fn, delay) {
  let prevTime = 0
  let timer
  return function(...args) {
    const now = Date.now()
    const remaining = delay - (now - prevTime);
    // 如果第二次执行超过delay了就立即执行
    // remaining > wait是为了处理修改了系统时间的情况
    // 比如把当前系统时间往过去调了十分钟，那么now其实是比prevTime小的
    // 那么remaning就可能是一个比较大的数了
    if (remaining > 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      fn.apply(this, args)
      prevTimer = now
    } else if (!timer) {
      // 这里就是为了处理1.5s停止触发的情况
      // 以1.5s为例，delay为1s，这个时候我们设置一个定时器
      // 让它在0.5s后执行
      // 这样在整个过程中，就是第0s, 第1s，第2s分别执行一次，共三次
      // 虽然我们是1.5s就停止触发了
      // 这样就保证了最后一次动作一直可以执行
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
        prevTime = Date.now()
      }, remaining)
    }
  }
}


// 生成 color
export function genertorColor(list = [], colorList = COLOR_LIST) {
  const _list = [...list]
  _list.forEach((l, i) => {
    l.color = colorList[i] || colorList[randomIndex(colorList)]
  })
  return _list
}

export const wait = async (time, func) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (func) {
        resolve()
      }
    }, time)
  })
}

export function getSkillPromise (value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, 3000)
  })
}
