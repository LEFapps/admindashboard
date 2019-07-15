import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { withRouter, Switch, Route } from 'react-router-dom'

import { pathPropType } from './helpers'
import BreadCrumbs from './BreadCrumbs'
import Board from './Board'

const Context = React.createContext()

class AdminDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pathArray: this.processPathname(),
      boardSwitches: this.setBoardSwitches(this.processPathname())
    }
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      console.log(this.processPathname())
      this.setState({
        pathArray: this.processPathname(),
        boardSwitches: this.setBoardSwitches(this.processPathname())
      })
    }
  }
  processPathname = () => {
    const {
      location: { pathname },
      match: { url }
    } = this.props
    const pathArray = []
    const pathParts = pathname
      .replace(url, '')
      .split('/')
      .slice(1)
    pathParts.forEach((p, i) => {
      if (i % 2 === 0 && !!p) {
        let newPath = `/${p}`
        if (pathParts[i + 1]) {
          newPath += `/${pathParts[i + 1]}`
        }
        pathArray.push(newPath)
      }
    })
    return pathArray
  }
  setBoardSwitches = pathArray => {
    const {
      settings,
      match: { url },
      notFoundComponent
    } = this.props
    const l = pathArray.length
    const boardSwitches = []

    console.log(pathArray)

    const thisPathArray = []
    pathArray.map(path => {
      path
        .substring(1)
        .split('/')
        .map((pathPart, i) => {
          console.log(pathPart)
          const pathObjects = []
          settings.map(settingsPath => {
            // const thisPathArray = pathArray.slice(0, l - 1)
            // thisPathArray.push(settingsPath.path)
            if (thisPathArray.join('').includes(settingsPath.path)) {
              return
            }
            if (i === 0) {
              pathObjects.push({
                absolutePath: url + thisPathArray.join('') + settingsPath.path,
                path: settingsPath.path,
                component: settingsPath.component,
                label: settingsPath.label
              })
            }
            if (i === 1) {
              settingsPath.views.map(view => {
                const thisViewPath = pathArray
                  .join('')
                  .replace(path, settingsPath.path + view.path)
                pathObjects.push({
                  absolutePath: url + thisViewPath,
                  path: settingsPath.path + view.path,
                  component: view.component,
                  label: view.label
                })
              })
            }
          })
          pathObjects.push({
            component: notFoundComponent,
            label: '404'
          })
          boardSwitches.push(pathObjects)
        })
      thisPathArray.push(path)
    })

    console.log(boardSwitches)
    return boardSwitches
  }
  getLink = (path, level) => {
    let { pathArray } = this.state
    // replace all higher levels
    pathArray = pathArray.slice(0, level)
    // check if path already exists
    const i = pathArray.findIndex(el => el.includes(path.split('/')[1]))
    if (i > -1) {
      pathArray = pathArray.slice(0, i)
    }
    // remove last path if it's a single
    const l = pathArray.length
    if (l > 0 && pathArray[l - 1].split('/').length < 3) {
      pathArray = pathArray.slice(0, l - 2)
    }
    pathArray.push(path)
    const {
      match: { path: url }
    } = this.props
    return url + pathArray.join('')
  }
  render () {
    const { boardSwitches } = this.state
    return (
      <Context.Provider
        value={{
          ...this.state,
          getLink: this.getLink
        }}
      >
        <div id='admin-dashboard'>
          <Row>
            <Col xs={12}>
              <BreadCrumbs
                getLink={this.getLink}
                {...this.props}
                {...this.state}
              />
            </Col>
          </Row>
          <Row>
            <Board levels={boardSwitches.length} level={0}>
              {this.props.children}
            </Board>
            {boardSwitches.map((pathObjects, i, { length }) => (
              <Switch key={`board-switch-${i}`}>
                {pathObjects.map(
                  ({ absolutePath, component: Component, ...props }, j) => (
                    <Route path={absolutePath} key={`route-${i}-${j}`}>
                      <Board levels={length} level={i + 1} {...props}>
                        <Component />
                      </Board>
                    </Route>
                  )
                )}
              </Switch>
            ))}
          </Row>
        </div>
      </Context.Provider>
    )
  }
}

const withContext = Component => {
  return function AdminDashboardComponent (props) {
    return (
      <Context.Consumer>
        {dashboard => <Component {...props} {...dashboard} />}
      </Context.Consumer>
    )
  }
}

const shapePropType = {
  path: (p, pN, cN) => pathPropType(p, pN, cN)(1),
  component: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element
  ]).isRequired
}

AdminDashboard.propTypes = {
  settings: PropTypes.arrayOf(
    PropTypes.shape(
      Object.assign(shapePropType, {
        views: PropTypes.arrayOf(PropTypes.shape(shapePropType))
      })
    )
  ).isRequired,
  children: PropTypes.element.isRequired,
  notFoundComponent: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
}

export default withRouter(AdminDashboard)
export { withContext }
