import React from 'react'
import { withContext } from './AdminDashboard'

const BoardHead = ({ title, content, actions = [], children, className }) => {
  return (
    <header className={`admin-board__head ${className || ''}`}>
      <h2 className={'admin-board__head-title'}>{title}</h2>
      <div className={'admin-board__head-content'}>{content}</div>
      <div className={'admin-board__head-content'}>{children}</div>
      <div className={'admin-board__head-actions'}>{actions}</div>
    </header>
  )
}

const BoardBody = withContext(({ children, className, logo }) => {
  return (
    <section
      className={`admin-board__body ${className || ''}`}
      style={logo ? { backgroundImage: `url(${logo})` } : {}}
    >
      {children}
    </section>
  )
})

export { BoardHead, BoardBody }
