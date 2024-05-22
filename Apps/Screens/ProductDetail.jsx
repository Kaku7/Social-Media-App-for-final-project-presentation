import { View, Text, Image, TouchableOpacity, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

export default function ProductDetail({navigation}) {
    const {params}=useRoute();
    const [product,setProduct]=useState([]);
    const {user}=useUser();
    const db=getFirestore(app);
    const nav=useNavigation();
    useEffect(()=>{
        params&&setProduct(params.product);
        shareButton();
    },[params,navigation])

    const shareButton=()=>{
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={()=>shareProduct()}>
                <Ionicons name="share-social-sharp" size={24} color="white" 
                style={{marginRight:15}} />
                </TouchableOpacity>
            ),
          });
    }

    /*** Share Post */

    const shareProduct=async()=>{
        const content={
            message:product?.title+"\n"+product?.desc,

        }
        Share.share(content).then(resp=>{
            console.log(resp);
        },(error)=>{
            console.log(error);
        })
    }

    const deleteUserPost=()=>{
        Alert.alert('Do You Want to Delete This Post?',"Are You Sure?",[
            {
                text:'Yes',
                onPress:()=>deleteFromFirestore()
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ])
    }
    const deleteFromFirestore=async()=>{
        console.log('deleted');
        const q=query(collection(db,'UserPost'),where('title','==',product.title))
        const snapshot=await getDocs(q);
        snapshot.forEach(doc=>{
            deleteDoc(doc.ref).then(resp=>{
                console.log("Deleted");
                nav.goBack();
            })
        })
    }
  return (
    <ScrollView>
      <Image source={{uri:product.image}}
        className="h-[350px] w-full"
        />

        <View className="p-3">
            <Text className="text-[25px] font-bold text-red-500">{product?.title}</Text>
            <View className="items-baseline">
            <Text className="p-1 px-2 bg-blue-200 text-blue-500 rounded-full">{product?.category}</Text>
            </View>
            <Text className="text-[19px] font-bold mt-3 text-gray-700">Description</Text>
            <Text className="text-[17px] text-blue-300">{product?.desc}</Text>
        </View>

        {/*User Info*/}
        <View className="p-3 flex flex-row items-center gap-3">
            <Image source={{uri:product.userImage}}
                className="w-12 h-12 rounded-full"
                />
            <View>
                <Text>{product.userName}</Text>
            </View>
        </View>

        {user?.primaryEmailAddress.emailAddress==product.userEmail?
        <TouchableOpacity 
        onPress={()=>deleteUserPost()}
        className="z-40 bg-red-500 rounded-full p-4 m-2">
        <Text className="text-center text-white">Delete Post</Text>
    </TouchableOpacity> 
    :
    <TouchableOpacity className="z-40 bg-blue-500 rounded-full p-4 m-2">
            <Text className="text-center text-white">Connect</Text>
        </TouchableOpacity> 
    } 
    </ScrollView>
  )
}