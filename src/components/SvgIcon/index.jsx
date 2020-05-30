import React from 'react'
import PropTypes from 'prop-types'

// iconfont svg
const SvgIcon = props => {
  return (
    // <svg className={`svg-icon ${props.className}`} aria-hidden='true' style={props.style}>
    //   <use xlinkHref={`#${props.type}`} />
    // </svg>
    <img src='https://www.coffeebeats.cn/uploads/logo_small.jpg' style={{ height: 30, width: 30 }}/>
  )
}

SvgIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
}

SvgIcon.defaultProps = {
  className: ''
}

export default SvgIcon
