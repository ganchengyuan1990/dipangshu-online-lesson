
/*eslint-disable*/
import React from 'react';
import { Button, Input, notification } from 'antd'
import axios from 'axios';


const { TextArea } = Input

class CommentBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			contentLine: {}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const aaa = JSON.parse(window.sessionStorage.getItem('currentContentLine') || '{}')
		this.setState({
			contentLine: aaa
		})
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.questionList) !== JSON.stringify(this.props.questionList)) {
			console.log(this.props.questionList, 'lalala')
			this.setState({
				contentLine: {
					...this.state.contentLine,
					questions: this.props.questionList
				}
			})
		}
	}

	handleChange(e) {
		this.setState({
			value: e.target.value,
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		//调用父组件的函数
		this.props.onAddComment(this.textInput.value);
		// 清空输入框
		this.textInput.value = '';
	}

	render() {
		console.log(this.props.questionList, 888)
		return (
			<>
				<div>
					<h3 style={{marginTop: '10px'}} >历史留言</h3>

					{!this.props.questionList.length && <div style={{textAlign: 'center', margin: '30px auto', color: "#999"}} >暂无留言</div>}
					{this.props.questionList.map(i => (
						<div style={{margin: '0px 0px 20px 0px', paddingBottom: 12, borderBottom: '1px solid #eee'}}>
							<div style={{ marginBottom: 0, color: "#666", fontSize: '13px', display: 'flex', alignItems: 'center'}}>
								<img src="https://img.goatup.cn/PLANZ/43bb6f933a312a6dbdd7cd87221f5b4b.jpeg" style={{height: 20, width: 20, marginRight: 5}}></img>
								<span>{i.userName}</span>
							</div>
							<div style={{color: "#000", marginLeft: 22}}>
								{i.title}
								{ i.answer && <div style={{ marginTop: 5, marginLeft: 0}}>
									<div style={{ color: "#666", fontSize: '13px', display: 'flex', alignItems: 'center'}}>
										{/* <img src="https://www.coffeebeats.cn/uploads/logo_small.jpg" style={{height: 20, width: 20, marginRight: 5}}></img> */}
										<span>官方账号</span>
									</div>
									<div style={{color: "#000", marginLeft: 25}}>
										{i.answer}
									</div>
								</div>}
							</div>
						</div>
					))}
				</div>
				<form className="p-1" onSubmit={this.handleSubmit} style={{marginTop: 60}}>
					<div className="form-group">
						<label>提问</label>

						<TextArea rows={4} placeholder='请留下您的提问，工作人员会尽快解答' onChange={this.handleChange} value={this.state.value}/>

					</div>
					<Button type='primary' style={{background: '#109080', margin: '20px 50%', transform: 'translate(-50%, 0%)'}} onClick={() => {
						const questions = this.state.contentLine.questions || [];
						questions.push({
							userName: JSON.parse(window.sessionStorage.getItem('userInfo') || '{}').userName,
							title: this.state.value,
							answer: ''
						})
						const currentLine = {
							... this.state.contentLine.value ? this.state.contentLine : JSON.parse(window.sessionStorage.getItem('currentContentLine') || '{}'),
							shown: false,
							questions
						}

						const currentLessonData = JSON.parse(window.sessionStorage.getItem('currentLessonData') || '{}')

						const historyContent = currentLessonData[window.location.href.split('=')[1]];

						historyContent.content[this.props.index] = currentLine

						axios.post('https://www.coffeebeats.cn/updateOnlineLessonContentV2', { content: JSON.stringify(currentLessonData), id: this.props.id }).then(response => {
							notification.success({
								message: '提问成功，工作人员会尽快回答，请耐心等待',
								// description: `insert ${response.insertList.length} article and update ${response.updateList.length} article`
							})
							window.sessionStorage.setItem('currentContentLine', JSON.stringify(currentLine));
							this.props.onAddComment(currentLine);
						}).catch(error => {
							console.log('error: ', error)
							notification.error({
								message: '提问失败，请稍后再试',
							})
						})
					}}>留言</Button>
					{/* <p>已有条{this.props.commentsLength}评论</p> */}
				</form>
			</>
		);
	}
}

export default CommentBox;