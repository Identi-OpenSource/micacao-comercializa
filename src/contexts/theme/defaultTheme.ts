import { StatusBarProps, StyleProp, TextStyle } from 'react-native'
import neutralTheme from './neutralTheme'

export type INPUTS_STYLES = {
  title: StyleProp<TextStyle>
  description: StyleProp<TextStyle>
  inp: StyleProp<TextStyle>
}

export interface ThemePros {
  spacing: {
    tiny: number
    xSmall: number
    small: number
    medium: number
    large: number
    xLarge: number
    xxLarge: number
    xxxLarge: number
  }
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
  inputs: {
    styles: INPUTS_STYLES
  }
}

export const SPACING = {
  tiny: 2,
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
  xxLarge: 30,
  xxxLarge: 40
}

export const COLORS = {
  white: '#ffffff',
  primary: '#09304F',
  background: '#f0f0f0',
  text: '#333333',
  buttonBackground: '#666666',
  buttonText: '#ffffff',
  inputBackground: '#e0e0e0',
  inputText: '#333333'
}

export const FONTS = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold'
}

export default neutralTheme
