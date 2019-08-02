import React from 'react'
import { NavLink } from 'react-router-dom'

const MainMenu = ({ settings, getLink }) => (
  <ul id={'admin-menu'} className={'nav flex-column'}>
    {settings
      .filter(s => !s.excludeFromMenu)
      .map(({ path, label }, key) => {
        return (
          <li className={'nav-item'} key={key}>
            <NavLink className={'nav-link'} to={getLink(path)}>
              {label}
            </NavLink>
          </li>
        )
      })}
  </ul>
)

export default MainMenu
