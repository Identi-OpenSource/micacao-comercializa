import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Button, Image, Input } from '@rneui/themed'
import { useFormik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { COLORS } from '../../../contexts/theme/neutralTheme'
import i18n from '../../../contexts/i18n/i18n'
import useCustomHttpRequest from '../../../hooks/useCustomHttpRequest'
import { API_CONFIG } from '../../../config/apis'
import Config from 'react-native-config'
import useErrorHandler from '../../../hooks/useErrorHandler'
import { AxiosError } from 'axios'
import useSecureStorage from '../../../hooks/useSecureStorage'
import { KEYS_MMKV } from '../../../db/mmkv'
import { AuthResponse } from '../../../db/models/Auth'
import { useAuthLocal } from '../../../contexts/auth/AuthContext'

// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

// Función principal del LoginScreen
export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { post } = useCustomHttpRequest()
  const { setItem } = useSecureStorage()
  const handleError = useErrorHandler()
  const { login } = useAuthLocal()

  const formik = useLoginFormik(async values => {
    try {
      setIsLoading(true)
      const data = {
        ...values,
        channel: Config.CHANNEL_APP,
        tenant: '',
        country: ''
      }
      const resp = await post<AuthResponse>(API_CONFIG.Auth.login, data)
      setItem(KEYS_MMKV.ACCESS_TOKEN, resp.data.access_token)
      setItem(KEYS_MMKV.REFRESH_TOKEN, resp.data.refresh_token)
      await login(resp?.data?.access_token)
    } catch (err) {
      handleError(err as AxiosError)
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} />
      </View>

      <View style={styles.formikContainer}>
        <FormInput
          field="username"
          formik={formik}
          placeholder={i18n.t('username')}
        />
        <FormInput
          field="password"
          formik={formik}
          secureTextEntry
          placeholder={i18n.t('password')}
        />
        <FormButton
          title={i18n.t('sign_up', { modifier: 'uppercase' })}
          isLoading={isLoading}
          onPress={formik.handleSubmit}
        />
      </View>
    </View>
  )
}

// Definición de los tipos de valores del formulario
interface LoginValues {
  username: string
  password: string
}

// Validación con Yup
const getLoginSchema = () => {
  return Yup.object().shape({
    username: Yup.string()
      .min(2, i18n.t('minLengthString', { values: { minLength: 2 } }))
      .max(50, i18n.t('maxLengthString', { values: { maxLength: 50 } }))
      .required(i18n.t('required')),
    password: Yup.string()
      .min(6, i18n.t('minLengthString', { values: { minLength: 8 } }))
      .required(i18n.t('required'))
  })
}

// Función para crear el hook formik con tipado
const useLoginFormik = (
  onSubmit: (
    values: LoginValues,
    formikHelpers: FormikHelpers<LoginValues>
  ) => void
) => {
  return useFormik<LoginValues>({
    initialValues: {
      username: /* '', */ 'mmcdonald',
      password: /* '', */ '3whsd8'
    },
    validationSchema: getLoginSchema(),
    onSubmit
  })
}

// Tipos para el componente FormInput
interface FormInputProps {
  placeholder: string
  field: keyof LoginValues
  formik: ReturnType<typeof useLoginFormik>
  secureTextEntry?: boolean
}

// Componente de Input
const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  field,
  formik,
  secureTextEntry = false
}) => {
  return (
    <Input
      placeholder={placeholder}
      onChangeText={formik.handleChange(field)}
      onBlur={formik.handleBlur(field)}
      value={formik.values[field]}
      secureTextEntry={secureTextEntry}
      errorMessage={
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : undefined
      }
    />
  )
}

// Tipos para el componente FormButton
interface FormButtonProps {
  title: string
  isLoading: boolean
  onPress: () => void
}

// Componente de Botón
const FormButton: React.FC<FormButtonProps> = ({
  title,
  isLoading,
  onPress
}) => {
  return (
    <Button
      title={title}
      loading={isLoading}
      onPress={onPress}
      loadingProps={{ size: 'small', color: COLORS.white }}
      titleStyle={styles.buttonTitle}
      buttonStyle={styles.buttonStyle}
      containerStyle={styles.buttonContainer}
    />
  )
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    marginTop: width * 0.2,
    alignItems: 'center',
    height: 100,
    width
  },
  logo: {
    width: width * 0.6,
    height: 100,
    resizeMode: 'contain'
  },
  formikContainer: {
    marginTop: width * 0.1,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  buttonContainer: {
    width: '100%',
    marginTop: width * 0.1,
    paddingHorizontal: 10
  },
  buttonStyle: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    height: 50
  },
  buttonTitle: {
    fontWeight: '700'
  }
})
