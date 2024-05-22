import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Components/HomeScreen/Header';
import Slider from '../Components/HomeScreen/Slider';
import { collection, doc, getDocs, getFirestore, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Categories from '../Components/HomeScreen/Categories';
import LatestItemList from '../Components/HomeScreen/LatestItemList';

export default function HomeScreen() {

  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    await Promise.all([getSliders(), getCategoryList(), getLatestItemList()]);
  };

  /**
   * Used to Get Sliders for Home Screen
   */
  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      setSliderList(sliderList => [...sliderList, doc.data()]);
    });
  }

  /**
   * Used To get Category List
   */
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));
    querySnapshot.forEach((doc) => {
      setCategoryList(categoryList => [...categoryList, doc.data()]);
    })
  }

  const getLatestItemList = async () => {
    setLatestItemList([]);
    const querySnapshot = await getDocs(collection(db, 'UserPost'));
    querySnapshot.forEach((doc) => {
      setLatestItemList(latestItemList => [...latestItemList, doc.data()]);
    })
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  return (
    <ScrollView 
      className="py-12 px-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header />
      {/*Slider*/}
      <Slider sliderList={sliderList} />
      {/*Categories*/}
      <Categories categoryList={categoryList} />
      {/* Latest Item List */}
      <LatestItemList latestItemList={latestItemList} />
    </ScrollView>
  )
}
