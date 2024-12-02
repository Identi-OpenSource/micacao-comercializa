import React from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Image, Text } from '@rneui/themed'
import { COLORS } from '../../../contexts/theme/neutralTheme'
import i18n from '../../../contexts/i18n/i18n'
import { FONTS, SPACING } from '../../../contexts/theme/mccTheme'
import { useNavigation } from '@react-navigation/native'

// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

// Función principal del LoginScreen
export const ResetPassScreen: React.FC = () => {
  const navigation = useNavigation<any>()
  return (
    <ScrollView style={[styles.container]} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} />
      </View>
      <Text h4 style={styles.title}>
        {i18n.t('welcome')}
      </Text>
      <View style={styles.formikContainer}>
        <Text style={styles.text}>{i18n.t('restPassText')}</Text>
        <FormButton
          title={i18n.t('continue', { modifier: 'capitalize' })}
          onPress={() => navigation.navigate('ChangePass')}
        />
        <FormButton
          title={i18n.t('cancel', { modifier: 'capitalize' })}
          onPress={() => navigation.goBack()}
          type="cancel"
        />
      </View>
    </ScrollView>
  )
}

// Tipos para el componente FormButton
interface FormButtonProps {
  title: string
  isLoading?: boolean
  onPress: () => void
  type?: 'cancel'
}

// Componente de Botón
const FormButton: React.FC<FormButtonProps> = ({
  title,
  isLoading,
  onPress,
  type = null
}) => {
  return (
    <Button
      title={title}
      loading={isLoading}
      onPress={onPress}
      loadingProps={{ size: 'small', color: COLORS.white }}
      titleStyle={[
        styles.buttonTitle,
        type === 'cancel' && styles.buttonTitleCancel
      ]}
      buttonStyle={[
        styles.buttonStyle,
        type === 'cancel' && styles.buttonStyleCancel
      ]}
      containerStyle={styles.buttonContainer}
    />
  )
}

// Estilos
const styles = StyleSheet.create({
  title: {
    marginTop: SPACING.xLarge,
    textAlign: 'center',
    color: COLORS.primary
  },
  text: {
    fontSize: 18,
    lineHeight: 34,
    paddingVertical: SPACING.large,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: COLORS.background
  },
  logoContainer: {
    marginTop: width * 0.2,
    alignItems: 'center',
    height: 100,
    width
  },
  logo: {
    width,
    height: 150,
    resizeMode: 'contain'
  },
  formikContainer: {
    marginTop: width * 0.1,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.xLarge,
    paddingHorizontal: SPACING.small
  },
  buttonStyleCancel: {
    backgroundColor: 'transparent'
  },
  buttonStyle: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    height: 60
  },
  buttonTitle: {
    fontWeight: '700'
  },
  buttonTitleCancel: {
    color: COLORS.inputText
  },
  inputContainer: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.small
  },
  input: {
    color: COLORS.primary,
    fontSize: 16
  },
  version: {
    marginVertical: SPACING.xxxLarge * 2,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: COLORS.grayOpacity,
    fontSize: 12
  },
  btnResetPassContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.small
  },
  btnResetPass: {
    height: 40,
    justifyContent: 'center'
  },
  textBtnResetPass: {
    fontSize: 14,
    color: COLORS.buttonBackground
  }
})
