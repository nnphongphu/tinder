import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  TouchableOpacity,
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
} from "native-base";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ModalScreen = () => {
  const user = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
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
  const navigation = useNavigation();
  const incompleteForm = !bio || !age || !gender || images.length === 0;
  const updateUserProfile = () => {
    db.collection("Users")
      .doc(user.user.uid)
      .set(
        {
          images,
          bio,
          job,
          age,
          gender,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // useEffect(() => {
  //   const permission = async () => {
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     await ImagePicker.requestCameraPermissionsAsync();
  //   };
  //   permission();
  // }, []);

  useEffect(() => {
    const getData = async () => {
      const snapshot = await db.collection("Users").doc(user.user.uid).get();
      if (snapshot.exists) {
        const data = snapshot.data();
        console.log(data);
        setAge(data?.age);
        setBio(data?.bio);
        setGender(data?.gender);
        setImages(data?.images);
        setSchool(data?.school);
      }
    };
    getData();
  }, [user]);

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
    });
    console.log("taking a photo");
    _handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
    });
    console.log("just picking... ");
    _handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setImages([...images, uploadUrl]);
      }
    } catch (e) {
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const storageRef = ref(
      storage,
      `photos/${Math.round(Math.random() * 1000000000000).toString()}.jpg`
    );

    await uploadBytes(storageRef, blob);
    blob.close();

    //console.log("bie");

    const url = await getDownloadURL(storageRef);
    return url;
  }

  if (!fontLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        contentContainerStyle={styles.view}
        backgroundColor={"#576cd6"}
      >
        <ImageBackground
          source={require("../assets/bg4.png")}
          style={styles.container}
          resizeMode="contain"
          imageStyle={{
            bottom: images.length === 9 ? 1134 : 1364,
          }}
        >
          <Text
            fontSize="4xl"
            color="white"
            marginTop={300}
            style={{ fontFamily: "Lobster_400Regular" }}
          >
            Edit Profile
          </Text>
          <Text fontSize="lg" color="white" marginBottom={50}>
            Show the world what you've got!
          </Text>
          <Text
            color="white"
            fontSize="md"
            alignSelf="flex-start"
            fontWeight="bold"
            marginBottom={2}
            style={{ marginHorizontal: 10 }}
          >
            PHOTOS *
          </Text>
          <Column space={3}>
            {mapper.map((columns, index) => {
              return (
                <Row space={3} key={`columns${index}`}>
                  {columns.map((id, index2) => {
                    if (id >= images.length) {
                      return (
                        <Center
                          key={`item${index}${index2}`}
                          height={40}
                          width={120}
                          bg="transparent"
                          borderRadius={10}
                          borderStyle="dashed"
                          borderWidth={3}
                          borderColor="white"
                        />
                      );
                    } else {
                      return (
                        <ImageBackground
                          key={`item${index}${index2}`}
                          source={{ uri: images[id] }}
                          resizeMode="cover"
                          borderRadius={10}
                        >
                          <Center height={40} width={120} bg="transparent">
                            <AntDesign
                              name="closecircle"
                              size={20}
                              color="white"
                              style={styles.floatButton}
                              onPress={() =>
                                setImages([
                                  ...images.filter(
                                    (image) => image !== images[id]
                                  ),
                                ])
                              }
                            />
                          </Center>
                        </ImageBackground>
                      );
                    }
                  })}
                </Row>
              );
            })}
          </Column>
          <Text
            color="white"
            fontSize={"sm"}
            marginBottom={5}
            marginTop={2}
            alignSelf="flex-start"
            style={{ marginHorizontal: 12 }}
          >
            We recommend using authentic photos for greatest experience.
            Uploading all 9 photos to increase matching rate!
          </Text>
          {images.length <= 9 && (
            <>
              <TouchableOpacity marginTop={30} onPress={_pickImage}>
                <ImageBackground
                  source={require("../assets/gallery.png")}
                  resizeMode="cover"
                >
                  <Column width={310} height={100} paddingY={15} paddingX={15}>
                    <Text color="white" fontSize="md" alignSelf="flex-start">
                      Upload from
                    </Text>
                    <Text
                      color="white"
                      fontSize="3xl"
                      fontWeight="bold"
                      alignSelf="flex-start"
                    >
                      Gallery
                    </Text>
                  </Column>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 30 }} onPress={_takePhoto}>
                <ImageBackground
                  source={require("../assets/camera.png")}
                  resizeMode="cover"
                >
                  <Column width={310} height={100} paddingY={15} paddingX={15}>
                    <Text color="white" fontSize="md" alignSelf="flex-start">
                      Capture from
                    </Text>
                    <Text
                      color="white"
                      fontSize="3xl"
                      fontWeight="bold"
                      alignSelf="flex-start"
                    >
                      Camera
                    </Text>
                  </Column>
                </ImageBackground>
              </TouchableOpacity>
            </>
          )}
          <Column style={{ marginHorizontal: 10 }}>
            <Text
              color="white"
              fontWeight="bold"
              marginBottom={2}
              marginTop={50}
              alignSelf="flex-start"
            >
              ABOUT ME *
            </Text>
            <TextArea
              value={bio}
              onChangeText={(text) => setBio(text)}
              placeholder="Tell us all about you"
              style={styles.bio}
              w="100%"
              h={200}
              fontSize={"md"}
            />
            <Text
              color="white"
              fontSize={"sm"}
              marginBottom={2}
              marginTop={2}
              alignSelf="flex-start"
              textAlign="justify"
            >
              Do not include social media handles or any other contact
              information in your profile. Safety first.
            </Text>

            <Text
              color="white"
              fontWeight="bold"
              marginBottom={2}
              marginTop={5}
              alignSelf="flex-start"
            >
              GENDER *
            </Text>
            <Select
              minWidth="200"
              accessibilityLabel="Choose gender"
              placeholder="Choose gender"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              color="black"
              fontSize={"md"}
              backgroundColor="white"
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
            >
              <Select.Item label="Male" value="Male" />
              <Select.Item label="Female" value="Female" />
              <Select.Item label="Non binary" value="Non binary" />
              <Select.Item label="Rather not share" value="Undefined" />
            </Select>
            <Text
              color="white"
              fontWeight="bold"
              marginBottom={2}
              marginTop={5}
              alignSelf="flex-start"
            >
              AGE *
            </Text>
            <Input
              w="100%"
              value={age}
              onChangeText={(text) => setAge(text)}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Your age"
              fontSize={"md"}
            />
            <Text
              color="white"
              fontWeight="bold"
              marginBottom={2}
              marginTop={5}
              alignSelf="flex-start"
            >
              JOB TITLE
            </Text>
            <Input
              w="100%"
              value={job}
              onChangeText={(text) => setJob(text)}
              style={styles.input}
              placeholder="Your job"
              fontSize={"md"}
            />
            <Text
              color="white"
              fontWeight="bold"
              marginBottom={2}
              marginTop={5}
              alignSelf="flex-start"
            >
              EDUCATION
            </Text>
            <Input
              w="100%"
              value={school}
              onChangeText={(text) => setSchool(text)}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Your high school/university"
              fontSize={"md"}
            />
          </Column>
          <Button
            isDisabled={incompleteForm}
            onPress={updateUserProfile}
            style={styles.buttonInvert}
          >
            <Text
              fontSize="md"
              color="white"
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Update
            </Text>
          </Button>
        </ImageBackground>
      </ScrollView>
    );
  }
};

export default ModalScreen;

const styles = StyleSheet.create({
  view: {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#576cd6",
    width: "100%",
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
});
