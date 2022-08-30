import {
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Text, Center, Column, Avatar, Row } from "native-base";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc } from "firebase/firestore";

const MessageScreen = ({ navigation: navNavigation }) => {
  const { user } = useAuth();
  const [matchList, setMatchList] = useState([]);
  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? uid1.concat(uid2) : uid2.concat(uid1);
  };

  const refresh = async () => {
    try {
      setIsLoading(true);
      const _matchListSnapshot = await db
        .collection("Users")
        .doc(user.uid)
        .collection("match")
        .get();
      let _matchList = [];
      _matchListSnapshot.forEach((match) =>
        _matchList.push({ ...match.data(), id: match.id })
      );
      setMatchList(_matchList);

      const _list = [];
      for (let i = 0; i < _matchList.length; i++) {
        const chatId = getChatId(user.uid, _matchList[i].id);
        const docSnapshot = await db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();
        if (docSnapshot.docs.length > 0) {
          _list.push({
            latestMessage: docSnapshot.docs[0].data(),
            receiver: _matchList[i],
          });
        }
      }

      _list
        .sort((a, b) => a.latestMessage.localeCompare(b.latestMessage))
        .reverse();
      setList(_list);
      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("focus", (e) => {
      refresh();
    });

    return unsubscribe;
  }, [navNavigation]);

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("tabPress", (e) => {
      refresh();
    });

    return unsubscribe;
  }, [navNavigation]);

  return (
    <>
      <View style={tw`flex-row items-center justify-center pt-10`}>
        <Text
          fontSize="xl"
          color="#576cd6"
          alignSelf={"center"}
          style={{ fontFamily: "Lobster_400Regular" }}
        >
          Platonic
        </Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 10 }}>
        <Text fontWeight="bold" fontSize="md" color="#576cd6">
          New Matches
        </Text>
        <ScrollView horizontal={true}>
          {matchList && matchList.length === 0 && (
            <TouchableOpacity
              onPress={() => navNavigation.jumpTo("Liked")}
              style={{ marginTop: 3, marginRight: 3 }}
            >
              <Center height={200} width={122} bg="#576cd6" borderRadius={10}>
                <Column
                  width="100%"
                  backgroundColor="#576cd6"
                  borderRadius={10}
                  borderTopLeftRadius={0}
                  borderTopRightRadius={0}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={styles.shadow}
                    fontWeight="bold"
                    color="white"
                    fontSize="xl"
                  >
                    Likes
                  </Text>
                </Column>
              </Center>
            </TouchableOpacity>
          )}
          {matchList &&
            matchList.map((match, index) => {
              return (
                <TouchableOpacity
                  key={`item-${index}-${match.id}`}
                  onPress={() =>
                    navigation.navigate("Profile", {
                      uid: match.id,
                    })
                  }
                  style={{ marginTop: 3, marginRight: 10 }}
                >
                  <ImageBackground
                    source={{ uri: match.images[0] }}
                    resizeMode="cover"
                    borderRadius={10}
                  >
                    <Center height={200} width={122} bg="transparent">
                      <Column
                        width="100%"
                        backgroundColor={"#ffffff"}
                        borderRadius={10}
                        borderTopLeftRadius={0}
                        borderTopRightRadius={0}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          paddingHorizontal: 7,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={styles.shadow}
                          fontWeight="bold"
                          color="#576cd6"
                          fontSize="xl"
                        >
                          {match.displayName}
                        </Text>
                      </Column>
                    </Center>
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
        <Text
          fontWeight="bold"
          fontSize="md"
          color="#576cd6"
          marginTop={5}
          marginBottom={3}
        >
          Messages
        </Text>
        <Column space={3}>
          {list &&
            list.map((item, id) => {
              return (
                <TouchableOpacity
                  key={`message-${id}`}
                  onPress={() =>
                    navigation.navigate("Chat", { uid: item.receiver.id })
                  }
                >
                  <Row
                    space={3}
                    paddingHorizontal={10}
                    paddingVertical={15}
                    backgroundColor={"#e0e0e0"}
                    alignItems="center"
                    borderRadius={10}
                  >
                    <Avatar source={{ uri: item.receiver.images[0] }} size="lg">
                      FF
                    </Avatar>
                    <Column>
                      <Text fontWeight={"bold"} color="black" fontSize="xl">
                        {item.receiver.displayName}
                      </Text>
                      <Text maxWidth={280} color="black" isTruncated={true}>
                        {item.latestMessage.user._id === user.uid
                          ? `You: ${item.latestMessage.text}`
                          : item.latestMessage.text}
                      </Text>
                    </Column>
                  </Row>
                </TouchableOpacity>
              );
            })}
        </Column>
      </ScrollView>
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

export default MessageScreen;
