import React from 'react'
import { NavLink } from 'react-router-dom'

import { pathPropType } from './helpers'
import { withContext } from './AdminDashboard'
import { withBoard } from './Board'

const DashboardLink = ({ to, getLink, level, children }) => {
  return <NavLink to={getLink(to, level)}>{children}</NavLink>
}

DashboardLink.propTypes = {
  to: (p, pN, cN) => pathPropType(p, pN, cN)(2)
}

export default withContext(withBoard(DashboardLink))
