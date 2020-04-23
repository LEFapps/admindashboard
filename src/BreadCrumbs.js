import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Switch, Route, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isFunction from 'lodash/isFunction'

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
                to={props.getLink(null, level - 1)}
                key={`breadcrumb-${level}`}
              >
                {isFunction(label) ? label(params) : label}
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

const BreadCrumbs = ({ children, ...props }) => {
  const { label: mainLabel, getLink, levels, settings, match } = props
  return (
    <Breadcrumb id={'admin-dashboard-nav'}>
      {children}
      <Link
        className={'breadcrumb-back'}
        disabled={levels === 0}
        to={getLink(false, levels - 2)}
      >
        <FontAwesomeIcon icon='arrow-left' />
      </Link>
      <BreadcrumbItem active={levels === 0} to={getLink('')}>
        {mainLabel}
      </BreadcrumbItem>
      <Level
        {...props}
        level={1}
        defaultItems={settings}
        items={settings}
        url={match.url}
      />
    </Breadcrumb>
  )
}

export default BreadCrumbs
