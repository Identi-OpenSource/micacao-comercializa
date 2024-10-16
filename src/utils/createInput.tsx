// utils/inputUtils.ts
import { InpText } from '../components/inputs/text/InpText'
import { InpOpt } from '../components/inputs/opt/InpOpt'
import { InpTypes } from '../components/inputs/types'
import i18n from '../contexts/i18n/i18n'
import { searchInString } from '../utils/textsUtils'
import { ModuleSchemaInstruction } from '../db/models/ModuleSchemaSchema'

// Function to create inputs based on the instruction metadata
export const createInput = (inst: ModuleSchemaInstruction): InpTypes => {
  const inp: InpTypes = {
    id: inst.id,
    name: inst.id,
    title: inst.metadata.data_input.title,
    description: inst.metadata.data_input.description,
    type: inst.metadata.data_input.type,
    component: determineComponent(inst),
    inputMode: determineInputMode(inst)
  }

  if (
    inst.metadata.data_input.type === 'option' ||
    inst.metadata.data_input.type === 'options'
  ) {
    inp.options = inst.schema_gather.option?.map(opt => ({
      id: opt.id,
      label: opt.value,
      value: opt.value
    }))
    inp.disabled = true
  }

  return inp
}

// Helper function to determine the component based on the input type
const determineComponent = (inst: ModuleSchemaInstruction) => {
  switch (inst.metadata.data_input.type) {
    case 'text':
    case 'number':
      return InpText
    case 'option':
    case 'options':
      return InpOpt
    default:
      return InpText // Default to text component if not specified
  }
}

// Helper function to determine the input mode based on the input type
const determineInputMode = (inst: ModuleSchemaInstruction) => {
  switch (inst.metadata.data_input.type) {
    case 'text':
      return 'text'
    case 'number':
      return 'numeric'
    case 'option':
    case 'options':
      return 'none'
    default:
      return 'text'
  }
}
