import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { app } from '../../firebaseConfig';

export default function ItemList() {
    const {params}=useRoute();
    const db=getFirestore(app);
    const [ItemList,setItemList]=useState([]);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        params&&getItemListByCategory();
    },[params])

    const getItemListByCategory=async()=>{
        setItemList([]);
        setLoading(true)
        const q=query(collection(db,'UserPost'),where('category','==',params.category));
        const snapshot=await getDocs(q);
        setLoading(false)
        snapshot.forEach(doc=>{
            console.log(doc.data());
            setItemList(ItemList=>[...ItemList,doc.data()]);
            setLoading(false)
        })
    }
  return (
    <View>
      {loading?
      <ActivityIndicator className="mt-24" size={'large'} color={'#3b82f6'}/>
      :
      ItemList?.length>0? <LatestItemList latestItemList={ItemList}/>
      :<Text className="p-5 text-[33px] mt-36 text-center text-red-300"> No Post Available </Text>}
    </View>
  )
}