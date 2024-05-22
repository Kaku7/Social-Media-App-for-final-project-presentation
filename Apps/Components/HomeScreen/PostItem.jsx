import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function PostItem({item}) {

  const navigation=useNavigation();

  return (
    <TouchableOpacity className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200 bg-red-300"
    onPress={()=>navigation.push('product-detail',
      {
          product:item
      })}   
    >
    <Image source={{uri:item.image}}
    className="w-full h-[150px] rounded-lg"/>
    <View>
      <Text className="text-[15px] font-bold mt-2">{item.title}</Text>
      <Text className="text-gray-200">{item.category}</Text>
    </View>
  </TouchableOpacity>
  )
}