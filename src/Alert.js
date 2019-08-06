import React from 'react'
import { transitions, positions } from 'react-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const icons = {
  info: 'info-circle',
  danger: 'exclamation-circle',
  warning: 'question-circle',
  success: 'check-circle'
}
const getIcon = type => icons[type] || 'warning'

const Template = ({ style, options: { type }, message, close }) => (
  <div className={`alert alert-${type} react-alert`} style={style}>
    <FontAwesomeIcon icon={getIcon(type)} />
    <div className={'alert-message'}>{message}</div>
    <button className={'close'} onClick={close}>
      <FontAwesomeIcon icon={'times'} />
    </button>
  </div>
)

const options = {
  template: Template,
  position: positions.BOTTOM_LEFT,
  timeout: 10000,
  offset: '2em',
  transition: transitions.FADE
}

export { Template as AlertTemplate, options as alertOptions }
