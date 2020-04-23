import React from 'react'
import { withBoard } from './Board'

const Head = ({
  title,
  content,
  actions = [],
  children,
  className,
  setMinimized,
  minimized,
  level,
  levels
}) => {
  const m = minimized && level === levels - 1
  return (
    <header className={`admin-board__head ${className || ''}`}>
      <div
        className={`d-flex justify-content-between ${
          m ? 'align-items-center flex-column-reverse' : 'align-items-start'
        }`}
      >
        <h2 className={`admin-board__head-title ${m && 'pt-2'}`}>
          {m ? title.charAt(0) : title}
        </h2>
        {level === levels - 1 && (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? '⇥' : '⇤'}
          </button>
        )}
      </div>
      {!m && (
        <>
          <div className={'admin-board__head-content'}>{content}</div>
          <div className={'admin-board__head-content'}>{children}</div>
          <div className={'admin-board__head-actions'}>{actions}</div>
        </>
      )}
    </header>
  )
}

const HeadBoardWrapper = withBoard(Head)

const Body = ({ loading, children, className, logo, minimized }) => {
  if (minimized) return null
  return (
    <section
      className={`admin-board__body ${
        loading ? 'admin-board__loading' : ''
      } ${className || ''}`}
      style={logo ? { backgroundImage: `url(${logo})` } : {}}
    >
      {children}
    </section>
  )
}

const BodyBoardWrapper = withBoard(Body)

const Tools = ({ children }) => (
  <aside id={'admin-dashboard__tools'}>{children}</aside>
)

export { HeadBoardWrapper as Head, BodyBoardWrapper as Body, Tools }
