import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Switch, Route, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Breadcrumb = ({ children, id, className }) => (
  <nav aria-label='breadcrumb' id={id} className={className}>
    <ol className='breadcrumb'>{children}</ol>
  </nav>
)

const BreadcrumbItem = ({ active, children, id, className, to }) => (
  <li
    className={`breadcrumb-item${active ? ' active' : ''} ${className || ''}`}
    id={id}
    aria-current={active ? 'page' : false}
  >
    {active ? children : <Link to={to || ''}>{children}</Link>}
  </li>
)

const Level = ({ items = [], level, url, ...props }) => (
  <Switch>
    {items.map(({ path, label, views = [] }) => {
      const nextPath = url + path
      const nextItems = (views && views.length && views) || props.defaultItems
      return (
        <Route
          key={nextPath}
          path={nextPath}
          render={withRouter(({ match: { params } }) => (
            <Fragment>
              <BreadcrumbItem
                active={level === props.levels}
                to={props.getLink(null, level)}
                key={`breadcrumb-${level}`}
              >
                {label}
              </BreadcrumbItem>
              <Level
                {...props}
                url={nextPath}
                items={nextItems}
                level={level + 1}
              />
            </Fragment>
          ))}
        />
      )
    })}
  </Switch>
)

const BreadCrumbs = props => {
  const { label: mainLabel, getLink, level, scope, settings, match } = props
  return (
    <Breadcrumb id={'admin-dashboard-nav'}>
      <Link
        className={'breadcrumb-back'}
        disabled={!level}
        to={getLink(false, level - 2)}
      >
        <FontAwesomeIcon icon='arrow-left' />
      </Link>
      <BreadcrumbItem active={level === 0} to={getLink('')}>
        {mainLabel}
      </BreadcrumbItem>
      <Level
        {...props}
        defaultItems={settings}
        items={settings}
        url={match.url}
      />
      {/* {scope.map((scopeElement, i) => {
        const { label, views } = settings.find(
          ({ path }) => path === `/${scopeElement}`
        )
        return !(i % 2) ? (
          <BreadcrumbItem
            active={i + 1 === level}
            to={getLink(null, i)}
            key={`breadcrumb-${i}`}
          >
            {label}
          </BreadcrumbItem>
        ) : (
          <Switch key={`breadcrumb-switch-${i + 1}`}>
            {views.map(({ path: viewPath, label: viewLabel }) => {
              const routePath =
                match.url +
                '/' +
                scope
                  .map((e, j) => (i === j ? viewPath.substring(1) : e))
                  .join('/')
              return (
                <Route path={routePath} key={`board-${i + 1}-${viewPath}`}>
                  <BreadcrumbItem
                    active={i + 1 === level}
                    to={getLink(null, i)}
                  >
                    {viewLabel}
                  </BreadcrumbItem>
                </Route>
              )
            })}
          </Switch>
        )
      })} */}
    </Breadcrumb>
  )
}

export default BreadCrumbs
