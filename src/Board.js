import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

const Context = React.createContext()

const boardView = (l, i) =>
  l === 0 ? 'small' : l === i ? 'full' : l - 1 === i ? 'small' : 'hidden'

const Board = ({ levels, level, children, ...props }) => {
  const [minimized, setMinimized] = useState(false)
  useEffect(() => {
    level !== levels - 1 && setMinimized(false)
  })
  delete props.staticContext
  const view = boardView(levels, level)
  return (
    <Context.Provider value={{ level, levels, minimized, setMinimized }}>
      <article
        className={`admin-board${view ? ' admin-board__' + view : ''}${
          minimized ? ' admin-board__minimized' : ''
        }`}
      >
        <div className={'admin-board__content'}>
          {children ? React.cloneElement(children, props) : null}
        </div>
      </article>
    </Context.Provider>
  )
}

const withBoard = Component => {
  return function BoardComponent (props) {
    return (
      <Context.Consumer>
        {board => <Component {...props} {...board} />}
      </Context.Consumer>
    )
  }
}

export default withRouter(Board)
export { withBoard }
