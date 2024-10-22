import React from 'react'
import useCustomHttpRequest from '../../../hooks/useCustomHttpRequest'
import { useSecureStorage } from '../../../contexts/secure/SecureStorageContext'
import useMessageHandler from '../../../hooks/useErrorHandler'
import Config from 'react-native-config'
import { AxiosError } from 'axios'
import { AuthResponse } from '../../../db/models/Auth'
import { API_CONFIG } from '../../../config/apis'
import i18n from '../../../contexts/i18n/i18n'
import { FormikHelpers, useFormik } from 'formik'
import { Button, Image, Input, Text } from '@rneui/themed'
import { Dimensions, StyleSheet, View } from 'react-native'
import * as Yup from 'yup'
import { COLORS } from '../../../contexts/theme/defaultTheme'
import { useQuery, useRealm } from '@realm/react'
import { CONST_USER, User } from '../../../db/models/UserSchema'
// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

export const ChangePassword = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { patch } = useCustomHttpRequest()
  const { getDataJWT } = useSecureStorage()
  const { handleErrorMessage, handleMessage } = useMessageHandler()
  const realm = useRealm()
  const uuid = getDataJWT()?.uuid
  const userData = useQuery<User>('User').filtered('uuid == $0', uuid)[0]

  const formik = useLoginFormik(async values => {
    try {
      setIsLoading(true)
      const data = {
        ...values,
        channel: Config.CHANNEL_APP,
        tenant: '',
        country: ''
      }
      await patch<AuthResponse>(API_CONFIG.Auth.changePassword, data)
      await changeStatusPass()
    } catch (err) {
      handleErrorMessage(err as AxiosError)
    } finally {
      setIsLoading(false)
    }
  })

  const changeStatusPass = async () => {
    try {
      if (userData) {
        realm.write(() => {
          userData.user_status = CONST_USER.status.confirmed
        })
      }
      handleMessage('success', 'saveSuccess')
    } catch (error) {
      console.error('changeStatusPass =>', error)
      handleErrorMessage(error as AxiosError)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} />
        <Text style={styles.text}>{i18n.t('changePassword')}</Text>
      </View>

      <View style={styles.formikContainer}>
        <FormInput
          field="password"
          formik={formik}
          secureTextEntry
          placeholder={i18n.t('password')}
        />
        <FormInput
          field="repassword"
          formik={formik}
          secureTextEntry
          placeholder={i18n.t('repassword')}
        />
        <FormButton
          title={i18n.t('changePasswordBtn', { modifier: 'uppercase' })}
          isLoading={isLoading}
          onPress={formik.handleSubmit}
        />
      </View>
    </View>
  )
}

// Definición de los tipos de valores del formulario
interface LoginValues {
  password: string
  repassword: string
}

// Validación con Yup
const getLoginSchema = () => {
  return Yup.object().shape({
    password: Yup.string()
      .min(6, i18n.t('minLengthString', { values: { minLength: 6 } }))
      .max(20, i18n.t('maxLengthString', { values: { maxLength: 20 } }))
      .required(i18n.t('required')),
    repassword: Yup.string()
      .oneOf([Yup.ref('password')], i18n.t('passwordNotMatch'))
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
      password: '',
      repassword: ''
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
    height: 160,
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
  },
  text: {
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.text,
    marginTop: 10
  }
})
