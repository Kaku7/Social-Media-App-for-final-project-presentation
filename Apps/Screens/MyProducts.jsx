import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { useNavigation } from '@react-navigation/native';

export default function MyProducts() {

    const db = getFirestore(app);
    const { user } = useUser();
    const [productList, setProductList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        user && getUserPost();
    }, [user]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            getUserPost();
        });
        return unsubscribe;
    }, [navigation]);

    /***For User Posts Only */
    const getUserPost = async () => {
        setProductList([]); // Clear the list before fetching new posts
        const q = query(collection(db, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
        const snapshot = await getDocs(q);
        const posts = [];
        snapshot.forEach(doc => {
            posts.push(doc.data());
        });
        setProductList(posts);
    }

    return (
        <View>
            <LatestItemList latestItemList={productList} />
        </View>
    );
}
