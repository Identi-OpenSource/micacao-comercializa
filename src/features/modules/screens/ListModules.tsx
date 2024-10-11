import React from 'react'
import { useQuery } from '@realm/react'
import { Card } from '@rneui/base'
import { Module } from '../model/ModuleSchema'
import { FlatList, TouchableOpacity } from 'react-native'
import { useFetchImage } from '../../../hooks/useFetchImage'
export const ListModules: React.FC = () => {
  const modules = useQuery<Module>('Module')

  return (
    <FlatList
      data={modules}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <RenderItem item={item} />}
    />
  )
}

const RenderItem: React.FC<{ item: Module }> = ({ item }) => {
  const { imagePath } = useFetchImage(item?.image_path)
  console.log('imagePath', imagePath)

  return (
    <TouchableOpacity onPress={() => console.log('onPress')}>
      <Card>
        {imagePath !== '' && imagePath !== null && (
          <Card.Image source={{ uri: imagePath }} />
        )}
        <Card.Title>{item.name}</Card.Title>
      </Card>
    </TouchableOpacity>
  )
}
