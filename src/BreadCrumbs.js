import React from 'react'
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

const BreadCrumbs = ({ label: mainLabel, getLink, boardSwitches, level }) => {
  return (
    <Breadcrumb id={'admin-dashboard-nav'}>
      <Link
        className={'breadcrumb-back'}
        disabled={!level}
        to={getLink(false, level - 2)}
      >
        <FontAwesomeIcon icon='arrow-left' />
      </Link>
      <BreadcrumbItem active={!level} to={getLink('')}>
        {mainLabel}
      </BreadcrumbItem>
      {boardSwitches.map((pathObjects, i) => (
        <Switch key={`breadcrumb-switch-${i}`}>
          {pathObjects.map(({ absolutePath, label }, j) => {
            return (
              <Route path={absolutePath} key={`breadcrumb-route-${i}-${j}`}>
                <BreadcrumbItem active={i + 1 === level} to={getLink(null, i)}>
                  {label}
                </BreadcrumbItem>
              </Route>
            )
          })}
        </Switch>
      ))}
    </Breadcrumb>
  )
}

export default BreadCrumbs
