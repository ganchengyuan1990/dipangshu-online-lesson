import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link, useLocation } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import navList from './navList'

function NavBar(props) {
  const location = useLocation()
  const { mode = 'horizontal' } = props
  return (
    <Menu mode={mode} selectedKeys={[location.pathname]} className='header-nav' key={Date.now()}>
      {navList.map(nav => (
        <Menu.Item key={nav.link}>
          <Link to={nav.link} onClick={() => {
            if (!nav.logout) {
              return
            }
            window.localStorage.setItem('onlineUser', '')
            window.localStorage.setItem('wechatUser', true)
            window.sessionStorage.removeItem('userInfo')
            // window.history.back(-1)
            location.href = '../index.html'
          }}>
            {nav.icon && <Icon type={nav.icon} />}
            <span className='nav-text'>{nav.title}</span>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default NavBar
