import React from 'react'
import { Switch, Route } from 'react-router-dom'

const Router = ({ settings, match: { url } }) => (
  <Switch>
    {settings.map(({ path, title, component }) => {
      return (
        <Route
          key={`admin-dashboard-${url + path}`}
          path={url + path}
          component={component}
        />
      )
    })}
  </Switch>
)

export default Router
