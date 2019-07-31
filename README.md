# Admin Dashboard

Use this package to automatically create a dashboard with navigation.

## Usage

```JSX
import { BrowserRouter as Router } from 'react-router-dom'
import AdminDashboard, { DashboardLink } from '@lefapps/admin-dashboard'
import { Translate } from '@lefapps/translations'
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

const branding = {
  color: 'indianred', // color should be dark enough, used as background for white text
  logo: 'https://my.cdn/images/logo.png'
}

const FirstBoard = () => (
  <div>
    <DashboardLink to='/users'>Users</DashboardLink>
    <DashboardLink to='/locations'>Locations</DashboardLink>
  </div>
)

const App = () => (
  <Router>
    <Switch>
      <Route path='/admin'>
        <AdminDashboard
          settings={paths}
          label={'Admin'}
          branding={branding}
          notFoundComponent={NotFound}
        >
          <FirstBoard />
        </AdminDashboard>
      </Route>
    </Switch>
  </Router>
)
```

## Components

### BoardHead & BoardBody

```JSX
import { DashboardLink, BoardHead, BoardBody } from '@lefapps/admin-dashboard'

const Users = ({loading, users}) => {
  const userContent = `${users.length} user(s)`
  const userActions = [
    <button className={'btn'} onClick={goBack} title={'back -- used as tooltip'}>‹</button>,
    <DashboardLink className={'btn btn-lg'} to={'/users/add'} title={'Add a new user'}>+</DashboardLink>
  ]
  return (<>
    <BoardHead title={'Users'} content={userContent} actions={userActions}>
      <p>Some optional text, which will be shown below "userContent".</p>
    </BoardHead>
    <BoardBody loading={loading}>
      <ul>
        {loading ? null : users.map(user => <li>{user.name}</li>)}
      </ul>
    </BoardBody>
  </>
)}
```

### AdminTools

Use this component to wrap components to show up on the right-hand side of the breadcrumbs, e.g.: language selection or sign-out button. Correct styling will be provided. Raise an issue or pull request for specific styling issues.

```JSX
import { AdminTools } from '@lefapps/admin-dashboard'
import { PickLanguage } from 'meteor/lef:translations'
import UserMenu from 'meteor/lef:userui'

const App = props => (
  <Router>
    <>
      <AdminDashboard {...props} />
      <AdminTools>
        <PickLanguage />
        <UserMenu />
      </AdminTools>
    </>
  </Router>
)
```

## Todo

* Way to get path to use in DashboardLink.to
* Labels can accept: string, function or component
