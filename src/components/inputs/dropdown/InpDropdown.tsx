import React, {useEffect} from 'react'
import {IconName} from '@fortawesome/fontawesome-svg-core'
import {FieldProps} from 'formik'
import {STYLES} from '../../../config'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {OPTION} from '../schemas'
import DropDownPicker, {
  DropDownDirectionType,
} from 'react-native-dropdown-picker'
import {TEXTS} from '../../../config/texts'
import {useRealm} from '@realm/react'
import {formattedLabelText} from '../../../helpers/functionsUxUi'

export type InpDropdownProps = {
  label?: string
  placeholder?: string
  secureTextEntry?: boolean
  options?: OPTION[]
  listMode?: 'SCROLLVIEW' | 'MODAL' | 'FLATLIST'
  zIndex?: number
  zIndexInverse?: number
  openSelector: string | null
  setOpenSelector: (selectorId: string | null) => void
  inputMode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
  iconRight?: {
    icon: IconName
    size?: number
    color?: string
  }
  onPressRight?: () => void
  type?: 'normal' | 'form'
} & FieldProps<any>

export const InpDropdown = (props: InpDropdownProps) => {
  const {
    label,
    placeholder,
    type,
    options,
    iconRight,
    secureTextEntry,
    inputMode,
    listMode = 'SCROLLVIEW',
    openSelector,
    setOpenSelector,
    field: {onChange, onBlur, value, name},
    form: {errors, touched, setFieldValue, values},
  } = props

  const realm = useRealm()
  const [open, setOpen] = React.useState(false)
  const [val, setVal] = React.useState(value)
  const [items, setItems] = React.useState(options ?? [])
  const isError = Boolean(errors[name] && touched[name])
  const zIndex = React.useMemo(() => {
    return openSelector === name ? 999999999 : 0
  }, [open, openSelector]) as number

  const updateItems = (
    filterKey: string,
    collection: string,
    setFieldValueKey: string,
  ) => {
    setFieldValue(setFieldValueKey, '')
    setItems([])
    setVal('')
    const updatedItems = realm
      ?.objects(collection)
      .filtered(`${filterKey} == $0`, values[filterKey])
      ?.map(item => ({
        value: item?.id as string,
        label: formattedLabelText(item?.name) as string,
        key: item?.id as string,
      }))
    setItems(updatedItems)
  }

  useEffect(() => {
    if (name === 'country_id') {
      const countries = realm?.objects('Country')?.map(country => ({
        value: country?.id as string,
        label: formattedLabelText(country?.name) as string,
        key: country?.id as string,
      }))
      setItems(countries)
    }
  }, [name, realm])

  useEffect(() => {
    if (name === 'department_id') {
      updateItems('country_id', 'Department', 'department_id')
    }
  }, [values.country_id])

  useEffect(() => {
    if (name === 'province_id') {
      updateItems('department_id', 'Province', 'province_id')
    }
  }, [values.department_id])

  useEffect(() => {
    if (name === 'district_id') {
      updateItems('province_id', 'District', 'district_id')
    }
  }, [values.province_id, values.department_id, values.country_id])

  return (
    <View style={[styles.container, {zIndex}]}>
      <Text style={[styles.label, isError && styles.labelError]}>{label}</Text>
      <View style={styles.containerInput}>
        <DropDownPicker
          itemKey={'key'}
          open={open && openSelector === name}
          value={val}
          items={items}
          placeholder={TEXTS.selectOption}
          setValue={setVal}
          setOpen={setOpen}
          onOpen={() => setOpenSelector(name)}
          onChangeValue={v => {
            setFieldValue(name, v)
          }}
          setItems={setItems}
          listMode={listMode}
          props={{
            style: [styles.containerStyle],
            activeOpacity: STYLES.TOUCHABLE_OPACITY,
          }}
          containerProps={{
            style: [styles.dropdownContainer, isError && styles.inputError],
          }}
          labelProps={{
            numberOfLines: 1,
            style: styles.inputLabel,
          }}
          dropDownContainerStyle={[styles.listItemContainer]}
        />
        {iconRight && (
          <TouchableOpacity
            activeOpacity={STYLES.TOUCHABLE_OPACITY}
            onPress={props.onPressRight ?? (() => {})}>
            <FontAwesomeIcon
              icon={iconRight.icon}
              size={iconRight.size ?? 24}
              color={iconRight.color ?? STYLES.COLORS.PRIMARY}
              style={styles.iconRight}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.error]}>
        {isError && (
          <>
            <FontAwesomeIcon
              icon="circle-exclamation"
              size={18}
              color={STYLES.COLORS.ERROR}
            />
            <Text style={styles.errorText}>{errors[name] as string}</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  containerInput: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: STYLES.FONT_FAMILY.REGULAR,
    color: STYLES.COLORS.PRIMARY,
    textAlign: 'left',
    marginBottom: 10,
  },
  labelError: {
    color: STYLES.COLORS.ERROR,
  },
  inputError: {
    borderColor: STYLES.COLORS.ERROR,
  },
  iconRight: {
    marginLeft: -36,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    zIndex: -1,
  },
  errorText: {
    fontSize: 14,
    fontFamily: STYLES.FONT_FAMILY.REGULAR,
    color: STYLES.COLORS.ERROR,
    paddingHorizontal: 5,
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: STYLES.SPACING.S,
  },
  dropdownContainer: {
    padding: 0,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: STYLES.COLORS.PRIMARY,
    height: 40,
    width: '100%',
    justifyContent: 'center',
  },
  inputLabel: {
    color: STYLES.COLORS.PRIMARY,
    fontFamily: STYLES.FONT_FAMILY.REGULAR,
    fontSize: 16,
  },
  listItemContainer: {
    margin: -2,
    paddingTop: STYLES.SPACING.XS,
    borderWidth: 2,
    borderColor: STYLES.COLORS.PRIMARY,
    width: Dimensions.get('window').width - STYLES.SPACING.L * 2,
  },
})
