import React from 'react'
import { NavLink } from 'react-router-dom'

import { pathPropType } from './helpers'
import { withContext } from './AdminDashboard'
import { withBoard } from './Board'

const DashboardLink = ({ to, view, getLink, level, children, ...props }) => {
  return (
    <NavLink to={getLink(to || view, level, !!view)} {...props}>
      {children}
    </NavLink>
  )
}

DashboardLink.propTypes = {
  to: (p, pN, cN) => pathPropType(p, pN, cN)(2),
  view: (p, pN, cN) => pathPropType(p, pN, cN)(1)
}

export default withContext(withBoard(DashboardLink))
