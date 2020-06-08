import React, { Component, useState } from 'react'
import './index.less'
import { useSelector } from 'react-redux'
import { Badge, Tag } from 'antd'
import { Link } from 'react-router-dom'
import useFetchList from '@/hooks/useFetchList'
import useMount from '@/hooks/useMount'

function Categories(props) {
  const [openid, setOpenId] = useState('')
  const userInfo = window.localStorage.getItem('onlineUser')
  useMount(() => {
    if (userInfo) {
      return
    }
    try {
      const search = props.location.search
      const _array = search.split('?')
      const _value = _array[1]
      const _param = _value.split('=')[1]
      console.log(_param, 666)
      // alert(_param)
      if (_param && _param.length > 10) {
        window.localStorage.setItem('openid', _param)
        window.localStorage.setItem('onlineUser', JSON.stringify({
          openid: _param
        }))
        setOpenId(_param)
      } else {
        // alert(_param, 'try')
        if (!userInfo || !window.localStorage.getItem('openid')) {
          // props.history.push('/dipangshu-online/login')
        }
      }
    } catch (e) {
      console.log(e)
      // alert(e, 'catch')
      if (window.localStorage.getItem('openid')) {
      } else {
        // props.history.push('/dipangshu-online/login')
      }
    }
  })
  const categoryList = useSelector(state => state.article.categoryList)

  const { loading, pagination, dataList } = useFetchList({
    requestUrl: 'https://www.coffeebeats.cn/getAllOnlineLessons',
    queryParams: {
      openid: userInfo ? JSON.parse(userInfo).openid : (openid || '')
    },
    fetchDependence: [props.location.search, props.location.pathname]
  })

  const onClick = e => {
    // const id = e.target.getAttribute('data-id')
    const title = e.target.getAttribute('data-title')
    console.log(title, 999)
    props.history.push(`/dipangshu-online/steps/${title}`)
    window.localStorage.setItem('currentLessonVersion', e.target.getAttribute('data-version'))
  }

  return (
    <div className='app-categories'>
      {/* <h2 className='title'>Categories</h2> */}
      <p className='category-all-title'>{`线上共有${dataList.length}门课程`}</p>

      <div className='categories-list'>
        {dataList.map((item, i) => (
          <div count={item.count} className='lesson_item' key={item.id} data-id={item.id} data-title={item.lesson_title} data-version={item.version} onClick={ onClick }>
            <span data-id={item.id} data-title={item.lesson_title}>{item.lesson_title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories

// function ProfilePage(props) {
//   const showMessage = () => {
//     alert('Followed ' + props.user)
//   }

//   const handleClick = () => {
//     setTimeout(showMessage, 3000)
//   }

//   return (
//     <button onClick={handleClick}>Follow</button>
//   )
// }

// export default ProfilePage

// class ProfilePage extends React.Component {
//   showMessage() {
//     alert('Followed ' + this.props.user)
//   }

//   handleClick() {
//     setTimeout(this.showMessage.bind(this), 3000)
//   }

//   render() {
//     return <button onClick={this.handleClick.bind(this)}>Follow</button>
//   }
// }

// export default ProfilePage
