# Admin Dashboard

Use this package to automatically create a dashboard with navigation.

## Usage

```JSX
import { BrowserRouter as Router } from 'react-router-dom'
import AdminDashboard, { DashboardLink } from '@lefapps/admin-dashboard'
import { Translate } from '@lefapps/translations
import { Users, User } from 'users'

const paths = [
  {
    path: '/users',
    component: UsersList,
    label: 'Users',
    views: [
      {
        path: '/new',
        component: User,
        label: 'Create new user'
      },
      {
        path: '/:_id',
        component: User,
        label: 'editing'
      }
    ]
  }
]

const NotFound = () => <h1>404: Path not found</h1>

const Admin = () => (
  <div>
    <DashboardLink to='/users'>Users</DashboardLink>
    <DashboardLink to='/locations'>Locations</DashboardLink>
  </div>
)

const App = () => (
  <Router>
    <Switch>
      <Route path='/admin'>
        <AdminDashboard settings={paths} label={'Admin'} color={'indianred'} notFoundComponent={NotFound}>
          <Admin />
        </AdminDashboard>
      </Route>
    </Switch>
  </Router>
)
```

## Todo

* styling _[in progress]_
* Labels can accept: string, function or component
