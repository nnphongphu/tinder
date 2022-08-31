import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import {
  Text,
  Column,
  Button,
  Row,
  Image,
  Spinner,
  Avatar,
  Center,
} from "native-base";
import { Root, Popup } from "popup-ui";

const ProfileScreen = ({ route }) => {
  const user = useAuth();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const [passesList, setPassesList] = useState([]);
  const [swipesList, setSwipesList] = useState([]);
  const [matchList, setMatchList] = useState([]);

  const { uid } = route.params;
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });
  const navigation = useNavigation();

  const profile = { displayName, job, age, images, bio, school, gender };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      const snapshot = await db.collection("Users").doc(uid).get();
      if (snapshot.exists) {
        const data = snapshot.data();
        setAge(data?.age);
        setBio(data?.bio);
        setGender(data?.gender);
        setJob(data?.job);
        setImages(data?.images);
        setSchool(data?.school);
        setDisplayName(data?.displayName);

        const l = await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("passes")
          .get();
        if (l && l.docs && l.docs.length) {
          let tl = [];
          l.docs.forEach((doc) => tl.push(doc.id));
          setPassesList(tl);
        }

        const m = await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("match")
          .get();
        if (m && m.docs && m.docs.length) {
          let tm = [];
          m.docs.forEach((doc) => tm.push(doc.id));
          setMatchList(tm);
        }

        const r = await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("swipes")
          .get();
        if (r && r.docs && r.docs.length) {
          let tr = [];
          r.docs.forEach((doc) => tr.push(doc.id));
          setSwipesList(tr);
        }
      }
      setIsLoading(false);
    };
    getData();
  }, [user]);

  const swipeLeft = async () => {
    try {
      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("passes")
        .doc(uid)
        .set(profile);

      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("swipes")
        .doc(uid)
        .delete();

      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("match")
        .doc(uid)
        .delete();
      await db
        .collection("Users")
        .doc(uid)
        .collection("match")
        .doc(user.user.uid)
        .delete();
      navigation.navigate("Home");
    } catch (error) {
      alert(error);
    }
  };

  const swipeRight = async () => {
    try {
      const loggedInProfileSnapshot = await db
        .collection("Users")
        .doc(user.user.uid)
        .get();

      const loggedInProfile = loggedInProfileSnapshot.data();

      const matchedProfileSnapshot = await db
        .collection("Users")
        .doc(uid)
        .collection("swipes")
        .doc(user.user.uid)
        .get();

      if (!matchedProfileSnapshot.exists) {
        await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("swipes")
          .doc(uid)
          .set(profile);

        await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("passes")
          .doc(uid)
          .delete();
      } else {
        await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("match")
          .doc(uid)
          .set(profile);

        await db
          .collection("Users")
          .doc(uid)
          .collection("match")
          .doc(user.user.uid)
          .set(loggedInProfile);

        await db
          .collection("Users")
          .doc(uid)
          .collection("swipes")
          .doc(user.user.uid)
          .delete();

        await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("swipes")
          .doc(uid)
          .delete();

        await db
          .collection("Users")
          .doc(user.user.uid)
          .collection("passes")
          .doc(uid)
          .delete();

        Popup.show({
          type: "Success",
          title: "Matched!",
          button: true,
          icon:
            loggedInProfile && images ? (
              <Avatar.Group
                _avatar={{
                  size: "xl",
                }}
                style={{ transform: [{ translateY: -10 }] }}
                max={2}
              >
                <Avatar
                  bg="green.500"
                  source={{
                    uri: loggedInProfile.images[0],
                  }}
                >
                  I
                </Avatar>
                <Avatar
                  bg="cyan.500"
                  source={{
                    uri: images[0],
                  }}
                >
                  U
                </Avatar>
              </Avatar.Group>
            ) : (
              false
            ),
          textBody:
            "You twos found each other! Take the lead by texting first!",
          buttonText: "Ok",
          callback: () => {
            Popup.hide();
            navigation.navigate("Home");
          },
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  const unmatch = async () => {
    try {
      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("swipes")
        .doc(uid)
        .delete();

      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("passes")
        .doc(uid)
        .delete();

      await db
        .collection("Users")
        .doc(user.user.uid)
        .collection("match")
        .doc(uid)
        .delete();
      await db
        .collection("Users")
        .doc(uid)
        .collection("match")
        .doc(user.user.uid)
        .delete();
      navigation.navigate("Home");
    } catch (error) {
      alert(error);
    }
  };

  if (!fontLoaded || isLoading) {
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
      <Root>
        <ScrollView
          contentContainerStyle={styles.view}
          backgroundColor={"white"}
        >
          <TouchableOpacity
            style={styles.floatButtonBack}
            onPress={() =>
              navigation.navigate("Home", { initialTab: "Account" })
            }
          >
            <AntDesign name="leftcircleo" size={50} color="#576cd6" />
          </TouchableOpacity>
          <Column>
            <ImageBackground
              source={{ uri: images ? images[0] : "" }}
              resizeMode="cover"
              borderRadius={15}
            >
              <Column w="full" h="xl">
                <Text
                  fontSize={"4xl"}
                  color="white"
                  fontWeight={"bold"}
                  marginTop={"auto"}
                  marginLeft={30}
                  style={styles.shadow}
                >
                  {`${displayName}, ${age}`}
                </Text>
                {school ? (
                  <Text
                    fontSize={"md"}
                    color="white"
                    fontWeight={"bold"}
                    marginLeft={30}
                    marginBottom={30}
                  >
                    {school}
                  </Text>
                ) : (
                  <Text
                    fontSize={"md"}
                    color="white"
                    fontWeight={"bold"}
                    marginLeft={30}
                    marginBottom={30}
                  >
                    {gender}
                  </Text>
                )}
              </Column>
            </ImageBackground>
          </Column>
          <Text
            color="#576cd6"
            fontSize="lg"
            fontWeight="bold"
            alignSelf="flex-start"
            marginTop={5}
            style={{ marginHorizontal: 10 }}
          >
            ABOUT ME
          </Text>
          <Text
            color="black"
            fontSize="lg"
            alignSelf="flex-start"
            style={{ marginHorizontal: 10 }}
            marginBottom={5}
          >
            {bio}
          </Text>
          {images &&
            images.length > 1 &&
            images.map((image, index) => {
              if (index >= 1)
                return (
                  <Column key={`${image}-${index}`}>
                    <ImageBackground
                      source={{ uri: image }}
                      resizeMode="cover"
                      borderRadius={15}
                      marginTop={5}
                      marginBottom={5}
                    >
                      <Column w="full" h="xl" />
                    </ImageBackground>
                  </Column>
                );
            })}
          <Column
            bgColor={"#f0f0f0"}
            borderRadius={8}
            marginTop={5}
            marginBottom={5}
          >
            <Text
              color="#576cd6"
              fontSize="lg"
              fontWeight="bold"
              alignSelf="flex-start"
              marginTop={5}
              style={{ marginHorizontal: 10 }}
            >
              JOB TITLE
            </Text>
            <Text
              color="black"
              fontSize="lg"
              alignSelf="flex-start"
              marginBottom={5}
              style={{ marginHorizontal: 10 }}
            >
              {!!job || "Not declared yet"}
            </Text>
          </Column>
          {uid === user.user.uid && (
            <Button
              onPress={() => navigation.navigate("Modal")}
              style={styles.button}
            >
              <Text fontSize="md" color="white" fontWeight={"bold"}>
                Edit Profile
              </Text>
            </Button>
          )}
          {uid !== user.user.uid && matchList && !matchList.includes(uid) ? (
            <Row
              alignSelf={"center"}
              justifyContent="center"
              marginBottom={30}
              paddingY={5}
              space={30}
              width={"100%"}
              bgColor={"#f0f0f0"}
            >
              <TouchableOpacity onPress={swipeLeft}>
                <AntDesign name="minuscircle" size={50} color="#576cd6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Entypo name="home" size={50} color={"#576cd6"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={swipeRight}>
                <AntDesign name="pluscircle" size={50} color="#576cd6" />
              </TouchableOpacity>
            </Row>
          ) : null}
          {uid !== user.user.uid && matchList && matchList.includes(uid) ? (
            <>
              <Button
                onPress={() => navigation.goBack()}
                style={[styles.button, { marginBottom: 5 }]}
              >
                <Text fontSize="md" color="white" fontWeight={"bold"}>
                  Message {" <3"}
                </Text>
              </Button>
              <Button
                onPress={() => {
                  unmatch();
                  navigation.goBack();
                }}
                style={[styles.button, { backgroundColor: "#e6002a" }]}
              >
                <Text fontSize="md" color="white" fontWeight={"bold"}>
                  Unmatch {" </3"}
                </Text>
              </Button>
            </>
          ) : null}
        </ScrollView>
      </Root>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  view: {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 100,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#576cd6",
    width: "100%",
  },
  bio: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "white",
    color: "black",
  },
  inputContainer: {
    width: "100%",
  },
  buttonInvert: {
    width: 300,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
  },
  floatButton: {
    position: "absolute",
    right: -5,
    top: -5,
  },
  floatButtonBack: {
    position: "absolute",
    top: 30,
    left: 15,
  },
  shadow: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    alignSelf: "center",
    width: 200,
    marginTop: 5,
    borderRadius: 40,
    marginBottom: 30,
    backgroundColor: "#4F67D8",
  },
});
