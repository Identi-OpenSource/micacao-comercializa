import { StatusBarProps } from 'react-native'
import neutralTheme from './neutralTheme'

export interface ThemePros {
  colors: {
    primary: string
    background: string
    text: string
    buttonBackground: string
    buttonText: string
    inputBackground: string
    inputText: string
  }
  fonts: {
    regular: string
    bold: string
  }
  statusBar: StatusBarProps
}

export default neutralTheme
