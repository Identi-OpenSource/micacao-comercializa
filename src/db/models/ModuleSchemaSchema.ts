import Realm from 'realm'

type ModuleSchemaCondition = {
  id: string
  next_instruction_id: string
  type_condition: string
}

type ModuleSchemaConfig = {
  tool: {
    id: string
    name: string
    description: string
    on_action: any
  }
  color: string
  is_gather: boolean
  is_channel: boolean
}

type schema_gather = {
  id: string
  name: string
  type_value: string
  is_module_attr: boolean
  is_unique: boolean
  is_optional: boolean
  is_representative: boolean
  is_visual_table: string
}

export type schema_input = {
  name: string
  display_name: string
  place_holder: string
  description: string
  type_input: string
  id: string
  value: string
}

export type ModuleSchemaInstruction = {
  id: string
  config: ModuleSchemaConfig
  schema_conditions: Realm.List<ModuleSchemaCondition>
  schema_gather: schema_gather
  schema_input: Realm.List<any>
}

export type ModuleSchema = {
  _id: Realm.BSON.ObjectId
  created_at?: string
  id: string
  instruction_start?: string
  instructions: Realm.List<ModuleSchemaInstruction>
  module_id: string
}

export const ModuleSchemaSchema = {
  name: 'ModuleSchema',
  properties: {
    _id: 'objectId',
    created_at: 'string?',
    id: 'string',
    instruction_start: 'string?',
    instructions: 'mixed[]',
    module_id: 'string'
  },
  primaryKey: '_id'
}
