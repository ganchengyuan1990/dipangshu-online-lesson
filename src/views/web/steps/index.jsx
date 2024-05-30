/*eslint-disable*/

import React, { useReducer, useState } from 'react'
import useMount from '@/hooks/useMount'
import { Table, Progress, Switch, Select, Input } from 'antd'

import { Button, Steps, Modal, Message, Tree } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import useFetchDetail from '@/hooks/useFetchDetail'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import './index.less'

const { Step } = Steps
const { TreeNode } = Tree

const axisPromise = (url, params) => {
  return new Promise((resolve => {
    axios
      .get(url, {
        params
      }).then(res => {
        resolve(res)
      })
  }))
}

const paikeLevels = ["L1", "L2", "L3"];


function Lesson(props) {
  let isBuyed = false

  let userName = ''

  const [ownPaikeInfo, setOwnPaikeInfo] = useState(null)
  const [userId, setUserId] = useState(null)



  useMount(() => {
    // const wechatUser = window.localStorage.getItem('wechatUser')
    // if (wechatUser) {
    //   return
    // }
    let name = userInfo ? JSON.parse(userInfo).openid : ''
    if (name === 'wechat') {
      name = ''
    }
    console.log(name, 9996)
    axios
      .get('https://www.coffeebeats.cn/getOnlineLessonTitleV2ByName', {
        params: {
          openid: name,
          lesson_title: props.match.params.id
        }
      })
      .then(response => {
        if (response.result.length > 0) {
          isBuyed = true
        } else {
          // Message.error('您未购买该课程！')
          // setTimeout(() => {
          //   window.history.back(-1)
          // }, 2500)
        }
      })

    if (window.sessionStorage.getItem('userInfo')) {
      const aa = JSON.parse(window.sessionStorage.getItem('userInfo'))
      paikePower = aa.paikePower
      userName = aa.userName;

      setUserId(aa.id);

      axios
        .get('https://www.coffeebeats.cn/getOnlineLessonV2OrdersByUserId', {
          params: {
            user_id: aa.id,
            lesson_id: props.match.params.id
          }
        })
        .then(response => {
          let contentIns
          if (response.result) {
            contentIns = JSON.parse(response.result.content)
            setOwnPaikeInfo(contentIns)

          } else {
            // Message.error('您未购买该课程！')
            // setTimeout(() => {
            //   window.history.back(-1)
            // }, 2500)
          }

          axios
            .get('https://www.coffeebeats.cn/getOnlineLessonTitleV2ByName', {
              params: {
                name: props.match.params.id
              }
            })
            .then(async (response) => {
              console.log(response.result, '===response.result===')
              const ggg = await Promise.all(response.result.map(async (ele) => {
                const sss = await axisPromise('https://www.coffeebeats.cn/getExamByLessonId', {
                  lesson_id: ele.id
                })
                console.log(sss, 'sss');
                return sss.result
              }))
              console.log(ggg, '===ggg===');
              
              const resultsArr = response.result

              let res = resultsArr;

              console.log(res, contentIns, '===res===77');

              // if (contentIns) {
              //   res = contentIns.map(ele => {
              //     const targetItem = resultsArr.find(m => m.id === ele.id);
              //     console.log(targetItem, 999966)
              //     if (targetItem) {
              //       return {
              //         ...targetItem,
              //         lesson_index: ele.lesson_index,
              //       }
              //     } else {
              //       return {
              //         ...ele,
              //         type: 'gapLine'
              //       }
              //     }
                  
              //   })
              // }

              if (contentIns) {
                const gapLineItems = contentIns.map(item => {
                  if (item.text) {
                    return {
                      ...item,
                      type: 'gapLine'
                    }
                  }
                  return item
                }).filter(x => !!x.text);
                console.log(gapLineItems, '===res===');

                res = resultsArr.concat(gapLineItems).map(ele => {
                  const targetItem = contentIns.find(m => {
                    return m.id ? m.id === ele.id : null
                  });
                  
                  if (targetItem) {
                    return {
                      ...ele,
                      lesson_index: targetItem.lesson_index,
                    }
                  } else {
                    return {
                      ...ele,
                      lesson_index:  ele.content ? resultsArr.length + 1 : ele.lesson_index,
                      // type: 'gapLine'
                    }
                  }
                  
                })
              }

              console.log(res, '===res===');

      
              setDataList(res.sort((a, b) => a.lesson_index - b.lesson_index).map((ee, idx) => {
                return {
                  ...ee,
                  exams: ggg[idx]
                }
              }))
      
      
            })
        })
    };

    

  }, [userName])
  const defaultRadio = 0
  const [radio, setRadio] = useState(defaultRadio)
  let paikePower = null
  if (window.sessionStorage.getItem('userInfo')) {
    const aa = JSON.parse(window.sessionStorage.getItem('userInfo'))
    paikePower = aa.paikePower
    userName = aa.userName;
  };
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
  // const { dataList } = useFetchDetail({
  //   withLoading: false,
  //   requestUrl: 'https://www.coffeebeats.cn/getOnlineLessonTitleV2ByName',
  //   queryParams: {
  //     name: props.match.params.id
  //   }
  // })


  const [dataList, setDataList] = useState([])

  console.log(dataList, 777)



  const historyData = window.localStorage.getItem('historyData')
  const realLessonData = JSON.parse(historyData || '[]')

  const [current, setCurrent] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [showModal, setShowModal] = useState(false)

  // try {
  //   const item = realLessonData.find(item => item.id === props.match.params.id)
  //   setCurrent(item && item.classOver ? parseInt(item && item.catIndex + 1 || 1) : parseInt(item && item.catIndex || 1))
  // } catch (e) {
  //   // setCurrent(dataList.length)
  //   console.log(e)
  // }

  const onButtonClick = (item, index) => {
    if (true) {
      props.history.push(`/lesson/${item.id}?cat=${index}`)
      // props.history.push(`/sections/${item.id}?cat=${item.id}`)
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
    props.history.push(`/lesson/${props.match.params.id}?cat=${currentIndex}`)
  }

  const handleCancel = e => {
    console.log(e)
    setShowModal(false)
  }

  console.log(dataList, '===datalist====')

  const columns = [
    {
      title: '课程/分隔内容',
      dataIndex: 'lesson_title',
      key: 'lesson_title',
      render: (text, record, index) => {
        console.log(record, 9999)
        return    record.type === 'gapLine' ? <Input
            placeholder='请输入分隔内容'
            className='title-input'
            name='title'
            value={record.text}
            onChange={e => {
              const newData = JSON.parse(JSON.stringify(dataList));
              newData[index].text = e.target.value
              setDataList(newData)
              // record.text = e.target.value
              // console.log(e.target.value, 999)
            }}
          /> : <span>{record.lesson_title}</span>
      }
    },
    {
      title: '章节',
      dataIndex: 'lesson_name',
      key: 'lesson_name',
      render: (text, record, index) => {
        return (<span className="go_text" onClick={() => {
          props.history.push(`/lesson/${record.id}?cat=${0}`)
        }}>{text}</span>)
      }
    },
    {
      title: '等级',
      dataIndex: 'paike_level',
      key: 'paike_level',
      render: (text, record, index) => {
        console.log(record, '===record===')
        if (record.type === 'gapLine') {
          return null
        }
        return (
          <Select disabled={true} style={{ width: 200 }} allowClear value={record.paike_level} onChange={(value) => {
            const newData = JSON.parse(JSON.stringify(dataList));
            newData[index].paike_level = value;
            setDataList(newData)
          }}>
            {paikeLevels.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        )
      },
      onCell: (record, rowIndex) => {
        console.log(record, 98765)
      }
    },

    {
      title: '操作',
      dataIndex: 'model',
      key: 'model',
      render: (text, record, index) => {
        return <div>
          <Button onClick={() => {
            // e.preventDefault()
            const newData = JSON.parse(JSON.stringify(dataList))
            const a = newData.splice(
              index,
              1,
              ...newData.splice(index - 1, 1, newData[index])
            )
            console.log(newData, '====a====')
            setDataList(newData)
          }} style={{ marginRight: 8 }}>
            上移一行
          </Button>
          <Button onClick={() => {
            const newData = JSON.parse(JSON.stringify(dataList))
            const a = newData.splice(
              index,
              1,
              ...newData.splice(index + 1, 1, newData[index])
            )
            setDataList(newData)
          }} style={{ marginRight: 8 }}>
            下移一行
          </Button>
          <Button onClick={() => {
            const newData = JSON.parse(JSON.stringify(dataList))
            const a = newData.splice(
              index,
              0,
              {
                type: "gapLine",
                idx: index
              }
            )
            setDataList(newData)
          }} style={{ marginRight: 8 }}>
            增加分隔符
          </Button>
          {record.type === 'gapLine' ? <Button onClick={() => {
            const newData = JSON.parse(JSON.stringify(dataList))
            const a = newData.splice(
              index,
              1
            )
            setDataList(newData)
          }} style={{ marginRight: 8 }}>
            删除分隔符
          </Button> : null}
          {record.type !== 'gapLine' ? <Button onClick={() => {
            props.history.push(`/lesson/${record.id}?cat=${0}`)
          }} style={{ marginRight: 8 }}>
            进入课程
          </Button> : null}
          {record.type !== 'gapLine' ? <Button onClick={() => {
            props.history.push(`/agent/${record.id}?cat=${0}`)
          }} style={{ marginRight: 8 }}>
            AI技能教练
          </Button> : null}
        </div>
      }
    }
  ];

  console.log(dataList, '===dataList===')


  return (
    <div className='steps_wrapper'>
      <div>当前登录账号：{userName}</div>
      <div style={{ marginTop: 30 }}>
        <Table
          pagination={{pageSize: 100}}
          key={'table'}  //key👈👈👈
          bordered={true} row-style={(record) => {
            console.log(row, 666)
            return record.success ? { background: 'rgba(100, 200, 100, 0.5)' } : null
          }}
          rowClassName={(record) => {
            if (record.type === 'gapLine'){
              return 'gapLine'
            }
            return record.paike_level === 'L1' ? 'L1' : record.paike_level === 'L2' ? 'L2' : record.paike_level === 'L3' ? 'L3' : ''
          }}
          rowKey={(record) => {
            return record.id;
          }}
          dataSource={dataList}
          columns={columns}
        />

      </div>

      {/* <Steps direction='vertical' current={current}>
        {dataList && dataList.map((item, index) => (
          <Step title={item.lesson_name} data-index={index} onClick={onButtonClick.bind(this, item, index)}/>
        ))}
      </Steps> */}

      {/* {(dataList || []).map((item, index) => (
        <div title={item.lesson_name} key={index} className='tree-parent'>
          <div className="title">{item.lesson_name}</div>
          {item.content && item.content.map((ele, idx) => (
            <div title={ele.name} key={index + '-' + idx} data-index={index} onClick={onButtonClick.bind(this, item, idx)} className={ele.isBelowLine ? 'tree-node belowLine' : 'tree-node'}>
              {ele.name}
            </div>
          ))}
          {(item.exams || []).map(ele => (
            <div style={{
              marginLeft: 20,
              fontSize: 15,
              color: '#f63'
            }}
              onClick={() => {
                props.history.push(`/exam/${ele.id}`)
            }}>{ele.name}</div>
          ))}
        </div>
      ))} */}

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

      { paikePower > 0 || true ? <Button type="primary" onClick={(record, index) => {
        // e.preventDefault()

        const params = dataList.map((item, idx) => {
          return {
            lesson_index: idx,
            id: item.id,
            text: item.text
          }
        })

        axios.post(ownPaikeInfo ? 'https://www.coffeebeats.cn/updateOnlineLessonV2Order' : 'https://www.coffeebeats.cn/postAddOnlineLessonV2Order', {
          user_id: userId,
          content: JSON.stringify(params),
          lesson_id: props.match.params.id
        }).then(res => {
          Message.success('更新成功')
        })

        // Promise.all(dataList.map((item, idx) => {
        //   item.lesson_index = idx;
        //   // item.content = JSON.stringify(item.content)

        //   axios.post(ownPaikeInfo ? 'https://www.coffeebeats.cn/updateOnlineLessonV2Order' : 'https://www.coffeebeats.cn/postAddOnlineLessonV2Order', {
        //     user_id: userId,
        //     content: JSON.stringify(item),
        //   })
        // })).then(res => {
        //   Message.success('更新成功')
        // })

      }} style={{ marginTop: 30, marginLeft: 50 }}>
        确认排课
      </Button> : null }
    </div>
  )
}

export default withRouter(Lesson)
