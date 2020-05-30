import React, { useReducer, useState } from 'react'
import useMount from '@/hooks/useMount'
import { Button, Alert, Radio, Message } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import { useMediaQuery } from 'react-responsive'
import useFetchDetail from '@/hooks/useFetchDetail'
import axios from '@/utils/axios'

const reducer = function (state, action, value) {
  switch (action.type) {
    case 'nextTap':
      for (let i = 0; i < state.list.length - 1; i++) {
        if (!state.list[i].shown) {
          state.list[i].shown = true
          break
        } else if (state.list[i].shown && !state.list[i + 1].shown) {
          state.list[i + 1].shown = true
          break
        }
      }
      return { list: state.list }
    case 'chooseRadio':
      return { chooseRadio: state.chooseRadio }
    default:
      return { count: state.count }
  }
}
function AppMain(props) {
  useMount(() => {
    // const onlineStatusInterval = setInterval(() => {
    //   console.log(radio, 888)
    //   axios
    //     .get('https://www.coffeebeats.cn/getUserOnlineStatus', { params: { online: window.onlineTime } })
    //     .then(response => {
    //       console.log(response, 555)
    //       if (response.resultList.length > 0) {
    //         setUserInfo(response.resultList[0])
    //         clearInterval(onlineStatusInterval)
    //       }
    //     })
    // }, 3000)
  })
  const iphoneScreen = useMediaQuery({
    query: '(max-width: 576px)'
  })

  const ipadScreen = useMediaQuery({
    query: '(min-width: 576px) and (max-width: 992px)'
  })

  // const defaultRadio = 0
  // const [radio, setRadio] = useState(defaultRadio)
  // const [chosenFlag, setChosenFlag] = useState(false)
  // const [classOver, setClassOver] = useState(false)
  // const [processIndex, setProcessIndex] = useState(0)
  // const [title, setTitle] = useState('')
  // const [userInfo, setUserInfo] = useState('')

  // const onChange = e => {
  //   console.log(e.target.value, processIndex, chosenFlag)
  //   setChosenFlag(true)
  //   setRadio(e.target.value)
  // }

  // const { dataList } = useFetchDetail({
  //   withLoading: false,
  //   requestUrl: 'https://www.coffeebeats.cn/getOnlineLessonById',
  //   queryParams: {
  //     id: 1
  //   }
  // })
  // const [dataListNo, setDataList] = useState(dataList)

  // const onButtonClick = () => {
  //   // const targetList = JSON.parse(JSON.stringify(dataList))

  //   for (let i = 0; i < dataList.length - 1; i++) {
  //     if (!dataList[i].shown) {
  //       dataList[i].shown = true
  //       setProcessIndex(i)
  //       break
  //     } else if (dataList[i].shown && !dataList[i + 1].shown) {
  //       if (dataList[i].type === 4 && !chosenFlag) {
  //         // if (dataList[i + 1].type !== 4) {
  //         //   setChosenFlag(false)
  //         // }
  //         return
  //       } else {
  //         setChosenFlag(false)
  //         dataList[i + 1].shown = true
  //         setProcessIndex(i + 1)
  //       }
  //       break
  //     }
  //   }
  //   if (dataList[dataList.length - 1].shown && !classOver) {
  //     Message.success('课程结束！')
  //     setClassOver(true)
  //   }
  //   window.localStorage.setItem('historyData', JSON.stringify(dataList))
  //   setDataList(dataList)
  //   setTitle(title + ' ')
  //   setTimeout(() => {
  //     var ele = document.querySelector('.app-main')
  //     ele.scrollTop = ele.scrollHeight
  //   }, 200)
  // }
  // const [state, dispatch] = useReducer(reducer, { list: dataList })

  return (
    <div className='app-main'>
      {/* {(ipadScreen || iphoneScreen) && ANNOUNCEMENT.enable && (
        <Alert message={ANNOUNCEMENT.content} type='info' style={{ marginTop: iphoneScreen ? 20 : 0, marginBottom: ipadScreen ? 20 : 0 }} />
      )} */}
      {props.children}
      {/* {list && list.map((item, index) => (
        item.shown && <div key={index} className='show_words'>{item.name}</div>
      ))} */}
    </div>
  )
}

export default AppMain

// onClick = {() => dispatch({ type: 'nextTap' })
