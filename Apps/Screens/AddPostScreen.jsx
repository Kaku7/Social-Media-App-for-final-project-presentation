import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from '@clerk/clerk-expo';

export default function AddPostScreen() {
    const [image, setImage] = useState(null);
    const db = getFirestore(app);
    const storage = getStorage();
    const [loading,setLoading]=useState(false);
    const {user}=useUser();
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getCategoryList();
    }, []);

    const getCategoryList = async () => {
        const querySnapshot = await getDocs(collection(db, 'Category'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push(doc.data());
        });
        setCategoryList(categories);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmitMethod = async (values) => {

        setLoading(true)

        if (image) {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `communityPost/${Date.now()}.jpg`);

            uploadBytes(storageRef, blob).then(() => {
                console.log('Uploaded an image successfully!');
            }).catch(error => {
                console.error('Image upload error:', error);
            }).then((resp)=>{
                getDownloadURL(storageRef).then(async(downloadUrl)=>{
                    console.log(downloadUrl);
                    values.image=downloadUrl;
                    values.userName=user.fullName;
                    values.userEmail=user.primaryEmailAddress.emailAddress;
                    values.userImage=user.imageUrl;

                    const docRef=await addDoc(collection(db,"UserPost"),values)
                    if(docRef.id)
                    {
                        setLoading(false);
                        Alert.alert('Sucess!!!','Post Sucessfully Added.')
                    }
                })
            });
        }
    };

    return (
        <KeyboardAvoidingView>
        <ScrollView className="p-10">
            <Text className="text-[27px] font-bold">Add New Post</Text>
            <Text className="text-[16px] text-gray-500 mb-7">Create New Post</Text>
            <Formik
                initialValues={{ title: '', desc: '', category: '', image: '', userName: '', userEmail: '', userImage: '', createdAt:Date.now()}}
                onSubmit={onSubmitMethod}
                validate={(values) => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = 'Title is required';
                    }
                    return errors;
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
                    <View>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={image ? { uri: image } : require('./../../assets/images/Placeholder.jpg')}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                        
                        <TextInput
                            style={styles.input}
                            placeholder='Title'
                            value={values.title}
                            onChangeText={handleChange('title')}
                            onBlur={handleBlur('title')}
                        />
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        
                        <TextInput
                            style={styles.input}
                            placeholder='Description'
                            value={values.desc}
                            onChangeText={handleChange('desc')}
                            onBlur={handleBlur('desc')}
                            multiline
                            numberOfLines={5}
                        />
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={values.category}
                                onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                            >
                                {categoryList.map((item, index) => (
                                    <Picker.Item key={index} label={item.name} value={item.name} />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}
                        disabled={loading}
                        >
                            {loading?
                            <ActivityIndicator color='#fff'/>
                            :
                            <Text style={styles.submitButtonText}>Submit</Text>
                            }
                            
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 7,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        fontSize: 17,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15,
    },
    submitButton: {
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 10,
        marginTop: 15,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});
