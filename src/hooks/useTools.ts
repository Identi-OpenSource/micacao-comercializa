import { InpText } from '../components/inputs/text/InpText'
import i18n from '../contexts/i18n/i18n'
import {
  ModuleSchema,
  ModuleSchemaInstruction
} from '../db/models/ModuleSchemaSchema'
import * as Yup from 'yup'

export const useTools = () => {
  const instructionOrderVertical = (
    moduleSchema: ModuleSchema
  ): ModuleSchemaInstruction[] => {
    const instructionsInOrder: ModuleSchemaInstruction[] = []
    let currentInstruction = moduleSchema.instructions.find(
      inst => inst.id === moduleSchema.instruction_start
    )

    while (currentInstruction) {
      instructionsInOrder.push(currentInstruction)
      const nextInstructionId = currentInstruction.schema_conditions.find(
        condition => condition.type_condition === 'by_success'
      )?.next_instruction_id
      currentInstruction = nextInstructionId
        ? moduleSchema.instructions.find(inst => inst.id === nextInstructionId)
        : undefined
    }

    return instructionsInOrder
  }

  const instructionsGather = (instructions: ModuleSchemaInstruction[]) => {
    const ins = instructions.filter(inst => inst.config.is_gather)
    const inputs: any[] = []
    const initialValues: { [key: string]: any } = {}
    let schemaValidation: any = {}
    const shape: { [key: string]: any } = {}
    ins.forEach(inst => {
      let schema: any
      const inp = {
        id: inst.id,
        name: inst.id,
        title: inst.schema_input.find(input => input.name === 'title')?.value,
        description: inst.schema_input.find(
          input => input.name === 'description'
        )?.description,
        type: inst.schema_input.find(input => input.name === 'type')?.value,
        component: InpText
      }
      initialValues[inp.name] = ''
      switch (inp.type) {
        case 'text':
          schema = Yup.string()
          inp.component = InpText
          break

        case 'number':
          schema = Yup.number().typeError(i18n.t('numberType'))
          inp.component = InpText
          break

        case 'option':
        case 'options':
          schema = Yup.string()
          inp.component = InpText
          break

        default:
          schema = Yup.string()
          break
      }

      if (!inst?.schema_gather?.is_optional) {
        schema = schema.required(i18n.t('required'))
      }
      shape[inp.name] = schema
      inputs.push(inp)
    })
    schemaValidation = Yup.object().shape(shape)
    return { inputs, initialValues, schemaValidation }
  }

  return { instructionOrderVertical, instructionsGather }
}
