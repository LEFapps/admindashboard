// import React, { Component } from 'react'
// import {
//   Collapse,
//   Navbar,
//   NavbarToggler,
//   NavbarBrand,
//   Nav,
//   NavItem,
//   NavLink,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem
// } from 'reactstrap'
// import { Link } from 'react-router-dom'

// const SubNav = props => {
//   console.log(props)
//   const { path, title, sub, url, pathname } = props
//   return (
//     <UncontrolledDropdown nav inNavbar>
//       <DropdownToggle nav caret>
//         {title}
//       </DropdownToggle>
//       <DropdownMenu>
//         <DropdownItem>

//         <Link
//           className={`dropdown-item ${
//             url + path === pathname ? 'active' : null
//           }`}
//           to={url + path}
//           >
//           {title}
//         </Link>
//           </DropdownItem>
//         {sub.map(el => (
//           <DropdownItem>
//             {el.sub ? (
//               <SubNav
//                 {...el}
//                 url={url + path}
//                 pathname={pathname}
//                 key={`admin-dashboard-${el.path}`}
//               />
//             ) : (
//                 <Link
//                   className={`dropdown-item ${
//                     url + path + el.path === pathname ? 'active' : null
//                     }`}
//                   to={url + path + el.path}
//                   key={`admin-dashboard-${el.path}`}
//                 >
//                   {el.title}
//                 </Link>}
//               </DropdownItem>)
//         )}
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   )
// }

// class Navigation extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       isOpen: false
//     }
//   }
//   toggle = () => {
//     this.setState({
//       isOpen: !this.state.isOpen
//     })
//   }
//   render () {
//     const {
//       settings,
//       match: { url },
//       location: { pathname }
//     } = this.props
//     return (
//       <Navbar color='dark' dark expand='md'>
//         <NavbarToggler onClick={this.toggle} />
//         <Collapse isOpen={this.state.isOpen} navbar>
//           <Nav navbar>
//             {settings.map(el => {
//               return el.sub && el.sub.length ? (
//                 <SubNav
//                   {...el}
//                   url={url}
//                   pathname={pathname}
//                   key={`admin-dashboard-${el.path}`}
//                 />
//               ) : (
//                 <NavItem>
//                   <Link
//                     className={`nav-link ${
//                       url + el.path === pathname ? 'active' : null
//                     }`}
//                     key={`admin-dashboard-${el.path}`}
//                   >
//                     {el.title}
//                   </Link>
//                 </NavItem>
//               )
//             })}
//           </Nav>
//         </Collapse>
//       </Navbar>
//     )
//   }
// }

// export default Navigation
