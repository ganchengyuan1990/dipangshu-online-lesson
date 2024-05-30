/*eslint-disable*/
import React, { Component, useState } from 'react'
import './index.less'
import { useSelector } from 'react-redux'
import { Badge, Tag } from 'antd'
import { Modal, Toast } from 'antd-mobile';
import 'antd-mobile/lib/modal/style/css';
import 'antd-mobile/lib/toast/style/css';
import axios from '@/utils/axios'

// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import useFetchList from '@/hooks/useFetchList'
import useMount from '@/hooks/useMount'
import 'ant-design-pro/dist/ant-design-pro.css'
// import Login from '@/components/Login'


function Categories(props) {
  const [wecharUser, setWechatUser] = useState('')
  const [userLoginStatus, setUserLoginStatus] = useState(false)
  const [openid, setOpenId] = useState('')
  const [aiImg, aiImgSetter] = useState('')

  const [dataList, setDataList] = useState([])
  const userInfo = window.localStorage.getItem('onlineUser')

  const getUserLessonInfo = () => {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));

    // axios
    //     .post('https://www.coffeebeats.cn/tencent/wordToImg', {
    //         "prompt": "木工课桌，有细节",
    //         "Styles": [
    //             "101"
    //         ]
    //     }).then(res => {
    //         console.log(res, '===res==')
    //         aiImgSetter(`data:image/png;base64,${res.data.ResultImage}`)
    //       })
    axios
          .get('https://www.coffeebeats.cn/getAllOnlineLessonsV2?openid=${userInfo.id}')
          .then(response => {
            axios
              .post('https://www.coffeebeats.cn/getOnlineUserInfoById', {
                id: userInfo.id,
              })
              .then(res => {
                const lessonInfo = JSON.parse(res.resultList[0].lessonInfo || '[]');
                let lessonList;
                if (!lessonInfo.length) {
                  lessonList = [];
                }
                const filterLessonInfo = (lessonInfo, info) => {
                  const tt = lessonInfo.find(e => e.id === info.id);
                  return tt && tt.on;
                }
                lessonList = response.result.filter(ele => filterLessonInfo(lessonInfo, ele))
                setDataList(lessonList);
                // console.log(lessonList, 9999)
              })
          })
  }
  useMount(() => {
    // if (userInfo) {
    //   setWechatUser(true)
    //   return
    // }
    setUserLoginStatus(Boolean(window.localStorage.getItem('newLogined')))
    if (!window.sessionStorage.getItem('userInfo') && location.href.indexOf('express') < 0) {
      Modal.prompt(
        '登录',
        '请输入您的账号和密码',
        (login, password) => {
          if (!login || !password) {
            return
          }
          console.log(`login: ${login}, password: ${password}`)
          axios
            .post('https://www.coffeebeats.cn/onlineUserLoginV2', {
              user_name: login.split('#')?.[0],
              password: password,
            })
            .then(response => {
              if (response.code === 406) {
                Toast.fail('账号已过期，续期请联系工作人员', 1);
                return
              }
              if (response.resultList && response.resultList.length > 0) {
                setWechatUser(false);
                window.localStorage.setItem('wechatUser', true);
                window.localStorage.setItem('newLogined', true);
                window.sessionStorage.setItem('userInfo', JSON.stringify({
                  userName: login,
                  paikePower: login.indexOf('#admin'),
                  id: response.resultList[0].id
                }))
                location.reload();
              } else {
                Toast.fail('登录失败', 1);
              }
            })
        },
        'login-password',
        null,
        ['请输入账号', '请输入密码'],
      )
      return
    } else {
      getUserLessonInfo()
    }

    try {
      const search = props.location.search
      const _array = search.split('?')
      const _value = _array[1]
      let _param = _value.split('=')[1]
      _param = _param.split('&')[0]
      console.log(_param, 666)
      // alert(_param)
      if (_param && _param.length > 5) {
        window.localStorage.setItem('openid', _param)
        window.localStorage.setItem('onlineUser', JSON.stringify({
          openid: _param
        }))
        setOpenId(_param)
      } else {
        // alert(_param, 'try')
        if (_param === 'wechat') {
          setWechatUser(window.localStorage.getItem('wechatUser') ? '' : _param)
          return
        }
        // if (!userInfo || !window.localStorage.getItem('openid')) {
        //   props.history.push('/login')
        // }
      }
    } catch (e) {
      console.log(e)
      // alert(e, 'catch')
      if (window.localStorage.getItem('openid')) {
      } else {
        // props.history.push('/login')
      }
    }
  })
  const categoryList = useSelector(state => state.article.categoryList)

  // const { loading, pagination, dataList } = useFetchList({
  //   requestUrl: 'https://www.coffeebeats.cn/getAllOnlineLessonsV2',
  //   queryParams: {
  //     openid: userInfo ? JSON.parse(userInfo).openid : (openid || '')
  //   },
  //   fetchDependence: [props.location.search, props.location.pathname]
  // })

  const onLoginOk = (e) => {
    console.log('onLoginOk')
  }

  const onClick = e => {
    // const id = e.target.getAttribute('data-id')
    const title = e.target.getAttribute('data-title')
    const _version = e.target.getAttribute('data-version')
    console.log(title, 999)
    props.history.push(`/steps/${title}`)
    window.localStorage.setItem('currentLessonVersion', e.target.getAttribute('data-version'))
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'zh-CN';

  return (
    <>
      {
        userLoginStatus ? <div className='app-categories'>
          {/* <Login visible={true} onLoginOk={onLoginOk}></Login> */}
          {/* <h2 className='title'>Categories</h2> */}
          <p className='category-all-title' onClick={() => {
            recognition.onresult = function(event) {
              const text = event.results[0][0].transcript;
              console.log(`你说的是：${text}`);
            };
            // recognition.onerror =function(event) {
            //   debugger
            // }
            recognition.start();
          }}>{`线上共有${dataList.length}门课程`}</p>

          <img src={aiImg} />

          <div className='categories-list'>
            {dataList.map((item, i) => (
              <div count={item.count} className='lesson_item' key={item.id} data-id={item.id} data-title={item.lesson_title} data-version={item.version} onClick={onClick}>
                {/* <span data-id={item.id} data-title={item.lesson_title}>{item.lesson_title}</span> */}
                <img data-title={item.lesson_title} src={item.img} onClick={() => {
                  recognition.stop();
                }}></img>
              </div>
            ))}
          </div>
        </div> : <></>
      }

    </>
  )
}

export default Categories

