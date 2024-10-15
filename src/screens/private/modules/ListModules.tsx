import React from 'react'
import { useQuery } from '@realm/react'
import { Card } from '@rneui/base'
import { Module } from '../../../db/models/ModuleSchema'
import { FlatList, TouchableOpacity } from 'react-native'
import { useFetchImage } from '../../../hooks/useFetchImage'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../router/private'
import { useSecureStorage } from '../../../contexts/secure/SecureStorageContext'

export const ListModules: React.FC = () => {
  const { getDataJWT } = useSecureStorage()
  const tenant = getDataJWT()?.tenant
  const modules = useQuery<Module>('Module')
    .filtered('tenant == $0', tenant)
    .sorted('name')

  return (
    <FlatList
      data={modules || []}
      keyExtractor={item => item.id}
      removeClippedSubviews={false}
      renderItem={({ item }) => <RenderItem item={item} />}
    />
  )
}

interface RenderItemProps {
  item: Module
}
const RenderItem: React.FC<RenderItemProps> = ({ item }) => {
  const { imagePath } = useFetchImage(item?.image_path)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AddEntity', { _id: item._id.toHexString() })
      }>
      <Card>
        {imagePath !== '' && imagePath !== null && (
          <Card.Image source={{ uri: imagePath }} />
        )}
        <Card.Title>{item.name}</Card.Title>
      </Card>
    </TouchableOpacity>
  )
}
