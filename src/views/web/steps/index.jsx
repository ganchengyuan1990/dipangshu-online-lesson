import React, { useReducer, useState } from 'react'
import useMount from '@/hooks/useMount'
import { Button, Steps, Modal, Message, Tree } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import useFetchDetail from '@/hooks/useFetchDetail'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import './index.less'

const { Step } = Steps
const { TreeNode } = Tree

function Lesson(props) {
  let isBuyed = false
  useMount(() => {
    axios
      .get('https://www.coffeebeats.cn/getPinOrdersByOnlinelessonid', {
        params: {
          openid: userInfo ? JSON.parse(userInfo).openid : '',
          online_lesson_id: props.match.params.id
        }
      })
      .then(response => {
        if (response.resultLists.length > 0) {
          isBuyed = true
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
  const [title, setTitle] = useState('')
  const userInfo = window.localStorage.getItem('onlineUser')

  const onChange = e => {
    console.log(e.target.value, processIndex, chosenFlag)
    setChosenFlag(true)
    setRadio(e.target.value)
  }
  const { dataList } = useFetchDetail({
    withLoading: false,
    requestUrl: 'https://www.coffeebeats.cn/getOnlineLessonTitleByName',
    queryParams: {
      name: props.match.params.id
    }
  })

  // console.log(dataList, 777)

  const historyData = window.localStorage.getItem('historyData')
  const realLessonData = JSON.parse(historyData || '{}')

  const [current, setCurrent] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [showModal, setShowModal] = useState(false)

  try {
    const item = realLessonData.find(item => item.id === props.match.params.id)
    setCurrent(item.classOver ? parseInt(item.catIndex + 1) : parseInt(item.catIndex))
  } catch (e) {
    // setCurrent(dataList.length)
    console.log(e)
  }

  const onButtonClick = (item, index) => {
    if (true) {
      props.history.push(`/dipangshu-online/lesson/${item.id}?cat=${index}`)
      // props.history.push(`/dipangshu-online/sections/${item.id}?cat=${item.id}`)
      // debugger
      // window.localStorage.setItem('sectionContent', JSON.stringify(item[index].content))
    } else {
      setShowModal(true)
      setCurrentIndex(item)
    }
  }

  const handleOk = e => {
    console.log(e)
    setShowModal(false)
    props.history.push(`/dipangshu-online/lesson/${props.match.params.id}?cat=${currentIndex}`)
  }

  const handleCancel = e => {
    console.log(e)
    setShowModal(false)
  }

  return (
    <div className='steps_wrapper'>
      {/* <Steps direction='vertical' current={current}>
        {dataList && dataList.map((item, index) => (
          <Step title={item.lesson_name} data-index={index} onClick={onButtonClick.bind(this, item, index)}/>
        ))}
      </Steps> */}
      {dataList && dataList.map((item, index) => (
        <div title={item.lesson_name} key={index} className='tree-parent'>
          {item.lesson_name}
          {item.content && item.content.map((ele, idx) => (
            <div title={ele.name} key={index + '-' + idx} data-index={index} onClick={onButtonClick.bind(this, item, idx)} className='tree-node'>
              {ele.name}
            </div>
          ))}
        </div>
      ))}
      {/* <Tree
        showLine
        defaultExpandAll={true}
        defaultExpandedKeys={['0-0-0']}
      >
        {dataList && dataList.map((item, index) => (
          <TreeNode title={item.lesson_name} key={index} data-index={index} onClick={onButtonClick.bind(this, item, index)}>
            {item.content && item.content.map((ele, idx) => (
              <TreeNode title={ele.name} key={index + '-' + idx}>
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </Tree> */}
      <Modal
        title='进度提示'
        visible={showModal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>您还未学到此章节，确定要开始学习吗？</p>
      </Modal>
    </div>
  )
}

export default withRouter(Lesson)
