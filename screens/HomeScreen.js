import { Avatar } from "@rneui/base";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { db } from "../firebaseConfig";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import Swiper from "react-native-deck-swiper";
import firebase from "firebase/compat/app";
import { ThemeConsumer } from "@rneui/themed";
import { Platform } from "react-native";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalScreen from "./ModalScreen";
import ProfileScreen from "./ProfileScreen";
import AccountScreen from "./AccountScreen";
import { Row, Text } from "native-base";
import ChatScreen from "./ChatScreen";

const Tab = createMaterialBottomTabNavigator();

const HomeScreen = ({ route }) => {
  function Profile() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Modal")}
        ></TouchableOpacity>
      </View>
    );
  }

  function Notifications() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Notifications!</Text>
      </View>
    );
  }
  const [chats, setChats] = useState([]);
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passesList, setPassesList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [swipesList, setSwipesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigation = useNavigation();
  const { user, logOut } = useAuth();
  const swipeRef = useRef();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const getAllProfiles = async () => {
      const allUsersSnapshot = await db.collection("Users").get();
      let allUsers = [];
      allUsersSnapshot.docs.forEach((doc) => {
        allUsers.push({ ...doc.data(), id: doc.id });
      });

      const l = await db
        .collection("Users")
        .doc(user.uid)
        .collection("passes")
        .get();
      if (l && l.docs && l.docs.length) {
        let tl = [];
        l.docs.forEach((doc) => tl.push(doc.id));
        setPassesList(tl);
      }

      const m = await db
        .collection("Users")
        .doc(user.uid)
        .collection("match")
        .get();
      if (m && m.docs && m.docs.length) {
        let tm = [];
        m.docs.forEach((doc) => tm.push(doc.id));
        setMatchList(tm);
      }

      const r = await db
        .collection("Users")
        .doc(user.uid)
        .collection("swipes")
        .get();
      if (r && r.docs && r.docs.length) {
        let tr = [];
        r.docs.forEach((doc) => tr.push(doc.id));
        setSwipesList(tr);
      }

      const filterUsers = allUsers.filter(
        (u) =>
          !swipesList.includes(u.id) &&
          !passesList.includes(u.id) &&
          !matchList.includes(u.id) &&
          u.images &&
          u.images.length >= 1 &&
          u.id !== user.uid
      );

      setProfiles(filterUsers);
      setIsLoading(false);
    };
    getAllProfiles();
  }, [user]);

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const swipeLeft = async (cardIndex) => {
    const { id: uid, ...profile } = profiles[cardIndex];
    try {
      setCurrentIndex(cardIndex);
      await db
        .collection("Users")
        .doc(user.uid)
        .collection("passes")
        .doc(uid)
        .set(profile);

      await db
        .collection("Users")
        .doc(user.uid)
        .collection("swipes")
        .doc(uid)
        .delete();

      await db
        .collection("Users")
        .doc(user.uid)
        .collection("match")
        .doc(uid)
        .delete();
      await db
        .collection("Users")
        .doc(uid)
        .collection("match")
        .doc(user.uid)
        .delete();
    } catch (error) {
      alert(error);
    }
  };

  const swipeRight = async (cardIndex) => {
    const { id: uid, ...profile } = profiles[cardIndex];
    try {
      setCurrentIndex(cardIndex);
      const loggedInProfileSnapshot = await db
        .collection("Users")
        .doc(user.uid)
        .get();

      const loggedInProfile = loggedInProfileSnapshot.data();

      const matchedProfileSnapshot = await db
        .collection("Users")
        .doc(uid)
        .collection("swipes")
        .doc(user.uid)
        .get();

      if (!matchedProfileSnapshot.exists) {
        await db
          .collection("Users")
          .doc(user.uid)
          .collection("swipes")
          .doc(uid)
          .set(profile);

        await db
          .collection("Users")
          .doc(user.uid)
          .collection("passes")
          .doc(uid)
          .delete();
      } else {
        await db
          .collection("Users")
          .doc(user.uid)
          .collection("match")
          .doc(uid)
          .set(profile);

        await db
          .collection("Users")
          .doc(uid)
          .collection("match")
          .doc(user.uid)
          .set(loggedInProfile);
      }
    } catch (error) {
      alert(error);
    }
  };

  const Feed = () => {
    if (isLoading || !user) {
      return null;
    } else {
      return (
        <SafeAreaView style={[tw`flex-1`]}>
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
          <View style={tw`flex-1 -mt-14`}>
            <Swiper
              ref={swipeRef}
              useViewOverflow={Platform.OS === "ios"}
              containerStyle={{ backgroundColor: "transparent" }}
              cards={profiles}
              cardIndex={0}
              animateCardOpacity
              onSwipedLeft={(cardIndex) => {
                swipeLeft(cardIndex);
              }}
              onSwipedRight={(cardIndex) => {
                swipeRight(cardIndex);
              }}
              onSwipedTop={(cardIndex) => {
                swipeRight(cardIndex);
              }}
              onSwipedBottom={(cardIndex) => {
                swipeLeft(cardIndex);
              }}
              renderCard={(card) =>
                card ? (
                  <TouchableOpacity
                    key={card.id}
                    style={tw`relative bg-white h-3/4 rounded-xl`}
                    onPress={() =>
                      navigation.navigate("Profile", { uid: card.id })
                    }
                  >
                    <Image
                      style={tw`absolute top-0 h-full w-full rounded-xl`}
                      source={{ uri: card.images[0] }}
                    />
                    <View
                      style={[
                        tw`absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl`,
                        styles.cardShadow,
                        { backgroundColor: "#576cd6" },
                      ]}
                    >
                      <View>
                        <Text style={tw`text-xl font-bold`} color="white">
                          {card.displayName}
                        </Text>
                        <Text color="white">{card.job}</Text>
                      </View>
                      <Text style={tw`text-2xl font-bold`} color="white">
                        {card.age}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                      styles.cardShadow,
                      { backgroundColor: "#576cd6" },
                    ]}
                  >
                    <Text style={tw`font-bold pb-5`} color="white">
                      No more profiles
                    </Text>
                    <Image
                      height={50}
                      width={50}
                      source={{
                        uri: "https://dikpora.jogjaprov.go.id/web_lama/assets/images/icon/no_data.png",
                      }}
                    />
                  </View>
                )
              }
            />
          </View>
          <Row
            alignSelf={"center"}
            justifyContent="center"
            marginBottom={30}
            paddingY={5}
            space={30}
            width={"90%"}
            borderRadius={20}
          >
            <TouchableOpacity
              onPress={() =>
                swipeRef.current.jumpToCardIndex(
                  currentIndex === 0 ? 0 : currentIndex - 1
                )
              }
            >
              <AntDesign name="back" size={50} color="#576cd6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()}>
              <AntDesign
                name="minuscircle"
                size={50}
                color="#576cd6"
                style={{ translateY: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => swipeRef.current.swipeRight()}>
              <AntDesign
                name="pluscircle"
                size={50}
                color="#576cd6"
                style={{ translateY: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentIndex >= 0 && currentIndex < profiles.length) {
                  navigation.navigate("Profile", {
                    uid: profiles[currentIndex].id,
                  });
                }
              }}
            >
              <AntDesign name="search1" size={50} color="#576cd6" />
            </TouchableOpacity>
          </Row>
          {/* End of Cards */}
          {/* <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
        >
          <Entypo name="cross" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
        >
          <AntDesign name="heart" size={24} />
        </TouchableOpacity>
      </View> */}
        </SafeAreaView>
      );
    }
  };

  if (!fontLoaded) {
    return null;
  } else {
    return (
      <>
        <Tab.Navigator
          initialRouteName={
            route?.params?.initialTab ? route?.params?.initialTab : "Feed"
          }
          activeColor="#576cd6"
          labeled={false}
          barStyle={{ backgroundColor: "#f0f0f0" }}
        >
          <Tab.Screen
            name="Notifications"
            component={ModalScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="bell" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Feed"
            component={Feed}
            options={{
              tabBarIcon: () => (
                <TouchableOpacity>
                  <Image
                    style={tw`h-8 w-8`}
                    source={require("../assets/logo.png")}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            initialParams={{ uid: user.uid }}
            options={{
              tabBarIcon: ({ color }) => (
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="account"
                    color={color}
                    size={26}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Chat"
            component={ChatScreen}
            initialParams={{ uid: user.uid }}
            options={{
              tabBarIcon: ({ color }) => (
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="message-text"
                    color={color}
                    size={26}
                  />
                </TouchableOpacity>
              ),
            }}
          />
        </Tab.Navigator>
      </>
    );
  }

  // useLayoutEffect(
  //   () =>
  //     db.collection("Users").onSnapshot((snapshot) => {
  //       if (!snapshot.docs.length) {
  //         navigation.navigate("Modal");
  //       }
  //     }),
  //   []
  // );
  // const enterChat = (id, chatName) => {
  //   navigation.navigate("Chat", {
  //     id,
  //     chatName,
  //   });
  // };

  // const swipeLeft = async (cardIndex) => {
  //   if (!profiles[cardIndex]) return;
  //   const userSwiped = profiles[cardIndex];
  //   try {
  //     db.collection("Users")
  //       .doc(user.uid)
  //       .collection("passes")
  //       .doc(userSwiped.id)
  //       .set(userSwiped);
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  // const swipeRight = async (cardIndex) => {
  //   if (!profiles[cardIndex]) return;
  //   const userSwiped = profiles[cardIndex];
  //   let loggedInProfile, matchedProfile;

  //   await await db
  //     .collection("Users")
  //     .doc(user.uid)
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         loggedInProfile = doc.data();
  //       } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document1!");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Error getting document:", error);
  //     });

  //   await await db
  //     .collection("Users")
  //     .doc(userSwiped.id.trim())
  //     .collection("swipes")
  //     .doc(user.uid)
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         // user has matched with you before you matched with them...
  //         matchedProfile = doc.data();

  //         // Create a match...
  //         db.collection("Matches")
  //           .doc(user.uid + userSwiped.id)
  //           .set({
  //             users: {
  //               [user.uid]: loggedInProfile,
  //               [userSwiped.id]: userSwiped,
  //             },
  //             userMatched: [user.uid, userSwiped.id],
  //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //           })
  //           .then(() => {
  //             navigation.navigate("Match", {
  //               loggedInProfile,
  //               userSwiped,
  //             });
  //           })
  //           .catch((error) => {
  //             alert(error);
  //           });
  //       } else {
  //         console.log("No such document2!");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Error getting document:", error);
  //     });

  //   try {
  //     db.collection("Users")
  //       .doc(user.uid)
  //       .collection("swipes")
  //       .doc(userSwiped.id)
  //       .set(userSwiped);
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between pt-20`}>
        <TouchableOpacity onPress={logOut}>
          <Image
            style={tw`h-10 w-10 rounded-full`}
            source={{
              uri: user?.photoURL
                ? user?.photoURL
                : "https://i.pinimg.com/originals/ec/61/d3/ec61d3114cc5269485d508244f531bdf.png",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={tw`h-14 w-14`} source={require("../assets/logo.png")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Cards */}
      <View style={tw`flex-1 -mt-6`}>
        {/* <Swiper
          ref={swipeRef}
          useViewOverflow={Platform.OS === "ios"}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: "Nope",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "Match",
              style: {
                label: {
                  color: "#4ded30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw`relative bg-white h-3/4 rounded-xl`}
              >
                <Image
                  style={tw`absolute top-0 h-full w-full rounded-xl`}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw`absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl`,
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw`text-xl font-bold`}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                  styles.cardShadow,
                ]}
              >
                <Text style={tw`font-bold pb-5`}>No more profiles</Text>
                <Image
                  style={tw`h-20 w-full`}
                  height={100}
                  width={100}
                  source={{
                    uri: "https://dikpora.jogjaprov.go.id/web_lama/assets/images/icon/no_data.png",
                  }}
                />
              </View>
            )
          }
        /> */}
      </View>
      {/* End of Cards */}
      {/* <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
        >
          <Entypo name="cross" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
        >
          <AntDesign name="heart" size={24} />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a5093",
    width: "100%",
    position: "relative",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
