import { FieldProps } from 'formik'
import React from 'react'
export type InpTypes = {
  id: string
  name: string
  title: string
  description: string
  type: string
  component?: React.FC<any>
  inputMode?: string
  disabled?: boolean
  options?: {
    id: string
    label: string
    value: { id: string; label: string }
  }[]
}

export type InpTextProps = {
  title?: string
  description?: string
  disabled?: boolean
  inputMode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url'
  type?: 'text' | 'number' | 'option' | 'options'
} & InpTypes &
  FieldProps<any>
