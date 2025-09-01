/*eslint-disable*/

import React, { useReducer, useState, useRef } from 'react'
import useMount from '@/hooks/useMount'
import { Table, Progress, Switch } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import useFetchDetail from '@/hooks/useFetchDetail'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import './index.less'
import { resolveOnChange } from 'antd/lib/input/Input'

function Lesson(props) {
  let isBuyed = false
  useMount(() => {
    document.querySelector('.app-header').style.display = 'none';
    document.title = '物流信息跟踪';
    document.getElementsByTagName("title")[0].innerText = '物流信息跟踪';
    axios
      .get('https://www.coffeebeats.cn/getSupplyById', {
        params: {
          id: props.match.params.id || 10
        }
      })
      .then(async (response) => {
        console.log(response, 888)
        const element = response.resultList[0]
        const param = JSON.parse(element.param);
        const successItems = param.filter(ele => !!ele.success);
        element.status = parseInt(successItems.length * 100 / param.length);
        element.param = JSON.parse(element.param)

        // await Promise.all(element.param.map(ele => {
        //   if (ele.express && ele.expressComp) {
        //     return new Promise(async (resolve) => {
        //       const a = await axios.get(`https://www.coffeebeats.cn/getExpressInfo?no=${ele.express}&type=${ele.expressComp}`)
        //       ele.expressInfoList = a.result.list;
        //       resolve(null);
        //     })
        //   }
        // }))

        // element.param.forEach((ele, idx) => {
        //   axios.get(`https://www.coffeebeats.cn/getExpressInfo?no=${ele.express}&type=${ele.expressComp}`).then(res => console.log(res.result.list))
        // })
        setContent(element);

      })
  })

  const columnsA = [
    {
      title: '是否验收',
      dataIndex: 'received',
      key: 'received',
      render: (text, record, index) => {
        return <Switch defaultChecked={Boolean(record.received)} onChange={async (checked) => {
          const newContent = JSON.parse(JSON.stringify(contentRef.current));
          const index = newContent.param.findIndex(ele => ele.moduleName == record.moduleName);
          record.received = checked
          newContent.param[index] = record
          setContent(newContent)
          console.log(JSON.stringify(newContent.param), 888)

          axios.post('https://www.coffeebeats.cn/updateSupply', {
            ...newContent,
            param: JSON.stringify(newContent.param)
          }).then(res => {
            // message.success('注册成功，请重新登录您的账号！')
          })
        }} />
      }
    },
    {
      title: '编号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '模块名',
      dataIndex: 'moduleName',
      key: 'moduleName',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '物流单号跟踪',
      dataIndex: 'expressInfoList',
      key: 'expressInfoList',
      render: (text, record, index) => {
        return (
          record.remark ? <div>{record.remark}</div> :
            record.open ? (
              record.expressInfoList && record.expressInfoList.length ? (record.expressInfoList || []).map(info => (
                <div>{info.time}: {info.status}</div>
              )) : <div>暂无物流信息</div>
            ) :
              <div>点击看物流信息
            {/* <span style={{ transform: 'rotate(90deg)', display: 'inline-block'}}>—></span> */}
              </div>
        )
      }
    },
  ];
  const [content, setContent] = useState({})
  const [columns, setColumns] = useState(columnsA)
  const contentRef = useRef()
  contentRef.current = content;







  return (
    <div className='steps_wrapper'>
      {/* {dataList && dataList.map((item, index) => (
        <div title={item.lesson_name} key={index} className='tree-parent'>
          {item.lesson_name}
          {item.content && item.content.map((ele, idx) => (
            <div title={ele.name} key={index + '-' + idx} data-index={index} onClick={onButtonClick.bind(this, item, idx)} className='tree-node'>
              {ele.name}
            </div>
          ))}
        </div>
      ))} */}
      <div>项目名称：{content.name}</div>
      <div>物流地址：{content.address}</div>
      <div>项目进度：<Progress percent={content.status} /></div>


      <div style={{ marginTop: 30 }}>
        <Table
          key={'table'}  //key👈👈👈
          bordered={true} row-style={(record) => {
            console.log(row, 666)
            return record.success ? { background: 'rgba(100, 200, 100, 0.5)' } : null
          }}
          rowClassName={(record) => {
            return record.success ? 'finshed' : ''
          }}
          rowKey={(record) => {
            return record.id;
          }}
          dataSource={content.param} columns={columns}
          onRow={record => {
            return {
              onClick: async (event) => {
                const newContent = JSON.parse(JSON.stringify(content));
                const index = newContent.param.findIndex(ele => ele.moduleName == record.moduleName);
                record.open = Boolean(!(record.open))
                if (!record.express || !record.expressComp) {
                  record.expressInfoList = [];
                  newContent.param[index] = record
                  setContent(newContent)
                  return
                }
                const a = await axios.get(`https://www.coffeebeats.cn/getExpressInfo?no=${record.express}&type=${record.expressComp}`)
                record.expressInfoList = a.result.list;
                console.log(record, 666888)
                newContent.param[index] = record
                contentRef.current = newContent;
                // window.contentRef333Indewx = index;
                setContent(newContent)
              }, // 点击行
            };
          }}
        />

      </div>



      {/* <Modal
        title='进度提示'
        visible={showModal}
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>您还未学到此章节，确定要开始学习吗？</p>
      </Modal> */}
    </div>
  )
}

export default withRouter(Lesson)
