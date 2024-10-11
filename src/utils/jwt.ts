import { GLOBALS } from '../config/consts'

export const getDataFromJWT = (jwt: string) => {
  const parts = jwt?.split('.')
  const payload = parts?.[1]
  const decodedPayload = atob(payload)
  const jsonData = JSON?.parse(decodedPayload)
  const minValidity = GLOBALS.timeValidJwtMin * 60 * 1000
  const isDateValid =
    new Date().getTime() <
    new Date(jsonData.exp * 1000)?.getTime() - minValidity
  // console.log('jsonData', jsonData)
  return { ...jsonData, isDateValid } // isDateValid is la fecha es valida
}
