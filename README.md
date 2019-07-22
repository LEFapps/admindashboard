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

const logoURL = 'https://my.cdn/images/logo.png'; // optional

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
        <AdminDashboard settings={paths} label={'Admin'} color={'indianred'} logo={logoURL} notFoundComponent={NotFound}>
          <Admin />
        </AdminDashboard>
      </Route>
    </Switch>
  </Router>
)
```

## Components

### BoardHead & BoardBody

```JSX
import { BoardHead, BoardBody } from '@lefapps/admin-dashboard'

const Users = ({users}) => {
  const userContent = `${users.length} user(s)`
  const userActions = [
    <button onClick={addUser}>+</button>
    <button onClick={clearUsers}>-</button>
  ]
  return (<>
    <BoardHead title={'Users'} content={userContent} actions={userActions}>
      <p>Some optional text.</p>
    </BoardHead>
    <BoardBody>
      <ul>
        {users.map(user => <li>{user.name}</li>)}
      </ul>
    </BoardBody>
  </>
)}
```

## Todo

* styling _[in progress]_
* Labels can accept: string, function or component
