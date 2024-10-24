import React from 'react'
import { View } from 'react-native'
import { InpTextProps } from '../types'
import { Input } from '@rneui/base'
import { COLORS, INPUTS_STYLES } from '../../../contexts/theme/mccTheme'

export const InpText = (props: InpTextProps) => {
  const {
    field: { onBlur, name },
    form: { errors, touched, setFieldValue }
  } = props
  const input = React.useRef<any>(null)

  const isError = errors[name] !== undefined && touched[name]

  return (
    <View>
      <Input
        ref={input}
        label={props?.title}
        placeholder={props?.description}
        inputMode={props?.inputMode ?? 'none'}
        onChangeText={text => setFieldValue(name, text)}
        onBlur={onBlur(name)}
        errorMessage={isError ? (errors[name] as string) : undefined}
        labelProps={{ style: INPUTS_STYLES.title }}
        inputStyle={INPUTS_STYLES.inp}
        inputContainerStyle={INPUTS_STYLES.impContainer}
        placeholderTextColor={COLORS.grayOpacity}
      />
    </View>
  )
}
