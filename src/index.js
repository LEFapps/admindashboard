import AdminDashboard, { BoardHead, BoardBody } from './AdminDashboard'
import { Tools as AdminTools } from './BoardParts'
import DashboardLink from './DashboardLink'
import AdminAlerts, { withAlert } from './Alert'
import './dashboard.css'

export default AdminDashboard
export {
  DashboardLink,
  BoardHead,
  BoardBody,
  AdminTools,
  AdminAlerts,
  withAlert
}
