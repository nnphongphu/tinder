import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { Text, Column, Button } from "native-base";

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
  const { uid } = route.params;
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });
  const navigation = useNavigation();

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
      }
      setIsLoading(false);
    };
    getData();
  }, [user]);

  if (!fontLoaded || isLoading) {
    return null;
  } else {
    return (
      <ScrollView contentContainerStyle={styles.view} backgroundColor={"white"}>
        <AntDesign
          name="leftcircleo"
          size={50}
          color="#576cd6"
          style={styles.floatButtonBack}
          onPress={() => navigation.navigate("Home")}
        />
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
              {school && (
                <Text
                  fontSize={"md"}
                  color="white"
                  fontWeight={"bold"}
                  marginLeft={30}
                  marginBottom={30}
                >
                  {school}
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
        {images.length > 1 &&
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
            {job || "Not declared yet"}
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
      </ScrollView>
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
    width: 300,
    marginTop: 5,
    borderRadius: 40,
    marginBottom: 30,
    backgroundColor: "#4F67D8",
  },
});
