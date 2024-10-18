import { useQuery, useRealm } from '@realm/react'
import { Module } from '../db/models/ModuleSchema'
import { User } from '../db/models/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { useMemo } from 'react'
import {
  ModuleSchema,
  ModuleSchemaInstruction
} from '../db/models/ModuleSchemaSchema'
import { BSON } from 'realm'
import { PersonEntity } from '../db/models/PersonEntitySchema'
import { GLOBALS } from '../config/consts'
import { Country } from '../db/models/CountrySchema'
import { Department } from '../db/models/DepartmentSchema'
import { Province } from '../db/models/ProvinceSchema'
import { District } from '../db/models/DistrictSchema'
import useNetInfo from './useNetInfo'
import { replaceValuesKeysKeys } from '../utils/functions'
import { KEYS_MMKV } from '../db/mmkv'
import axios from 'axios'
import { ObjectEntity } from '../db/models/ObjectEntitySchema'

const insAxios = axios.create()

export const useRealmQueries = () => {
  const { getItem, setItem } = useSecureStorage()
  const connectionStatus = useNetInfo()
  const { getDataJWT } = useSecureStorage()
  const realm = useRealm()
  const tenant = getDataJWT()?.tenant || ''
  const uuidUser = getDataJWT()?.uuid || ''

  const allModules = useQuery<Module>('Module')
  const allModuleSchemas = useQuery<ModuleSchema>('ModuleSchema')
  const users = useQuery<User>('User')
  const personEntity = useQuery<PersonEntity>('PersonEntity')
  const country = useQuery<Country>('Country')
  const department = useQuery<Department>('Department')
  const province = useQuery<Province>('Province')
  const district = useQuery<District>('District')

  // obtener module por id

  const getModuleById = useMemo(
    () => (id: string) => {
      const _id = new BSON.ObjectId(id)
      return allModules.filtered('_id == $0', _id)?.[0]
    },
    [tenant, allModules]
  )

  const getModules = useMemo(() => {
    return allModules.filtered('tenant == $0', tenant)
  }, [tenant, allModules])

  const getModuleSchemaById = useMemo(
    () => (id: string) => {
      return allModuleSchemas.filtered('id == $0', id)?.[0]
    },
    [tenant, allModuleSchemas]
  )

  const getUser = useMemo(() => {
    const user = users.filtered('uuid == $0', uuidUser)
    return user.length > 0 ? user[0] : undefined
  }, [uuidUser, users])

  const getPersonEntity = useMemo(() => {
    const persons = personEntity.filtered('tenant == $0', tenant)
    return persons.length > 0 ? persons : undefined
  }, [uuidUser])

  const getCountry = useMemo(() => {
    return country.length > 0 ? country : []
  }, [country])

  const getDepartment = useMemo(
    () => (id: string) => {
      const departmentList = department.filtered('country_id == $0', id)
      return departmentList.length > 0 ? departmentList : []
    },
    [department]
  )

  const getProvince = useMemo(
    () => (id: string) => {
      const provinceList = province.filtered('department_id == $0', id)
      return provinceList.length > 0 ? provinceList : []
    },
    [province]
  )

  const getDistrict = useMemo(
    () => (id: string) => {
      const districtList = district.filtered('province_id == $0', id)
      return districtList.length > 0 ? districtList : []
    },
    [district]
  )

  const getAllEntities = useMemo(
    () => (entity: string) => {
      switch (entity) {
        case GLOBALS.entity_type.PER:
        case GLOBALS.entity_type.PERSON:
          return getPersonEntity

        default:
          break
      }
    },
    []
  )

  const saveEntity = async ({
    values,
    module,
    instructions
  }: {
    values: any
    module: Module
    instructions: ModuleSchemaInstruction[]
  }) => {
    const entityType = GLOBALS.entity_type[module.entity_type]
    console.log('entityType', entityType)
    const id = new BSON.UUID().toString()
    const _id = new BSON.ObjectId()
    const doc = {
      _id,
      id,
      tenant: module.tenant,
      module_name: module.name,
      module_id: module.id,
      entity_type: module.entity_type,
      disabled_at: null,
      updated_at: new Date(),
      created_at: new Date(),
      module_detail: [],
      entity_relations: []
    } as PersonEntity | ObjectEntity

    if (
      values?.country_id?.id ||
      values?.department_id?.id ||
      values?.province_id?.id ||
      values?.district_id?.id
    ) {
      doc.location = {
        country_id: values?.country_id?.id ?? '',
        department_id: values?.department_id?.id ?? '',
        province_id: values?.province_id?.id ?? '',
        district_id: values?.district_id?.id ?? ''
      }
    }

    for (const inst of instructions) {
      if (inst.config.is_gather) {
        const value =
          inst.schema_gather?.type_value !== 'option'
            ? values[inst.schema_gather.name]
            : values[inst.schema_gather.name]?.label
        const detail = {
          ...inst?.schema_gather,
          instruction_id: inst?.id,
          value
        } as any
        doc.module_detail.push(detail)
      }

      if (inst.config.tool?.on_action?.type === 'api') {
        let POST_GATHER_STACK = !connectionStatus
        if (connectionStatus) {
          try {
            const resp = await insAxios.post<any>(
              inst.config.tool.on_action.location,
              replaceValuesKeysKeys(inst?.metadata?.data_input, values),
              {
                headers: {
                  apiKey: inst.config.tool.on_action.api_key,
                  tenant: module.tenant,
                  module_session_id: id
                }
              }
            )
            const respData = resp?.data?.data
            inst?.schema_variables?.forEach(variable => {
              console.log('variable?.name', variable?.name)
              if (
                respData?.[variable?.name] &&
                variable?.is_module_attr &&
                variable?.list_type_value !== 'entity'
              ) {
                // guardo la variable como viene
                const detail = {
                  name: variable?.name,
                  instruction_id: inst?.id,
                  value: respData?.[variable?.name]
                } as any
                doc.module_detail = [...doc.module_detail, detail]
              }

              if (
                respData?.[variable?.name] &&
                variable?.is_module_attr && // se guarda en DB
                variable?.list_type_value === 'entity'
              ) {
                // supongo que entity siempre sera un array
                doc.entity_relations = [
                  ...doc.entity_relations,
                  ...respData?.[variable?.name]
                ]
              }
            })
          } catch (error) {
            console.error('Error apiTool:', error)
            POST_GATHER_STACK = true
          }
        }

        if (POST_GATHER_STACK) {
          const apiTool = {
            _id: values._id,
            id: values.id,
            entity_type: entityType,
            inst
          }
          const stackPostGather = JSON.parse(
            (getItem(KEYS_MMKV.POST_GATHER_STACK) as string) || '[]'
          )
          stackPostGather.push(apiTool)
          setItem(KEYS_MMKV.POST_GATHER_STACK, JSON.stringify(stackPostGather))
        }
      }
    }

    try {
      realm.write(() => {
        console.log('doc', doc)
        realm.create(entityType, doc)
      })
      return true
    } catch (error) {
      console.error('Error al guardar el entity:', error)
      return false
    }
  }

  return {
    saveEntity,
    getModules,
    getModuleSchemaById,
    getUser,
    getPersonEntity,
    getAllEntities,
    getCountry,
    getDepartment,
    getProvince,
    getDistrict,
    getModuleById
  }
}

// Custom hook para obtener un Module por su id directamente sin useMemo
// export const useModuleById = (_id: string) => {
//   const id = new BSON.ObjectId(_id)
//   const module = useObject<Module>('Module', id)

//   return module
// }
