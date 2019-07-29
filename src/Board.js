import React from 'react'
import { withRouter } from 'react-router-dom'

const Context = React.createContext()

const boardView = (l, i) =>
  l === 0 ? 'small' : l === i ? 'full' : l - 1 === i ? 'small' : 'hidden'

const Board = ({ levels, level, children, ...props }) => {
  const view = boardView(levels, level)
  return (
    <Context.Provider value={{ level }}>
      <article className={`admin-board${view ? ' admin-board__' + view : ''}`}>
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
