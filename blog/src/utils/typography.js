import Typography from 'typography'
import funstonTheme from 'typography-theme-funston'
import CodePlugin from 'typography-plugin-code'

funstonTheme.plugins = [
  new CodePlugin(),
]
const typography = new Typography(funstonTheme)

export default typography
