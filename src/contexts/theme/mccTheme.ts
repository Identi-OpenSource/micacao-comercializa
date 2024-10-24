import { TextStyle, ViewStyle } from 'react-native'
import { ThemePros } from './defaultTheme'

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
  background: '#ffffff',
  text: '#333333',
  buttonBackground: '#666666',
  buttonText: '#ffffff',
  inputBackground: '#e0e0e0',
  inputText: '#333333',
  grayOpacity: 'rgba(0, 0, 0, 0.3)'
}

export const FONTS = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold'
}

export const BTN_STYLES = {
  primary: {
    buttonContainer: {
      width: '100%',
      marginTop: SPACING.xLarge,
      paddingHorizontal: SPACING.small
    } as ViewStyle,
    buttonTitle: {
      fontWeight: '700',
      fontFamily: FONTS.bold
    } as TextStyle,
    buttonStyle: {
      backgroundColor: COLORS.primary,
      borderRadius: 5,
      paddingVertical: 10,
      height: 60
    } as ViewStyle
  }
}

export const INPUTS_STYLES = {
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 10
  } as TextStyle,
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.text
  },
  inp: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    opacity: 0.6
  } as TextStyle,
  impContainer: {
    borderColor: COLORS.primary,
    borderBottomWidth: 1
  } as ViewStyle,
  inpOpt: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    opacity: 0.6
  } as TextStyle
}

const mccTheme = {
  spacing: SPACING,
  colors: COLORS,
  fonts: FONTS,
  statusBar: {
    backgroundColor: 'transparent',
    hidden: false,
    translucent: true,
    barStyle: 'dark-content',
    overlayColor: 'transparent'
  },
  inputs: {
    styles: INPUTS_STYLES
  }
} as ThemePros

export default mccTheme
