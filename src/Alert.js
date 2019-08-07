import React from 'react'
import { transitions, positions, Provider } from 'react-alert'
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
  timeout: 8000,
  offset: '2em',
  transition: transitions.FADE
}

const withAlert = WrappedComponent => props => (
  <Provider {...options}>
    <WrappedComponent {...props} />
  </Provider>
)

export { Template as AlertTemplate, options as alertOptions, withAlert }
export default props => <Provider {...options} {...props} />
