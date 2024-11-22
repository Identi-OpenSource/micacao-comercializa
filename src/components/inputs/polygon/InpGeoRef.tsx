import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { InpTextProps } from '../types'
import Geolocation from 'react-native-geolocation-service'
import {
  COLORS,
  FONTS,
  INPUTS_STYLES,
  SPACING
} from '../../../contexts/theme/mccTheme'
import { useField, useFormikContext } from 'formik'
import usePermissions from '../../../hooks/usePermissions'
import { PERMISSIONS } from 'react-native-permissions'
import MapView, { MAP_TYPES, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Text } from '@rneui/themed'
const permissionsRequired = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
export const InpGeoRef = (props: InpTextProps) => {
  const [field, meta] = useField(props.name)
  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.00415,
    longitudeDelta: 0.00415
  })
  const { setFieldValue } = useFormikContext()
  const { name } = field
  const mapRef = React.useRef<MapView>(null)
  const isError = meta.error !== undefined && meta.touched
  const { statuses, requestPermissions } = usePermissions(permissionsRequired)

  useEffect(() => {
    requestPermissions()
  }, [])

  useEffect(() => {
    if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted') {
      getMyLocation()
    }
  }, [statuses])

  useEffect(() => {
    if (region.latitude !== 0 && region.longitude !== 0) {
      const featureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name
            },
            geometry: {
              type: 'Point',
              coordinates: [region.longitude, region.latitude]
            }
          }
        ]
      }
      // console.log('featureCollection', featureCollection)
      setFieldValue(name, { geojson: featureCollection })
    }
  }, [region])

  const getMyLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setRegion({ ...region, latitude, longitude })
        mapRef.current?.animateToRegion(
          { ...region, latitude, longitude },
          1000
        )
      },
      error => {
        console.error('Geolocation error:', error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  // console.log('region', region)

  return (
    <View>
      <Text style={INPUTS_STYLES.title}>{props?.title}</Text>
      <Text
        style={styles.result}>{`${region.latitude}, ${region.longitude}`}</Text>
      <MapView
        ref={mapRef}
        mapType={MAP_TYPES.SATELLITE}
        provider={PROVIDER_GOOGLE}
        // region={region}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        zoomControlEnabled={false}
        toolbarEnabled={false}
        onPress={e => {
          setRegion({
            ...region,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          })
        }}
        onMapReady={() => {
          console.log('Map is ready')
        }}
        loadingEnabled
        style={styles.map}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude
          }}
          draggable
          onDragEnd={e =>
            setRegion({
              ...region,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }
        />
      </MapView>
      {isError ? <Text style={INPUTS_STYLES.error}>{meta.error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: 250,
    marginBottom: SPACING.medium
  },
  result: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.inputText,
    fontWeight: 'bold',
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
    paddingHorizontal: SPACING.small
  }
})
