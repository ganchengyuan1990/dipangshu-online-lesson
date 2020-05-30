import React, { useReducer, useState } from 'react'
import useMount from '@/hooks/useMount'
import { Button, Alert, Radio, Message } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import useFetchDetail from '@/hooks/useFetchDetail'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'

function Lesson(props) {
  let isBuyed = false
  useMount(() => {
    axios
      .get('https://www.coffeebeats.cn/getPinOrdersByOnlinelessonid', {
        params: {
          openid: userInfo ? JSON.parse(userInfo).openid : '',
          online_lesson_id: props.match.params.id,
        }
      })
      .then(response => {
        if (response.resultLists.length > 0) {
          isBuyed = true
          setTimeout(() => {
            var ele = document.querySelector('.app-main')
            if (!ele) {
              return
            }
            ele.scrollTop = ele.scrollHeight
          }, 200)
        } else {
          Message.error('您未购买该课程！')
          setTimeout(() => {
            window.history.back(-1)
          }, 2500)
        }
      })
  })
  const defaultRadio = 0
  const [radio, setRadio] = useState(defaultRadio)
  const [chosenFlag, setChosenFlag] = useState(false)
  const [classOver, setClassOver] = useState(false)
  const [processIndex, setProcessIndex] = useState(0)
  const [catIndex, setCatIndex] = useState(0)
  const [title, setTitle] = useState('')
  const userInfo = window.localStorage.getItem('onlineUser')

  const onChange = e => {
    console.log(e.target.value, processIndex, chosenFlag)
    setChosenFlag(true)
    setRadio(e.target.value)
  }

  try {
    const search = props.location.search
    const _array = search.split('?')
    const _value = _array[1]
    const _param = _value.split('=')[1]
    setCatIndex(_param)
  } catch (e) {
    console.log(e)
  }

  const { dataList } = useFetchDetail({
    withLoading: false,
    requestUrl: 'https://www.coffeebeats.cn/getOnlineLessonStepsById',
    queryParams: {
      id: props.match.params.id,
      catIndex: catIndex,
    }
  })

  const [dataListNo, setDataList] = useState(dataList)

  const onButtonClick = () => {
    // const targetList = JSON.parse(JSON.stringify(dataList))

    for (let i = 0; i < dataList.length - 1; i++) {
      if (!dataList[i].shown) {
        dataList[i].shown = true
        setProcessIndex(i)
        break
      } else if (dataList[i].shown && !dataList[i + 1].shown) {
        if (dataList[i].type === 4 && !chosenFlag) {
          // if (dataList[i + 1].type !== 4) {
          //   setChosenFlag(false)
          // }
          return
        } else {
          setChosenFlag(false)
          dataList[i + 1].shown = true
          setProcessIndex(i + 1)
        }
        break
      }
    }
    if (dataList[dataList.length - 1].shown && !classOver) {
      Message.success('课程结束！')
      setClassOver(true)
    }
    let initData = window.localStorage.getItem('historyData') || '[]'
    initData = JSON.parse(initData)
    if (initData.length === undefined) {
      initData = []
    }
    const historyData = {
      id: props.match.params.id,
      catIndex: catIndex,
      version: window.localStorage.getItem('currentLessonVersion') || '1',
      dataList: dataList,
      classOver: classOver,
    }
    const _targetIndex = initData.findIndex(item => item.id === props.match.params.id)
    if (_targetIndex >= 0) {
      initData[_targetIndex] = historyData
    } else {
      initData.push(historyData)
    }
    window.localStorage.setItem('historyData', JSON.stringify(initData))
    setDataList(dataList)
    setTitle(title + ' ')
    setTimeout(() => {
      var ele = document.querySelector('.app-main')
      ele.scrollTop = ele.scrollHeight
    }, 200)
  }
  // const [state, dispatch] = useReducer(reducer, { list: dataList })

  return (
    <div>
      {/* {(ipadScreen || iphoneScreen) && ANNOUNCEMENT.enable && (
        <Alert message={ANNOUNCEMENT.content} type='info' style={{ marginTop: iphoneScreen ? 20 : 0, marginBottom: ipadScreen ? 20 : 0 }} />
      )} */}
      {userInfo && userInfo.user_name && <div>欢迎{userInfo.user_name}登录</div>}
      {props.children}
      {/* {list && list.map((item, index) => (
        item.shown && <div key={index} className='show_words'>{item.name}</div>
      ))} */}
      {dataList && dataList.map((item, index) => (
        item.shown && (item.type === 1 ? <div key={index} className='show_words'>{item.value}</div>
          : item.type === 2 ? <img key={index} className='show_pics' src={item.value}></img>
            : item.type === 3 ? <video src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></video>
              : <div>
                <div className='radio-title'>{item.title}</div>
                <Radio.Group onChange={onChange} value={item.defualtValue} buttonStyle='solid'>
                  {item.value.split(',').map((ele, index) => <Radio.Button value={index + 1}>{ele}</Radio.Button>)
                  }
                </Radio.Group>
              </div>)
      ))}
      <div>
        {/* <Radio.Group onChange={onChange} value={radio} buttonStyle='solid'>
          <Radio.Button value={1}>木尺木尺木尺木尺木尺木尺木尺木尺木尺木尺木尺木尺木尺</Radio.Button>
          <Radio.Button value={2}>木尺木尺木尺</Radio.Button>
          <Radio.Button value={3}>木尺木尺木尺木尺木尺木尺木尺木尺木尺木尺</Radio.Button>
          <Radio.Button value={4}>木尺木尺木尺木尺木尺</Radio.Button>
        </Radio.Group> */}
      </div>
      {/* <div>{count}</div> */}
      <div type='primary' onClick={onButtonClick} className='button-bottom'>
        <img src='https://www.coffeebeats.cn/uploads/1585553433162-huiche2.png' />
      </div>
    </div>
  )
}

export default withRouter(Lesson)
