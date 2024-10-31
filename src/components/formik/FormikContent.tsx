import { Field, Formik } from 'formik'
import React from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from '../../contexts/theme/ThemeContext'
import { Button } from '@rneui/themed'
import i18n from '../../contexts/i18n/i18n'
import { BTN_STYLES } from '../../contexts/theme/mccTheme'

export type FormikContentProps = {
  children?: React.ReactNode
  inputs: any
  initialValues: any
  schemaValidation: any
  isLoading: boolean
  onSubmit: (values: any) => void
}

export const FormikContent = ({
  children,
  inputs,
  initialValues,
  schemaValidation,
  isLoading = false,
  onSubmit
}: FormikContentProps) => {
  const { theme } = useTheme()
  const styles = {
    padding: theme.spacing.medium
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaValidation}
      onSubmit={values => onSubmit(values)}>
      {({ handleSubmit }) => (
        <ScrollView style={styles}>
          {inputs.map((input: any) => {
            return <Field key={input.name} {...input} />
          })}
          {children}
          <Button
            title={i18n.t('save')}
            onPress={() => handleSubmit()}
            disabled={isLoading}
            loading={isLoading}
            containerStyle={{
              marginBottom: theme.spacing.xxxLarge * 2,
              ...BTN_STYLES.primary.buttonContainer
            }}
            titleStyle={BTN_STYLES.primary.buttonTitle}
            buttonStyle={BTN_STYLES.primary.buttonStyle}
          />
        </ScrollView>
      )}
    </Formik>
  )
}
