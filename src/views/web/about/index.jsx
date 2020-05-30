import React, { Component, useEffect, useState } from 'react'
import './index.less'
import { Avatar } from 'antd'
import { QRCode } from 'react-qr-svg'

import { SIDEBAR, ABOUT } from '@/config'

import axios from '@/utils/axios'
import Discuss from '@/components/Discuss'

import { useMediaQuery } from 'react-responsive'
import { withRouter } from 'react-router-dom'

function About(props) {
  const iphoneScreen = useMediaQuery({ query: '(max-width: 576px)' })
  const [userInfo, setUserInfo] = useState('')

  const suijishu = Math.round(Math.random() * 100000000)
  const onlineTime = parseInt(suijishu)
  window.onlineTime = onlineTime
  const qrUrl = `setUserOnlineStatus?online=${onlineTime}`

  useEffect(() => {
    const userInfo = window.localStorage.getItem('onlineUser')
    if (userInfo) {
      props.history.push('/dipangshu-online/categories')
    }
    const onlineStatusInterval = setInterval(() => {
      axios
        .get('https://www.coffeebeats.cn/getUserOnlineStatus', { params: { online: window.onlineTime } })
        .then(response => {
          if (response.resultList.length > 0) {
            setUserInfo(response.resultList[0])
            console.log(response.resultList[0])
            window.localStorage.setItem('onlineUser', JSON.stringify(response.resultList[0]))
            clearInterval(onlineStatusInterval)
            setTimeout(() => {
              props.history.push('/dipangshu-online/categories')
            }, 150)
          }
        })
    }, 3000)
  }, [])

  return (
    <div className='hello'>
      <QRCode
        bgColor='#FFFFFF'
        fgColor='#000000'
        level='Q'
        style={{ width: 256 }}
        value={qrUrl}
      />
      <div className='loginText'>请使用“堤旁树”小程序扫码登陆</div>
    </div>
  )
}

export default withRouter(About)
