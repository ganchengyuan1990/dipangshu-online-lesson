/*eslint-disable*/
import React, { Component, useState } from 'react'
import { Modal, Button, WingBlank, WhiteSpace, Toast } from 'antd-mobile';

//


function Login(props) {

  const onOk = values => {
    props.onLoginOk(values);
  };
  const onCancel = () => {
    props.form.resetFields();//重置Form表单的内容
    props.onCancel()//调用父组件给的方法
  };

  // const { role, username, github } = props.userInfo
  return (
    prompt(
      'Login',
      'Please input login information',
      (login, password) => console.log(`login: ${login}, password: ${password}`),
      'login-password',
      null,
      ['Please input name', 'Please input password'],
    )
  ) 
}

// Login.propTypes = {
//   userInfo: PropTypes.object.isRequired,
//   popoverVisible: PropTypes.bool
// }

// Login.defaultProps = {
//   popoverVisible: true
// }

export default Login
