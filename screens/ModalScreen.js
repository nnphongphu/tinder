import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import useAuth from '../hooks/useAuth';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import { db } from '../firebaseConfig'


const ModalScreen = () => {
  const user = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const navigation = useNavigation();
  const incompleteForm = !image || !age || !job
  const updateUserProfile = () => {
    db.collection("Users").doc(user.user.uid).set({
      photoURL: image,
      job,
      age,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
    .then(() => {
      navigation.navigate('Home');
    })
    .catch((error) => {
      alert(error);
    })
  };

  return (
    <View style={tw`flex-1 items-center pt-1`}>
      <Image style={tw`h-20 w-full`} 
        resizeMode="contain"
        source={require("../assets/Tinder-logo.png") }
      />
      <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
        Welcome {user.firstName}
      </Text>

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 1: The Profile pic
      </Text>
      <TextInput style={tw`text-center text-xl pb-2`}
        value={image}
        onChangeText={setImage}
        placeholder="Enter a profile Pic URL"
      />

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 2: The Job
      </Text>
      <TextInput style={tw`text-center text-xl pb-2`}
        value={job}
        onChangeText={setJob}
        placeholder="Enter your job"
      />

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step 3: The Age
      </Text>
      <TextInput style={tw`text-center text-xl pb-2`}
        value={age}
        onChangeText={setAge}      
        placeholder="Enter you age"
        keyboardType='numeric'
        maxLength={2}
      />

      <TouchableOpacity style={[tw`w-64 p-3 rounded-xl absolute bottom-10`, 
        incompleteForm ? tw`bg-gray-400` : tw`bg-red-400`]}
        disabled={incompleteForm}
        onPress={updateUserProfile}
      >
        <Text style={tw`text-center text-white text-xl`}>Update profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen

const styles = StyleSheet.create({})