import React from 'react'

const Head = ({ title, content, actions = [], children, className }) => (
  <header className={`admin-board__head ${className || ''}`}>
    <h2 className={'admin-board__head-title'}>{title}</h2>
    <div className={'admin-board__head-content'}>{content}</div>
    <div className={'admin-board__head-content'}>{children}</div>
    <div className={'admin-board__head-actions'}>{actions}</div>
  </header>
)

const Body = ({ loading, children, className, logo }) => (
  <section
    className={`admin-board__body ${
      loading ? 'admin-board__loading' : ''
    } ${className || ''}`}
    style={logo ? { backgroundImage: `url(${logo})` } : {}}
  >
    {children}
  </section>
)

const Tools = ({ children }) => (
  <aside id={'admin-dashboard__tools'}>{children}</aside>
)

export { Head, Body, Tools }
