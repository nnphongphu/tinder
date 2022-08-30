import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import tw from "tailwind-react-native-classnames";
import { TouchableOpacity, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Center, Column, Row, Spinner, Avatar, Text } from "native-base";
import useAuth from "../hooks/useAuth";
import { AntDesign } from "@expo/vector-icons";

const ChatScreen = ({ route }) => {
  const { user } = useAuth();
  const [loggedInProfile, setLoggedInProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const { uid } = route.params;
  const [receiverProfile, setReceiverProfile] = useState({});

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? uid1.concat(uid2) : uid2.concat(uid1);
  };

  const chatId = getChatId(user.uid, uid);

  const refresh = async () => {
    try {
      setIsLoading(true);

      const _loggedInProfileSnapshot = await db
        .collection("Users")
        .doc(user.uid)
        .get();
      const _loggedInProfile = {
        ..._loggedInProfileSnapshot.data(),
        id: _loggedInProfileSnapshot.id,
      };
      setLoggedInProfile(_loggedInProfile);

      const _receiverProfileSnapshot = await db
        .collection("Users")
        .doc(uid)
        .get();
      const _receiverProfile = {
        ..._receiverProfileSnapshot.data(),
        id: _receiverProfileSnapshot.id,
      };
      setReceiverProfile(_receiverProfile);

      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", (e) => {
      refresh();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      refresh();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const collectionRef = collection(db, "chats", chatId, "messages");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, "chats", chatId, "messages"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  if (isLoading || !loggedInProfile || !receiverProfile) {
    return (
      <Column
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="lg" color="indigo.500" />
      </Column>
    );
  }

  return (
    <>
      <View
        style={[
          tw`flex-row items-center justify-center pt-3 pb-3`,
          styles.shadow,
        ]}
        backgroundColor="#ffffff"
      >
        <Row
          width="100%"
          paddingX={5}
          justifyContent="center"
          position="relative"
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { uid: receiverProfile.id })
            }
          >
            <Column alignItems={"center"}>
              <Avatar
                bg="green.500"
                size="md"
                source={{ uri: receiverProfile.images[0] }}
              >
                FF
              </Avatar>
              <Text fontWeight="bold">{receiverProfile.displayName}</Text>
            </Column>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", { initialTab: "Message" })
            }
            backgroundColor="white"
            style={{ position: "absolute", left: 15, top: 15 }}
          >
            <AntDesign name="back" size={40} color="#576cd6" />
          </TouchableOpacity>
        </Row>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
          name: loggedInProfile.displayName,
          avatar:
            loggedInProfile.images && loggedInProfile.images.length >= 1
              ? loggedInProfile.images[0]
              : "https://hostpapasupport.com/knowledgebase/wp-content/uploads/2018/04/1-13.png",
        }}
      />
    </>
  );
};

const styles = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
};

export default ChatScreen;
