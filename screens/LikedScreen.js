import { Avatar } from "@rneui/base";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ImageBackground,
  useWindowDimensions,
  Animated,
} from "react-native";
import { db } from "../firebaseConfig";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Row, Text, Column, Center, Spinner, Image } from "native-base";
import { TabView, SceneMap } from "react-native-tab-view";
import tw from "tailwind-react-native-classnames";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

const LikedScreen = ({ route, navigation: navNavigation }) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "RIGHT SWIPES" },
    { key: "second", title: "LEFT SWIPES" },
  ]);

  const navigation = useNavigation();
  const { user } = useAuth();
  const [mapper, setMapper] = useState([]);

  useEffect(() => {
    const indexes = Array.from(Array(profiles).keys());
    let _mapper = [];
    for (let i = 0; i < indexes.length; i += 2)
      _mapper.push(indexes.slice(i, i + 2));
    setMapper(_mapper);
  }, [profiles]);

  const getAllProfiles = async () => {
    setIsLoading(true);

    const allUsersSnapshot = await db.collection("Users").get();
    let allUsers = [];
    allUsersSnapshot.docs.forEach((doc) => {
      allUsers.push({ ...doc.data(), id: doc.id });
    });

    const isLikedBy = async (id) => {
      const t = await db
        .collection("Users")
        .doc(id)
        .collection("swipes")
        .doc(user.uid)
        .get();
      return t.exists;
    };
    let result = [];
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].id === user.uid) continue;
      const ans = await isLikedBy(allUsers[i].id);
      if (ans) result.push(allUsers[i]);
    }
    setProfiles(result);
    setIsLoading(false);
  };

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("tabPress", (e) => {
      getAllProfiles();
    });
    return unsubscribe;
  }, [navNavigation]);

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("onFocus", (e) => {
      getAllProfiles();
    });
    return unsubscribe;
  }, [navNavigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  if (!fontLoaded || !profiles) {
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
  } else {
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
        <View
          paddingVertical={16}
          width="100%"
          backgroundColor="#576cd6"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="sm" fontWeight="bold" color="white">
            LIKES RECEIVED
          </Text>
        </View>
        {profiles.length === 0 && (
          <>
            <Center width="100%" marginTop={30}>
              <Text textAlign="center">
                Be patient!{"\n"}Someone will be waiting for you soon.
              </Text>
            </Center>
            <Column alignItems="center" justifyContent="center">
              <Image source={require("../assets/patient.png")} size="2xl" />
            </Column>
          </>
        )}
        <ScrollView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
          <Column space={3} style={{ padding: 10 }}>
            {profiles &&
              mapper.map((row, index) => {
                return (
                  <Row space={3} key={`row${index}`}>
                    {row.map((id, index2) => {
                      if (!profiles[id]?.images[0]) return null;
                      return (
                        <TouchableOpacity
                          key={`item${index}${index2}`}
                          onPress={() =>
                            navigation.navigate("Profile", {
                              uid: profiles[id].id,
                            })
                          }
                        >
                          <ImageBackground
                            source={{ uri: profiles[id].images[0] }}
                            resizeMode="cover"
                            borderRadius={10}
                          >
                            <Center height={300} width={190} bg="transparent">
                              <Column
                                width="100%"
                                backgroundColor={"#ffffff"}
                                borderRadius={10}
                                borderTopLeftRadius={0}
                                borderTopRightRadius={0}
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  paddingHorizontal: 10,
                                  paddingVertical: 20,
                                }}
                              >
                                <Text
                                  style={styles.shadow}
                                  fontWeight="bold"
                                  color="#576cd6"
                                  fontSize="xl"
                                >{`${profiles[id].displayName}, ${profiles[id].age}`}</Text>
                                <Text
                                  style={styles.shadow}
                                  color="#576cd6"
                                  fontSize="xs"
                                >{`${
                                  profiles[id].school || profiles[id].job
                                }`}</Text>
                              </Column>
                            </Center>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    })}
                  </Row>
                );
              })}
          </Column>
        </ScrollView>
      </>
    );
  }
};

export default LikedScreen;

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
  containerBar: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#576cd6",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
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
});
