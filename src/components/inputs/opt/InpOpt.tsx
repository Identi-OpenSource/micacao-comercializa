import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { InpTextProps } from '../types'
import { Input } from '@rneui/base'
import { Dialog, ListItem } from '@rneui/themed'

export const InpOpt = (props: InpTextProps) => {
  const [visible, setVisible] = useState(false)
  const {
    field: { onBlur, name, value },
    form: { errors, touched, setFieldValue }
  } = props
  const input = React.useRef<any>(null)
  const isError = errors[name] !== undefined && touched[name]

  const onPressItem = (val: { id: string; label: string }) => {
    setFieldValue(name, val)
    setVisible(!visible)
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(!visible)} activeOpacity={1}>
        <Input
          ref={input}
          label={props?.title}
          placeholder={props?.description}
          inputMode={props?.inputMode ?? 'none'}
          disabled={props?.disabled ?? true}
          value={value?.label ?? ''}
          onChangeText={text => setFieldValue(name, text)}
          onBlur={onBlur(name)}
          errorMessage={isError ? (errors[name] as string) : undefined}
        />
      </TouchableOpacity>
      <Dialog isVisible={visible} overlayStyle={styles.overlay}>
        <Dialog.Title title={props?.title} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {props?.options?.map(item => (
            <ListItem key={item?.id} onPress={() => onPressItem(item?.value)}>
              <ListItem.Content>
                <ListItem.Title>{item?.label}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    maxHeight: '90%'
  }
})
