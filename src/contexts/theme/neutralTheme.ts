import { ThemePros } from './defaultTheme'

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

const neutralTheme = {
  colors: COLORS,
  fonts: FONTS,
  statusBar: {
    backgroundColor: 'transparent',
    hidden: false,
    translucent: true,
    barStyle: 'dark-content',
    overlayColor: 'transparent'
  }
} as ThemePros

export default neutralTheme
