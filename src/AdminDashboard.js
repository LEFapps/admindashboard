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

const boardSwitcher = (settings, base = '') => {
  const listPaths = (paths, url = '', pathArray = []) => {
    paths.forEach(({ views, ...path }, i, arr) => {
      const absolutePath = url + path.path
      pathArray.push({ absolutePath, ...path })
      const otherPaths = arr.filter(a => absolutePath.indexOf(a.path) < 0)
      if (views) {
        views.forEach(view => {
          const subPath = absolutePath + view.path
          pathArray.push({ absolutePath: subPath, ...view })
          listPaths(otherPaths, subPath, pathArray)
        })
      }
    })
    return pathArray
  }
  return listPaths(settings, base === '/' ? '' : base).reduce(
    (pathArray, path) => {
      const i =
        path.absolutePath
          .split('/')
          .slice(1)
          .filter(p => p !== base.replace('/', '')).length - 1
      pathArray[i] ? pathArray[i].push(path) : (pathArray[i] = [path])
      return pathArray
    },
    []
  )
}

class AdminDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      levels: this.getLevels(),
      aboveTablet: above(768)
    }
    this.boardSwitches = boardSwitcher(
      this.props.settings,
      this.props.match.url
    )
  }
  componentDidMount () {
    window.addEventListener('resize', this.trackResize)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.trackResize)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ levels: this.getLevels() })
    }
  }
  trackResize = () => {
    this.setState({ aboveTablet: above(768) })
  }
  getLevels = () =>
    this.props.location.pathname
      .replace(this.props.match.url === '/' ? '' : this.props.match.url, '')
      .split('/').length
  getLink = path => (this.props.match.url + path).replace(/\/\//, '/')
  render () {
    const { aboveTablet, levels, ...state } = this.state
    const boardSwitches = this.boardSwitches
    return (
      <Context.Provider
        value={{
          ...state,
          getLink: this.getLink,
          logo: this.props.branding
            ? this.props.branding.logo
            : defaultBranding.logo
        }}
      >
        <style>
          @import
          'https://fonts.googleapis.com/css?family=Montserrat:400,700|Open+Sans:400,400i,700,700i&display=swap';
          {`#admin-dashboard, #admin-dashboard__tools { --primary: ${
            this.props.branding && this.props.branding.color
              ? this.props.branding.color
              : defaultBranding.color
          } }`}
        </style>
        <div id='admin-dashboard'>
          <BreadCrumbs getLink={this.getLink} {...this.props} {...state} />
          <Board levels={levels - 1} level={0}>
            <>
              <BoardHead title={this.props.label} />
              <BoardBody>
                <MainMenu
                  getLink={this.getLink}
                  settings={this.props.settings}
                />
              </BoardBody>
            </>
          </Board>
          {boardSwitches.map((pathObjects, i) => (
            <Switch key={`board-switch-${i}`}>
              {pathObjects.map(
                ({ absolutePath, component: Component, ...props }, j) => (
                  <Route path={absolutePath} key={`route-${i}-${j}`}>
                    <Board levels={levels - 1} level={i + 1} {...props}>
                      <Component />
                    </Board>
                  </Route>
                )
              )}
            </Switch>
          ))}
          {levels === 1 && this.props.children && aboveTablet ? (
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
