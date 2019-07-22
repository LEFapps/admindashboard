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
    <section className={`admin-board__body ${className || ''}`}>
      {children}
      {logo ? (
        <footer className={'admin-board__brand'}>
          <img src={logo} alt='' />
        </footer>
      ) : null}
    </section>
  )
})

export { BoardHead, BoardBody }
