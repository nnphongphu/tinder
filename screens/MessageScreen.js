import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import Header from '../components/Header'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import tw from 'tailwind-react-native-classnames';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import firebase from 'firebase/compat/app';
import { db } from '../firebaseConfig';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const { matchDetails } = params;

  useEffect(() => {
    const unsubscribe = db
      .collection("Matches")
      .doc(matchDetails.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => setMessage(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      ));

      return unsubscribe;
  }, [matchDetails, db]);

  const sendMessage = () => {
    try {
      db.collection("Matches").doc(matchDetails.id).collection("messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input
      });

      setInput('');
    }
    catch(error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} callEnabled/>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList 
            data={message}
            inverted={-1}
            stype={tw`pl-4`}
            keyExtractor={(item) => item.id}
            renderItem={({item: message}) => 
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View style={tw`flex-row justify-between items-center border-t border-gray-200 px-5 py-2`}>
          <TextInput
            style={tw`h-10 text-lg`}
            placeholder="Send message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="#FF5864"/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen

const styles = StyleSheet.create({})