import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'
import { Provider as AlertProvider } from 'react-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { pathPropType, cleanBase, cleanUrl } from './helpers'
import { alertOptions } from './Alert'
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
      level: this.getLevel(),
      url: this.getUrl(),
      scope: this.getScope(),
      aboveTablet: above(768),
      maximised: false
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.trackResize)
    // defer
    setTimeout(() => {
      boardSwitcher(this.props.settings, this.props.match.url).then(
        boardSwitches => this.setState({ boardSwitches })
      )
    }, 0)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.trackResize)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        url: this.getUrl(),
        scope: this.getScope(),
        level: this.getLevel()
      })
    }
  }
  trackResize = () => {
    const resized = above(768)
    if (this.state.aboveTablet !== resized) {
      this.setState({ aboveTablet: above(768) })
    }
  }
  /* Url without base */
  getUrl = () =>
    '/' +
    this.props.location.pathname
      .replace(cleanBase(this.props.match.url), '')
      .split('/')
      .filter(p => !!p)
      .join('/')
  /* Zero based current level */
  getLevel = () => cleanBase(this.getUrl()).split('/').length - 1
  getScope = () =>
    this.getUrl()
      .split('/')
      .slice(1)
      .filter(e => !!e)
      .map((e, i, a) => (i % 2 ? a[i - 1] : e))
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
    const { scope, aboveTablet, level, maximised } = this.state
    const { settings, match } = this.props
    return (
      <AlertProvider {...alertOptions}>
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
            {`#admin-dashboard,
            #admin-dashboard__tools {
              --primary: ${
                this.props.branding && this.props.branding.color
                  ? this.props.branding.color
                  : defaultBranding.color
              } ;
              --primaryDark: ${
                this.props.branding && this.props.branding.colorDark
                  ? this.props.branding.colorDark
                  : this.props.branding && this.props.branding.color
                  ? this.props.branding.color
                  : defaultBranding.color
              } ;
            }`}
          </style>
          <div
            id='admin-dashboard'
            className={
              (this.props.darkMode ? 'dark-mode' : '') +
              (maximised && ' admin-dashboard__maximised')
            }
          >
            <BreadCrumbs
              getLink={this.getLink}
              level={level}
              scope={scope}
              {...this.props}
            />
            {this.props.allowFullscreen && (
              <button
                id={'admin-dashboard__maximised-toggle'}
                className={'btn btn-primary' + (maximised && ' active')}
                onClick={() => this.setState({ maximised: !maximised })}
              >
                <FontAwesomeIcon icon={maximised ? 'compress' : 'expand'} />
              </button>
            )}
            <Board levels={level} level={0}>
              <>
                <BoardHead title={this.props.label} />
                <BoardBody loading={!boardSwitches.length}>
                  {boardSwitches.length ? (
                    <MainMenu
                      getLink={this.getLink}
                      settings={this.props.settings}
                    />
                  ) : null}
                </BoardBody>
              </>
            </Board>
            {scope.map((scopeElement, i) => {
              const { component, views } = settings.find(
                ({ path }) => path === `/${scopeElement}`
              )
              const Component = component
              return !(i % 2) ? (
                <Board levels={level} level={i + 1} key={`board-${i + 1}`}>
                  <Component />
                </Board>
              ) : (
                <Switch key={`board-switch-${i + 1}`}>
                  {views.map(({ path: viewPath, component: ViewComponent }) => {
                    const routePath =
                      match.url +
                      '/' +
                      scope
                        .map((e, j) => (i === j ? viewPath.substring(1) : e))
                        .join('/')
                    return (
                      <Route
                        path={routePath}
                        key={`board-${i + 1}-${viewPath}`}
                      >
                        <Board levels={level} level={i + 1}>
                          <ViewComponent />
                        </Board>
                      </Route>
                    )
                  })}
                </Switch>
              )
            })}
            {!level && this.props.children && aboveTablet ? (
              <Board levels={1} level={1}>
                {this.props.children}
              </Board>
            ) : null}
          </div>
        </Context.Provider>
      </AlertProvider>
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
  notFoundComponent: PropTypes.element.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  branding: PropTypes.shape({
    color: PropTypes.string,
    colorDark: PropTypes.string,
    logo: PropTypes.string
  }),
  darkMode: PropTypes.bool,
  allowFullscreen: PropTypes.bool
}

export default withRouter(AdminDashboard)
export { withContext, BoardHead, BoardBody }
