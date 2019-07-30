import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'

import { pathPropType } from './helpers'
import BreadCrumbs from './BreadCrumbs'
import Board from './Board'
import { Body, Head } from './BoardParts'
import MainMenu from './MainMenu'

const Context = React.createContext()

const withContext = Component => {
  return function AdminDashboardComponent (props) {
    return (
      <Context.Consumer>
        {dashboard => <Component {...props} {...dashboard} />}
      </Context.Consumer>
    )
  }
}

const defaultBranding = {
  color: '#D2BD2C',
  logo: ''
}

const above = size => window.matchMedia(`(min-width: ${size}px)`).matches

const BoardBody = withContext(Body)
const BoardHead = withContext(Head)

class AdminDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pathArray: this.processPathname(),
      boardSwitches: this.setBoardSwitches(this.processPathname()),
      aboveTablet: above(768)
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.trackResize)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.trackResize)
  }
  trackResize = () => {
    this.setState({ aboveTablet: above(768) })
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
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
    const urlPath = url === '/' ? '' : url
    const pathArray = []
    const pathParts = pathname
      .replace(urlPath, '')
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
    const urlPath = url === '/' ? '' : url
    const l = pathArray.length
    const boardSwitches = []
    const thisPathArray = []
    pathArray.map(path => {
      path
        .substring(1)
        .split('/')
        .map((pathPart, i) => {
          const pathObjects = []
          settings.map(settingsPath => {
            // const thisPathArray = pathArray.slice(0, l - 1)
            // thisPathArray.push(settingsPath.path)
            if (thisPathArray.join('').includes(settingsPath.path)) {
              return
            }
            if (i === 0) {
              pathObjects.push({
                absolutePath:
                  urlPath + thisPathArray.join('') + settingsPath.path,
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
                  absolutePath: urlPath + thisViewPath,
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
    const urlPath = url === '/' ? '' : url
    return urlPath + pathArray.join('') // .replace(/\/\//, '/')
  }
  render () {
    const { boardSwitches } = this.state
    return (
      <Context.Provider
        value={{
          ...this.state,
          getLink: this.getLink,
          logo: this.props.branding
            ? this.props.branding.logo
            : defaultBranding.logo
        }}
      >
        <style>{`#admin-dashboard, #admin-dashboard__tools { --primary: ${
          this.props.branding && this.props.branding.color
            ? this.props.branding.color
            : defaultBranding.color
        } }`}</style>
        <div id='admin-dashboard'>
          <BreadCrumbs getLink={this.getLink} {...this.props} {...this.state} />
          <Board levels={boardSwitches.length} level={0}>
            <>
              <BoardHead title={this.props.label} />
              <Body>
                <MainMenu
                  getLink={this.getLink}
                  settings={this.props.settings}
                />
              </Body>
            </>
          </Board>
          {boardSwitches && boardSwitches.length ? (
            boardSwitches.map((pathObjects, i, { length }) => (
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
            ))
          ) : this.props.children && this.state.aboveTablet ? (
            <Board levels={1} level={1}>
              {this.props.children}
            </Board>
          ) : null}
        </div>
      </Context.Provider>
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
  children: PropTypes.element,
  notFoundComponent: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  branding: PropTypes.shape({
    color: PropTypes.string,
    logo: PropTypes.string
  })
}

export default withRouter(AdminDashboard)
export { withContext, BoardHead, BoardBody }
