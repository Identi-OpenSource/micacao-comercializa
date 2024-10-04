import { Dialog, Text } from '@rneui/themed'
import React from 'react'

interface DialogProps {
  visible: boolean
  title: string
  message: string
  onClose: () => void
}

const DialogComponent: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  onClose
}) => {
  return (
    <Dialog isVisible={visible} onBackdropPress={onClose}>
      <Dialog.Title title={title} />
      <Text>{message}</Text>
      <Dialog.Actions>
        <Dialog.Button title="Aceptar" onPress={onClose} />
      </Dialog.Actions>
    </Dialog>
  )
}

export default DialogComponent
