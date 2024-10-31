import React, { useEffect } from 'react'
import { useQuery } from '@realm/react'
import { Module } from '../../../db/models/ModuleSchema'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { useFetchImage } from '../../../hooks/useFetchImage'
import {
  NavigationProp,
  useIsFocused,
  useNavigation
} from '@react-navigation/native'
import { RootStackParamList } from '../../../router/private'
import { useSecureStorage } from '../../../contexts/secure/SecureStorageContext'
import { Container } from '../../../components/container/Container'
import { COLORS, FONTS, SPACING } from '../../../contexts/theme/defaultTheme'
import { Image, Text, Icon } from '@rneui/themed'
import i18n from '../../../contexts/i18n/i18n'
import { useTools } from '../../../hooks/useTools'

export const ListModules: React.FC = () => {
  const isFocused = useIsFocused()
  const { getDataJWT } = useSecureStorage()
  const { runInstructionPostGather } = useTools()
  const tenant = getDataJWT()?.tenant
  const modules = useQuery<Module>('Module')
    .filtered('tenant == $0', tenant)
    .sorted('name')

  useEffect(() => {
    if (isFocused) {
      runInstructionPostGather()
    }
  }, [isFocused])
  return (
    <Container showConnection>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>{i18n.t('welcome')}</Text>
        <Text style={styles.headerSubTitle}>
          {i18n.t('whatDoYouWantToDoToday')}
        </Text>
      </View>
      <FlatList
        data={modules || []}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </Container>
  )
}

interface RenderItemProps {
  item: Module
}

const RenderItem: React.FC<RenderItemProps> = ({ item }) => {
  const { imagePath } = useFetchImage(item?.image_path)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  if (
    item.name?.trim().toLowerCase().replace(/\s+/g, '') === 'registrodeparcela'
  ) {
    return
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.containerStyle}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('AddEntity', { _id: item._id.toHexString() })
        }>
        <Image
          source={{ uri: imagePath ?? 'no_image' }}
          containerStyle={styles.imgCont}
          style={styles.img}
          PlaceholderContent={<ActivityIndicator />}
        />

        <Text style={styles.titleItem}>{item.name}</Text>
        <Icon name="chevron-right" size={32} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.small
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    color: COLORS.primary
  },
  headerSubTitle: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: COLORS.primary
  },
  imgCont: {
    width: 65,
    height: 65
  },
  img: {
    resizeMode: 'contain'
  },
  container: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.small,
    marginVertical: SPACING.medium
  },
  containerStyle: {
    paddingHorizontal: SPACING.small,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    borderRadius: 10,
    shadowColor: '#000',
    backgroundColor: COLORS.white,
    shadowRadius: 3,
    elevation: 5
  },
  titleItem: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    paddingLeft: SPACING.small,
    color: COLORS.primary
  }
})
