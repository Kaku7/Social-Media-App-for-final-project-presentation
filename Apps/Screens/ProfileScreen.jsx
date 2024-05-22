import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import Dairy from './../../assets/images/Dairy.png'
import logout from './../../assets/images/logout.png'
import Search from './../../assets/images/Search.png'
import home from './../../assets/images/home.png'
import { useNavigation } from '@react-navigation/native'

export default function ProfileScreen() {

  const {user}=useUser();
  const navigation=useNavigation();
  const { isLoaded,signOut } = useAuth();
  const menuList=[
    {
      id:1,
      name:'My Posts',
      icon:Dairy,
      path:'my-product'
    },
    {
      id:2,
      name:'Explore',
      icon:Search,
      path:'explore'
    },
    {
      id:3,
      name:'Home',
      icon:home,
      path:'home'
    },
    {
      id:4,
      name:'Logout',
      icon:logout
    },
  ]

  const onMenuPress=(item)=>{
    if(item.name=='Logout')
    {
      signOut();
      return ;
    }
    item?.path?navigation.navigate(item.path):null;
  }
  return (
    <View className="p-5 bg-red-300 flex-1">
      <View className="items-center mt-14">
        <Image source={{uri:user?.imageUrl}}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="font-bold text-[23px] mt-3 text-center">{user?.fullName}</Text>
      </View>

        <FlatList
          data={menuList}
          numColumns={3}
          style={{marginTop:20}}
          renderItem={({item,index})=>(
            <TouchableOpacity 
              onPress={()=>onMenuPress(item)}
              className="flex-1 p-3 border-[1px] items-center m-4 rounded-lg bg-red-100 border-red-300">
              {item.icon&& <Image source={item?.icon}
              className="w-[67px] h-[67px]"/>}
              <Text className="text-red-700 mt-2">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
    </View>
  )
}