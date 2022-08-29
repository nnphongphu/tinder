import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import { db } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import {
  Text,
  TextArea,
  Column,
  Input,
  Button,
  FormControl,
  Select,
  CheckIcon,
  Row,
  Center,
  Avatar,
} from "native-base";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const AccountScreen = () => {
  const user = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const mapper = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 9],
  ];
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });
  const { logOut } = useAuth();
  const navigation = useNavigation();
  const [isFirstTimer, setIsFirstTimer] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const snapshot = await db.collection("Users").doc(user.user.uid).get();
      if (snapshot.exists) {
        const data = snapshot.data();
        if (!data?.bio) {
          setIsFirstTimer(true);
        }
        setAge(data?.age);
        setBio(data?.bio);
        setGender(data?.gender);
        setJob(data?.job);
        setDisplayName(data?.displayName);
        if (data?.images) setImages(data?.images);
        setSchool(data?.school);
      }
      setIsLoading(false);
    };
    getData();
  }, [user]);

  if (!fontLoaded || isLoading) {
    return null;
  } else {
    return (
      <KeyboardAvoidingView style={styles.bg} backgroundColor={"#ffffff"}>
        <ImageBackground
          source={require("../assets/bg5.png")}
          resizeMode="stretch"
          style={styles.bg}
        >
          <Column w="100%" alignItems={"center"}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", { uid: user.user.uid })
              }
            >
              <Avatar
                bg="#f0f0f0"
                marginTop={30}
                source={
                  images
                    ? {
                        uri: images[0],
                      }
                    : undefined
                }
                size="2xl"
              >
                UR
                <Avatar.Badge bg="green.500" />
              </Avatar>
            </TouchableOpacity>
            <Text fontSize="4xl" color="black" marginTop={30} fontWeight="bold">
              {`${displayName}, ${age}`}
            </Text>
            <Text fontSize="lg" color="black" marginBottom={50}>
              Show the world what you've got!
            </Text>
            <Row space={10} paddingBottom={30}>
              <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                <AntDesign
                  name="edit"
                  size={40}
                  color="#3a5093"
                  style={styles.circleButton}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <AntDesign
                  name="setting"
                  size={40}
                  color="#3a5093"
                  style={[
                    styles.circleButton,
                    { transform: [{ translateY: 30 }] },
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={logOut}>
                <AntDesign
                  name="logout"
                  size={40}
                  color="#f05093"
                  style={styles.circleButton}
                />
              </TouchableOpacity>
            </Row>
          </Column>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
};

export default AccountScreen;

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#ffffff",
    width: "100%",
  },
  container: {
    justifyContent: "center",
    backgroundColor: "#ffffff",
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
  circleButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 60,
  },
  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    position: "relative",
  },
});
