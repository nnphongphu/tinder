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
  useWindowDimensions,
  Animated,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Row, Text, Column, Center, Spinner } from "native-base";
import { TabView, SceneMap } from "react-native-tab-view";
import tw from "tailwind-react-native-classnames";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

const HistoryScreen = ({ route, navigation: navNavigation }) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [passesList, setPassesList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [swipesList, setSwipesList] = useState([]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "RIGHT SWIPES" },
    { key: "second", title: "LEFT SWIPES" },
  ]);

  const navigation = useNavigation();
  const { user } = useAuth();

  const FirstRoute = () => {
    const [mapper, setMapper] = useState([]);
    if (!swipesList)
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

    useEffect(() => {
      const indexes = Array.from(Array(swipesList).keys());
      let _mapper = [];
      for (let i = 0; i < indexes.length; i += 2)
        _mapper.push(indexes.slice(i, i + 2));
      setMapper(_mapper);
    }, [swipesList, passesList]);

    if (isLoading || !swipesList)
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
    else
      return (
        <ScrollView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
          <Column space={3} style={{ padding: 10 }}>
            {swipesList && swipesList.length === 0 && (
              <>
                <Center width="100%" marginTop={30}>
                  <Text textAlign="center">
                    There are no right swipes yet!{"\n"}Swipe away!
                  </Text>
                </Center>
                <Column alignItems="center" justifyContent="center">
                  <Image source={require("../assets/patient.png")} size="2xl" />
                </Column>
              </>
            )}
            {swipesList &&
              mapper.map((row, index) => {
                return (
                  <Row space={3} key={`row${index}`}>
                    {row.map((id, index2) => {
                      if (!swipesList[id]?.images[0]) return null;
                      return (
                        <TouchableOpacity
                          key={`item${index}${index2}`}
                          onPress={() =>
                            navigation.navigate("Profile", {
                              uid: swipesList[id].id,
                            })
                          }
                        >
                          <ImageBackground
                            source={{ uri: swipesList[id].images[0] }}
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
                                >{`${swipesList[id].displayName}, ${swipesList[id].age}`}</Text>
                                <Text
                                  style={styles.shadow}
                                  color="#576cd6"
                                  fontSize="xs"
                                >{`${
                                  swipesList[id].school || swipesList[id].job
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
      );
  };

  const SecondRoute = () => {
    const [mapper, setMapper] = useState([]);
    if (!passesList)
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

    useEffect(() => {
      const indexes = Array.from(Array(passesList).keys());
      let _mapper = [];
      for (let i = 0; i < indexes.length; i += 2)
        _mapper.push(indexes.slice(i, i + 2));
      setMapper(_mapper);
    }, [passesList, swipesList]);

    if (isLoading)
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
    else
      return (
        <ScrollView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
          <Column space={3} style={{ padding: 10 }}>
            {passesList && passesList.length === 0 && (
              <>
                <Center width="100%" marginTop={30}>
                  <Text textAlign="center">
                    There are no left swipes yet!{"\n"}Swipe away!
                  </Text>
                </Center>
                <Column alignItems="center" justifyContent="center">
                  <Image source={require("../assets/patient.png")} size="2xl" />
                </Column>
              </>
            )}
            {passesList &&
              mapper.map((row, index) => {
                return (
                  <Row space={3} key={`row2${index}`}>
                    {row.map((id, index2) => {
                      if (!passesList[id]?.images[0]) return null;
                      return (
                        <TouchableOpacity
                          key={`item1${index}${index2}`}
                          onPress={() =>
                            navigation.navigate("Profile", {
                              uid: passesList[id].id,
                            })
                          }
                        >
                          <ImageBackground
                            source={{ uri: passesList[id].images[0] }}
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
                                >{`${passesList[id].displayName}, ${passesList[id].age}`}</Text>
                                <Text
                                  style={styles.shadow}
                                  color="#576cd6"
                                  fontSize="xs"
                                >{`${
                                  passesList[id].school || passesList[id].job
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
      );
  };

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("tabPress", (e) => {
      setIsLoading(true);
      getAllProfiles();
      setIsLoading(false);
    });

    return unsubscribe;
  }, [navNavigation]);

  useEffect(() => {
    const unsubscribe = navNavigation.addListener("focus", (e) => {
      setIsLoading(true);
      getAllProfiles();
      setIsLoading(false);
    });

    return unsubscribe;
  }, [navNavigation]);

  const _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const _handleIndexChange = (index) => setIndex({ index });

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              key={`key${i}`}
              style={styles.tabItem}
              onPress={() => setIndex(i)}
            >
              <Animated.Text
                style={[{ opacity }, { fontWeight: "bold", color: "white" }]}
              >
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const getAllProfiles = async () => {
    const l = await db
      .collection("Users")
      .doc(user.uid)
      .collection("passes")
      .get();
    if (l && l.docs && l.docs.length) {
      let tl = [];
      l.docs.forEach((doc) => tl.push({ ...doc.data(), id: doc.id }));
      setPassesList(tl);
    } else if (l && l.docs) setPassesList([]);

    const m = await db
      .collection("Users")
      .doc(user.uid)
      .collection("match")
      .get();
    if (m && m.docs && m.docs.length) {
      let tm = [];
      m.docs.forEach((doc) => tm.push({ ...doc.data(), id: doc.id }));
      setMatchList(tm);
    } else if (m && m.docs) setMatchList([]);

    const r = await db
      .collection("Users")
      .doc(user.uid)
      .collection("swipes")
      .get();
    if (r && r.docs && r.docs.length) {
      let tr = [];
      r.docs.forEach((doc) => tr.push({ ...doc.data(), id: doc.id }));
      setSwipesList(tr);
    } else if (r && r.docs) setSwipesList([]);
  };

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  if (!fontLoaded) {
    return null;
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
        <TabView
          navigationState={{ index, routes }}
          renderScene={_renderScene}
          renderTabBar={_renderTabBar}
          onIndexChange={_handleIndexChange}
        />
      </>
    );
  }
};

export default HistoryScreen;

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
