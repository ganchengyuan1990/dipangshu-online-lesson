/*eslint-disable*/

import React, { useReducer, useState, useRef, useContext } from 'react'
import useMount from '@/hooks/useMount'
import { Table, Progress, Input, Switch, Form, Modal, message } from 'antd'
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ANNOUNCEMENT } from '@/config'
import useFetchDetail from '@/hooks/useFetchDetail'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import './index.less'
import { resolveOnChange } from 'antd/lib/input/Input'

const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);



function Lesson(props) {
  let isBuyed = false
  useMount(() => {
    document.querySelector('.app-header').style.display = 'none';
    document.title = '考试';
    // setExam({
    //   param: [{
    //     width: 10,
    //     height: 5,
    //     length: 3
    //   }]
    // });
    //   document.getElementsByTagName("title")[0].innerText = '物流信息跟踪';

    axios
      .get('https://www.coffeebeats.cn/getExamById', {
        params: {
          id: props.match.params.id
        }
      })
      .then(async (response) => {
        const element = response.result
        const exam = JSON.parse(element.content);
        element.content = exam
        setAnswers(generateArr(exam.length))
        setExam(element);

        axios
          .get('https://www.coffeebeats.cn/getExamRecordsByExamAndUserId', {
            params: {
              exam_id: props.match.params.id,
              user_id: '309021023'
            }
          })
          .then(async (res) => {
            console.log(res, 6666)
            if (res.result.length > 0) {
              const newContent = JSON.parse(res.result[0].content);
              setScore(res.result[0].score)
              setAnswers(newContent.map(ele => {
                return {
                  value: ele.choice,
                  index: ele.choice === "A" ? 0 : ele.choice === "B" ? 1 : ele.choice === "C" ? 2 : ele.choice === "D" ? 3 : ele.choice === "E" ? 4 : 5
                }
              }))
              message.success('您已答过该试卷')
              setDoneAlready(true);
            }
            // const element = response.result
            // const exam = JSON.parse(element.content);
            // element.content = exam
            // setAnswers(generateArr(exam.length))
            // setExam(element);
          })
      })


  })

  const generateArr = len => {
    const res = []
    while (len > 0) {
      res.push('');
      len--;
    }
    return res;
  }

  const getNumber = (number) => {
    if (number == parseInt(number)) {
      return parseInt(number)
    }
    return number;
  }

  const calcRes = () => {
    const content = exam.content;
    let res = 0;
    content.forEach((ti, idx) => {
      if (ti.answer === answers[idx].value) {
        res += Number(getNumber(ti.score))
      }
      ti.choice = answers[idx].value
    });
    return {
      score: res,
      content
    };
  }


  const [exam, setExam] = useState({})
  const [answers, setAnswers] = useState([])

  const [columns, setColumns] = useState([])
  const [index, setIndex] = useState(0)

  const [score, setScore] = useState(0)

  const [doneAlready, setDoneAlready] = useState(false)

  const examRef = useRef()
  examRef.current = exam;

  console.log(answers, exam.content, '===answers===')

  const finalColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        // handleSave: this.handleSave,
      }),
    };
  });

  if (!exam.content || !exam.content[0]) {
    return null
  }


  return (
    <div className='steps_wrapper'>
      {doneAlready && <div style={{ marginLeft: 15, fontSize: 18, fontWeight: 'bolder' }}>您的考试成绩是：{score} 分</div>}
      <div className="next-row next-row-justify-space-around next-row-align-center" style={{ height: 50, marginBottom: 20 }}>
        <div className="next-col next-col-16 next-col-center"><span className="components-Question-___index__index___2hpir">{index + 1}</span><span className="components-Question-___index__type___1Nygo">单项选择题</span></div>
        <div className="next-col next-col-8 components-Question-___index__score___21tue"><span>
          本题分值: {getNumber(exam.content[index].score)}
        </span></div>
      </div>


      <div className="next-row">
        <div className="next-col">
          <div className="clearfix components-Question-___index__title___1nUew">
            <p> {exam.content[index].name}</p>
          </div>
        </div>
      </div>


      <div className="next-row">
        <div className="next-col" >
          {
            (exam.content[index].options || []).map((option, idx) => (
              <div onClick={() => {
                if (doneAlready) {
                  return
                }
                const _answers = JSON.parse(JSON.stringify(answers));
                const sss = idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : idx === 3 ? 'D' : idx === 4 ? 'E' : 'F';
                _answers[index] = {
                  value: sss,
                  index: idx
                }
                console.log(_answers, '====_answers====')
                setAnswers(_answers)
              }} className={`components-Question-___index__option-box___1ZfaJ ${answers[index].index === idx ? 'components-Question-___index__active___3ZaYN' : ''}`}>
                <div className="components-Question-___index__option-left___2MHK3">
                  <div className={`components-Question-___index__option-index___vuxq- ${answers[index].index === idx ? 'components-Question-___index__active___3ZaYN' : ''}`}>{
                    idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : idx === 3 ? 'D' : idx === 4 ? 'E' : 'F'
                  }</div>
                </div>
                <div className="components-Question-___index__option-right___1DBi1">
                  <div>
                    <p>{option.value}</p>
                  </div>
                </div>
              </div>

            ))
          }

        </div>
      </div>

     { doneAlready && exam.content[index].answer !== answers[index].value && <div className="next-row">
          <div style={{ margin: 12, color: 'red', fontWeight: 'bold'}}>
            本题的正确答案是：{exam.content[index].answer}
          </div>
      </div>}


      <div id="tab" className="routes-Paper-___index__tab-box___1sUJz">
        <div className="routes-Paper-___index__tab___1ufbM">
          <div>
            <div className="components-Tab-___index__btn-center___26DAG"><button onClick={() => {
              if (index > 0) {
                setIndex(index - 1);
              }

            }} disabled="" type="button" className="next-btn next-btn-normal next-btn-large exam-btn-ghost" style={{ width: 160 }}>
              上一题
              </button><button type="button" onClick={() => {
                if (index < exam.content.length - 1) {
                  setIndex(index + 1);
                } else {
                  if (answers.filter(x => !!x).length < exam.content.length) {
                    Modal.info({
                      title: '您还有题没答完，请确认以后再提交',
                    })
                    return;
                  }
                  if (doneAlready) {
                    Modal.info({
                      title: '您已答过该试卷，不用重复提交哈',
                    })
                    return;
                  }
                  Modal.confirm({
                    title: '提交试卷',
                    // icon: <ExclamationCircleOutlined />,
                    content: '您已答完所有问题，是否立即提交试卷？',
                    okText: '确认提交',
                    cancelText: '再看看',
                    onOk: () => {
                      const result = calcRes();
                      axios.post('https://www.coffeebeats.cn/postAddExamRecord', {
                        content: JSON.stringify(result.content),
                        score: result.score,
                        exam_id: props.match.params.id,
                        user_id: '309021023',
                        school: '浙江大学',
                        time: Date.now(),
                      }).then(res => {
                        // message.success('注册成功，请重新登录您的账号！')
                        message.success('提交成功，正在刷新页面')
                        setTimeout(() => {
                          location.reload()
                        }, 1500)
                      })
                    }
                  });
                }
              }}
                className="next-btn next-btn-primary next-btn-large" style={{ marginLeft: 15, width: 160, }}>
                下一题
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Lesson);
