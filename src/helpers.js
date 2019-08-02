const pathPropType = (props, propName, componentName) => {
  return (levels = 1) => {
    if (!new RegExp(`^(\/?[^\/]+){1,${levels}}$`).test(props[propName])) {
      return new Error(
        `Invalid prop '${propName}' supplied to ${componentName}. Prop '${propName}' should be a path with maximum ${levels} level${
          levels > 1 ? 's' : ''
        }: e.g. "${'/path'.repeat(levels)}"`
      )
    }
  }
}

const cleanBase = path => (path === '/' ? '' : path)
const cleanUrl = path => path.replace(/\/\//, '/')

export { pathPropType, cleanBase, cleanUrl }
