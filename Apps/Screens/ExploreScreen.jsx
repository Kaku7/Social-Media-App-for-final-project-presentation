import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestItemList from '../Components/HomeScreen/LatestItemList';

export default function ExploreScreen() {

  const db = getFirestore(app);
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  /***All Products Screen */
  const getAllProducts = async () => {
    setProductList([]);
    const q = query(collection(db, 'UserPost'));
    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((doc) => {
      products.push(doc.data());
    });
    setProductList(products);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllProducts();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="p-5 py-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-[24px] font-bold">Explore</Text>
      <LatestItemList latestItemList={productList} />
    </ScrollView>
  );
}
