import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-react-native-classnames';


const ChatRow = ({matchDetails}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);

  useEffect(() => {
     if (matchDetails) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
     }
  }, [matchDetails]);
  
  return (
      
      <TouchableOpacity
        style={[tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`, styles.cardShadow]}
        onPress={() => navigation.navigate("Message", {matchDetails})}
      >
        <Image 
          style={tw`rounded-full h-16 w-16 mr-4`} 
          source={{ uri: matchedUserInfo?.photoURL }}
        />
        <View>
          <Text style={tw`text-lg font-semibold`}>
            {matchedUserInfo?.displayName}
          </Text>
          <Text>Say Hi!</Text>
        </View>
      </TouchableOpacity>
  )
}

export default ChatRow

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41
  }
})