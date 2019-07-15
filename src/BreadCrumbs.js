import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Switch, Route, withRouter } from 'react-router-dom'

const Item = withRouter(
  ({
    path,
    level,
    levels,
    pathArray,
    settings,
    getLink,
    match: { params }
  }) => {
    if (!path) return null
    const crumbs = []
    const splitPath = path.split('/')
    const pathObj = settings.find(
      settings => settings.path === `/${splitPath[1]}`
    )
    crumbs.push({
      path: pathObj.path,
      label: pathObj.label,
      key: 'a',
      active: splitPath[2] ? false : levels === level
    })
    if (splitPath[2]) {
      const viewObj = pathObj.views.find(
        views => views.path === `/${splitPath[2]}`
      )
      const pKey = Object.keys(params)[0]
      crumbs.push({
        path: pathObj.path + viewObj.path.replace(`:${pKey}`, params[pKey]),
        label: viewObj.label,
        key: 'b'
      })
    }
    return crumbs.map(crumb => (
      <BreadcrumbItem
        active={levels === level}
        key={`breadcrumb-${level}${crumb.key}`}
      >
        {crumb.active ? (
          crumb.label
        ) : (
          <Link to={getLink(crumb.path, level)}>{crumb.label}</Link>
        )}
      </BreadcrumbItem>
    ))
  }
)

const BreadCrumbs = ({
  label: mainLabel,
  getLink,
  boardSwitches,
  ...props
}) => {
  if (!boardSwitches) return null
  return (
    <Breadcrumb>
      <BreadcrumbItem active={boardSwitches.length === 0}>
        {boardSwitches.length === 0 ? (
          mainLabel
        ) : (
          <Link to={getLink('', 0)}>{mainLabel}</Link>
        )}
      </BreadcrumbItem>
      {boardSwitches.map((pathObjects, i, { length }) => (
        <Switch key={`breadcrumb-switch-${i}`}>
          {pathObjects.map(({ absolutePath, path, label }, j) => {
            return (
              <Route path={absolutePath} key={`breadcrumb-route-${i}-${j}`}>
                <BreadcrumbItem active={i + 1 === length}>
                  {i + 1 === length || !path ? (
                    label
                  ) : (
                    <Link to={getLink(path, length + 1)}>{label}</Link>
                  )}
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
