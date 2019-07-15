import React from 'react'
import { Link } from 'react-router-dom'

import { pathPropType } from './helpers'
import { withContext } from './AdminDashboard'
import { withBoard } from './Board'

const DashboardLink = ({ to, getLink, level, children }) => {
  return <Link to={getLink(to, level)}>{children}</Link>
}

DashboardLink.propTypes = {
  to: (p, pN, cN) => pathPropType(p, pN, cN)(2)
}

export default withContext(withBoard(DashboardLink))
