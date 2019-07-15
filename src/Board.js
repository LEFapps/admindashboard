import React from 'react'
import { Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'

const Context = React.createContext()

const boardView = (l, i) =>
  l === 0 ? 'small' : l === i ? 'full' : l - 1 === i ? 'small' : 'hidden'

const Board = ({ levels, level, children, ...props }) => {
  const view = boardView(levels, level)
  return (
    <Context.Provider value={{ level }}>
      <Col
        md={view === 'full' ? 8 : 4}
        className={view === 'hidden' ? 'd-none' : ''}
      >
        {React.cloneElement(children, props)}
      </Col>
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
