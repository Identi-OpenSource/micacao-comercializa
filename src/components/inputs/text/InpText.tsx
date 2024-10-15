import React from 'react'
import { Text, View } from 'react-native'
import { InpTextProps } from '../types'
import { useTheme } from '../../../contexts/theme/ThemeContext'
import { Input } from '@rneui/base'

export const InpText = (props: InpTextProps) => {
  const {
    field: { onBlur, value, name },
    form: { errors, touched, setFieldValue }
  } = props
  const input = React.useRef<any>(null)
  const { theme } = useTheme()
  const { styles } = theme.inputs

  const isError = errors[name] !== undefined && touched[name]
  console.log('value', value)
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>
      <Input
        ref={input}
        placeholder={props.description}
        onChangeText={text => setFieldValue(name, text)}
        onBlur={onBlur(name)}
        errorMessage={isError ? (errors[name] as string) : undefined}
      />
    </View>
  )
}
