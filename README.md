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

const WelcomeBoard = () => (
  <>
    <BoardHead title={'Welcome'} />
    <BoardBody>
      <Translate _id='home_page' md />
    </BoardBody>
  </>
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
          <WelcomeBoard />
        </AdminDashboard>
      </Route>
    </Switch>
  </Router>
)
```

## Components

### DashboardLink

prop | required | type | info
--- | --- | --- | ---
`to` | yes<sup>1</sup> | String | path to which you would like to link<br>max 2 levels<sup>2</sup>
`view` | yes<sup>1</sup> | String | use only when linking to a view (sub level) from it’s root level<br>only accepts string without `/`
`...props` | no | Object | Add additional props like className, title, …

1. `to` or `view` are required, neither both nor none
2. prop should match `/^(\/?[^\/]+){1,${levels}}$/`

```JSX
import { DashboardLink } from '@lefapps/admin-dashboard'

// ROUTE: /users
const Users = users => (
  <ol>
    {users.map(({ _id, name }, i) => (
      <li key={i}>
        <DashboardLink view={_id}>{name}</id>
      </li>
    ))}
  </ol>
)

// ROUTE: /users/_id
const User = ({ _id, name }) => (
  <>
    <h3>{name}</h3>
    <p>
      This link will create a deeper level which can use the url parameters from its preceding boards
      ROUTE will be "/users/_id/articles" where you can use _id to filter the articles
      <DashboardLink to={'articles'}>view list ››</DashboardLink>
    </p>
    <small>
      This link will not create a deeper level since we already have a 'users' path
      ROUTE will be "/users"
      <DashboardLink to={'users'}>‹‹ back to all users</DashboardLink>
    </small>
  </>
)
```

### BoardHead & BoardBody

Head | required | type | info
--- | --- | --- | ---
`title` | | String<br>Component | Title to show on top of the board
`content` | | String<br>Component | Text to display below the title
`actions` | | Array | Buttons/links/… which are shown on the right. To ensure a nice layout, use icons as content. Use the `[title]` attribute to populate a tooltip below the action.<br>(Note: apply `key` props to each element to prevent React warnings)
`children` | | String<br>Component | Text to display below title and content<br>_similar to `content`_

Body | required | type | info
--- | --- | --- | ---
`loading` | | Boolean | Shows a spinner while your body content is loading.<br>This prop does not prevent rendering!
`children` | | String<br>Component | Content to display inside the Board.

```JSX
import { DashboardLink, BoardHead, BoardBody } from '@lefapps/admin-dashboard'

const Users = ({loading, users}) => {
  const headProps = {
    title: 'Users',
    content: `${users.length} user(s)`,
    actions: [<button
      className={'btn'}
      onClick={goBack}
      title={'back -- used as tooltip'}
      key={0}>‹</button>,
    <DashboardLink
      className={'btn btn-lg'}
      to={'/users/add'}
      title={'Add a new user'}
      key={1}>+</DashboardLink>
    ]
  }
  return (<>
    <BoardHead {...headProps}>
      <p>Some optional text, which will be shown below "content".</p>
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
    <Route path={'/admin'}>
      <AdminDashboard {...props} />
      <AdminTools>
        <UserMenu />
        <PickLanguage />
      </AdminTools>
    </Route>
  </Router>
)
```

## API

### getLink

**Footprint: `const targetPath = getLink(path, level, isView)`**

Usage:

`/base` is the route where your Dashboard lives, e.g. "/admin"

```JSX
const Comp = ({ getLink }) => {
  getLink('/path') // /base/path
  getLink('path') // /base/other/levels/path or /base/path
  getLink('id', null, true) // /base/level/id
  getLink(null, 3) // /base/level-1/level-2/level-3
}

withContext(<Comp />)
```

### getUrl

Returns current url, without "/base".

### getLevel

Returns current level, which is zero-based.

- Home view: `level = 0`
- Three panels deep: `level = 2`

Level is also stored in the state of the AdminDashboard component.

## Todo

* Labels can accept: string, function or component
