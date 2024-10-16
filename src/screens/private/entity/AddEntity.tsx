import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { useModuleById, useRealmQueries } from '../../../hooks/useRealmQueries'
import { RootStackParamList } from '../../../router/private'
import { useTools } from '../../../hooks/useTools'
import { FormikContent } from '../../../components/formik/FormikContent'
import { Module } from '../../../db/models/ModuleSchema'

export const AddEntity = () => {
  const { getModuleSchemaById, getAllEntities } = useRealmQueries()
  const { instructionOrderVertical, instructionsGather, instructionsNoGather } =
    useTools()
  // Datos de la vista
  const route = useRoute<RouteProp<RootStackParamList>>()
  const params = route.params
  // datos del modulo
  const module = useModuleById(params?._id || '') as Module
  // datos del schema
  const moduleSchema = getModuleSchemaById(module?.schema_id || '')
  const insOrder = instructionOrderVertical(moduleSchema)
  const insGather = instructionsGather(insOrder, module, getAllEntities)
  // const insNoGather = instructionsNoGather(insOrder)
  console.log('module?.schema_id', module?.schema_id)
  const onSubmit = (values: any) => {
    console.log('onSubmit', values)
  }

  const propsFormikContent = {
    initialValues: insGather.initialValues,
    schemaValidation: insGather.schemaValidation,
    inputs: insGather.inputs,
    onSubmit
  }

  return <FormikContent {...propsFormikContent} />
}
