import React from 'react'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardLink from './DashboardLink'

export const BoardList = ({ children }) => (
  <table className={'table admin-board__list'}>
    <tbody>{children}</tbody>
  </table>
)

const getColor = {
  remove: 'danger',
  edit: 'dark',
  view: 'info',
  link: 'warning',
  unlink: 'warning',
  drag: 'light',
  up: 'light',
  down: 'light',
  duplicate: 'warning'
}

const getIcon = {
  remove: 'trash-alt',
  edit: 'edit',
  view: 'eye',
  link: 'link',
  unlink: 'unlink',
  drag: 'sort',
  up: 'caret-up',
  down: 'caret-down',
  duplicate: 'copy'
}

const Spinner = ({ color }) => {
  return (
    <div className={`spinner-grow spinner-grow-sm text-${color}`} role='status'>
      <span className={'sr-only'}>Loading...</span>
    </div>
  )
}

const Err = ({ msg }) => {
  return <span className={'admin-board__list-item__error'}>{msg}</span>
}

const Action = ({
  type,
  color,
  loading = false,
  error = '',
  to,
  onClick,
  icon,
  ...props
}) => {
  const actionColor = color || getColor[type] || 'dark'
  const actionIcon = icon || getIcon[type] || 'wrench'
  const className = `btn btn-sm btn-outline-${actionColor}${error &&
    ' has-error'}${
    ['view', 'edit'].includes(type) ? '' : ' admin-board__small-body__hidden'
  }`
  if (onClick && isFunction(onClick)) {
    return (
      <button className={className} onClick={onClick}>
        {loading ? (
          <Spinner color={actionColor} />
        ) : (
          <FontAwesomeIcon icon={actionIcon} />
        )}
        {(error && <Err msg={error} />) || null}
      </button>
    )
  }
  if (to && isString(to)) {
    return (
      <DashboardLink to={to} className={className}>
        {loading ? (
          <Spinner color={actionColor} />
        ) : (
          <FontAwesomeIcon icon={actionIcon} />
        )}
        {(error && <Err msg={error} />) || null}
      </DashboardLink>
    )
  }
  return (
    <div {...props} className={className}>
      {loading ? (
        <Spinner color={actionColor} />
      ) : (
        <FontAwesomeIcon icon={actionIcon} />
      )}
      {(error && <Err msg={error} />) || null}
    </div>
  )
}

export const BoardListItem = ({ children, label, actions, ...props }) => {
  return (
    <tr className={'admin-board__list-item'}>
      <td className={'admin-board__list-item__label'}>{label}</td>
      <td className={'admin-board__list-item__content'}>{children}</td>
      <td className={'admin-board__list-item__actions'}>
        {Object.keys(actions).map((action, key) => (
          <Action key={key} {...props} {...actions[action]} type={action} />
        ))}
      </td>
    </tr>
  )
}
