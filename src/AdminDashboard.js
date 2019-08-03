import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'

import { pathPropType, cleanBase, cleanUrl } from './helpers'
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
  return listPaths(settings, cleanBase(base)).reduce((pathArray, path) => {
    const i =
      path.absolutePath
        .split('/')
        .slice(1)
        .filter(p => p !== base.replace('/', '')).length - 1
    pathArray[i] ? pathArray[i].push(path) : (pathArray[i] = [path])
    return pathArray
  }, [])
}

class AdminDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      level: this.getLevel(),
      aboveTablet: above(768),
      boardSwitches: boardSwitcher(this.props.settings, this.props.match.url)
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.trackResize)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.trackResize)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ level: this.getLevel() })
    }
  }
  trackResize = () => {
    this.setState({ aboveTablet: above(768) })
  }
  /* Url without base */
  getUrl = () =>
    '/' +
    this.props.location.pathname
      .replace(cleanBase(this.props.match.url), '')
      .split('/')
      .filter(p => p)
      .join('/')
  /* Zero based current level */
  getLevel = () => cleanBase(this.getUrl()).split('/').length - 1
  getLink = (path, level, isView) => {
    const base = this.props.match.url
    const url = this.getUrl()
    const urlParts = url.split('/')
    if (path) {
      const pathParts = path.split('/')
      if (!pathParts[0]) return cleanUrl(base + path)
      const index = urlParts.indexOf(pathParts[0])
      if (index < 0) {
        if (isView) {
          return cleanUrl(
            base + urlParts.slice(0, level + 1).join('/') + '/' + path
          )
        }
        return cleanUrl(base + url + '/' + path)
      }
      return cleanUrl(base + urlParts.slice(0, index).join('/') + '/' + path)
    }
    return cleanUrl(base + urlParts.slice(0, level + 2).join('/'))
  }
  render () {
    const { boardSwitches, aboveTablet, level } = this.state
    return (
      <Context.Provider
        value={{
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
          <BreadCrumbs
            getLink={this.getLink}
            boardSwitches={boardSwitches}
            level={level}
            {...this.props}
          />
          <Board levels={level} level={0}>
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
          {boardSwitches.map((pathObjects, i) =>
            i > level - 1 ? null : (
              <Switch key={`board-switch-${i}`}>
                {pathObjects.map(
                  ({ absolutePath, component: Component, ...props }, j) => (
                    <Route path={absolutePath} key={`route-${i}-${j}`}>
                      <Board levels={level} level={i + 1} {...props}>
                        <Component />
                      </Board>
                    </Route>
                  )
                )}
              </Switch>
            )
          )}
          {!level && this.props.children && aboveTablet ? (
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
