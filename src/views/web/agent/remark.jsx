/*eslint-disable*/

import React, { useReducer, useState } from 'react'
import useMount from '@/hooks/useMount'
import { Button, Radio, Message, Icon } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import useFetchLesson from '@/hooks/useFetchLesson'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import { LogoutOutlined } from "@ant-design/icons";
import CommentBox from './components/CommentBox';

import { Modal, Toast } from 'antd-mobile';
import 'antd-mobile/lib/modal/style/css';
import 'antd-mobile/lib/toast/style/css';

function Remark(props) {
  // let isBuyed = false
  useMount(() => {

    axios.get(`https://www.coffeebeats.cn/getOnlineLessonV2ById?id=${props.match.params.id}`).then(res => {
      const line = res.result.content[window.location.href.split('=')[1]].content[props.match.params?.remarkId];

      window.sessionStorage.setItem('currentContentLine', JSON.stringify(line))

      setQuestionList(line.questions || []);
      window.sessionStorage.setItem('currentLessonData', JSON.stringify(res?.result?.content))
    })

  })
  const defaultRadio = 0
  const [questionList, setQuestionList] = useState([])
  const [chosenFlag, setChosenFlag] = useState(false)
  const [classOver, setClassOver] = useState(false)
  const [processIndex, setProcessIndex] = useState(0)
  const [catIndex, setCatIndex] = useState(0)
  const [title, setTitle] = useState('')
  const userInfo = window.localStorage.getItem('onlineUser')



  const [dataListNo, setDataList] = useState([])


  //添加留言
  const addComment = (comment) => {
    // setQuestionList(comment.questions)
    window.location.reload();
  }


  const onButtonClick = () => {
    // const targetList = JSON.parse(JSON.stringify(dataList))
  }
  // const [state, dispatch] = useReducer(reducer, { list: dataList })

  return (
    <CommentBox
      commentsLength={1}
      questionList={questionList}
      id={props.match.params.id}
      index={props.match.params?.remarkId}
      onAddComment={addComment}
    />
  )
}

export default withRouter(Remark)
