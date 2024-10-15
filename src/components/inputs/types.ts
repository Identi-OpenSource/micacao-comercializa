import { FieldProps } from 'formik'

export type InpTextProps = {
  title?: string
  description?: string
  type?: 'text' | 'number' | 'option' | 'options'
} & FieldProps<any>
