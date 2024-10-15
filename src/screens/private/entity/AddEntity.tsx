import { RouteProp, useRoute } from '@react-navigation/native'
import { Text } from '@rneui/base'
import React from 'react'
import { useModuleById, useRealmQueries } from '../../../hooks/useRealmQueries'
import { RootStackParamList } from '../../../router/private'
import { useTools } from '../../../hooks/useTools'
import { FormikContent } from '../../../components/formik/FormikContent'

export const AddEntity = () => {
  const { getModuleSchemaById } = useRealmQueries()
  const { instructionOrderVertical, instructionsGather } = useTools()
  // Datos de la vista
  const route = useRoute<RouteProp<RootStackParamList>>()
  const params = route.params
  // datos del modulo
  const module = useModuleById(params?._id || '')
  // datos del schema
  const moduleSchema = getModuleSchemaById(module?.schema_id || '')
  const insOrder = instructionOrderVertical(moduleSchema)
  const insGather = instructionsGather(insOrder)
  const propsFormikContent = {
    initialValues: insGather.initialValues,
    schemaValidation: insGather.schemaValidation,
    inputs: insGather.inputs,
    onSubmit: (values: any) => {
      console.log('onSubmit', values)
    }
  }

  return <FormikContent {...propsFormikContent} />
}
