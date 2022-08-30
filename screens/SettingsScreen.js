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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import {
  Text,
  Column,
  Avatar,
  Spinner,
  Select,
  CheckIcon,
  Button,
  Center,
} from "native-base";
import { useLayoutEffect } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomLabel from "../components/CustomLabel";
import { Root, Popup } from "popup-ui";

const SettingsScreen = () => {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [genderPreference, setGenderPreference] = useState("All");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const snapshot = await db.collection("Users").doc(user.user.uid).get();
      if (snapshot.exists) {
        const data = snapshot.data();
        if (data?.genderPreference) setGenderPreference(data?.genderPreference);
        if (data?.minAge) setMinAge(data?.minAge);
        if (data?.maxAge) setMaxAge(data?.maxAge);
      }
      setIsLoading(false);
    };
    getData();
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleChangeAgePreference = (values) => {
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };

  const updateUserProfile = () => {
    db.collection("Users")
      .doc(user.user.uid)
      .set(
        {
          minAge,
          maxAge,
          genderPreference,
        },
        { merge: true }
      )
      .then(() => {
        Popup.show({
          type: "Success",
          title: "Update complete",
          button: true,
          textBody: "Congrats! Your profile is updated successfully!",
          buttonText: "Ok",
          callback: () => {
            Popup.hide();
            navigation.navigate("Home", { initialTab: "Account" });
          },
        });
      })
      .catch((error) => {
        alert(error);
      });
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
        <KeyboardAvoidingView style={styles.bg} backgroundColor={"#ffffff"}>
          <ImageBackground
            source={require("../assets/bg6.png")}
            resizeMode="stretch"
            style={styles.bg}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Home", { initialTab: "Account" })
              }
              style={styles.floatButtonBack}
            >
              <AntDesign name="leftcircleo" size={50} color="white" />
            </TouchableOpacity>
            <Text
              fontSize="4xl"
              color="white"
              marginTop={200}
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Settings
            </Text>
            <Text fontSize="lg" color="white" marginBottom={30}>
              Just as you prefer.
            </Text>
            <View style={styles.view}>
              <Text
                color="white"
                fontWeight="bold"
                marginBottom={2}
                marginTop={5}
                alignSelf="flex-start"
              >
                GENDER PREFERENCE
              </Text>
              <Select
                minWidth="200"
                accessibilityLabel="Choose gender preference"
                placeholder="Choose gender preference"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                color="black"
                fontSize={"md"}
                backgroundColor="white"
                selectedValue={genderPreference}
                onValueChange={(value) => setGenderPreference(value)}
              >
                <Select.Item label="Male" value="Male" />
                <Select.Item label="Female" value="Female" />
                <Select.Item label="All" value="All" />
              </Select>
              <Text
                color="white"
                fontWeight="bold"
                marginBottom={2}
                marginTop={5}
                alignSelf="flex-start"
              >
                AGE PREFERENCE
              </Text>
              <View
                display="flex"
                width="100%"
                justifyContent="center"
                paddingHorizontal={10}
              >
                <MultiSlider
                  values={[minAge, maxAge]}
                  sliderLength={370}
                  onValuesChange={handleChangeAgePreference}
                  min={0}
                  max={100}
                  step={1}
                  allowOverlap={false}
                  snapped
                  minMarkerOverlapDistance={40}
                  //   customMarker={CustomMarker}
                  customLabel={CustomLabel}
                  trackStyle={{
                    height: 10,
                    backgroundColor: "#bebebe",
                    borderRadius: 5,
                  }}
                  selectedStyle={{
                    backgroundColor: "#e30b36",
                    borderRadius: 0,
                  }}
                  markerStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "white",
                    transform: [{ translateY: 5 }],
                  }}
                  pressedMarkerStyle={{
                    height: 30,
                    width: 30,
                  }}
                  enableLabel={true}
                />
              </View>
              <Center>
                <Button onPress={updateUserProfile} style={styles.buttonInvert}>
                  <Text fontSize="md" color="white" fontWeight="bold">
                    Update
                  </Text>
                </Button>
              </Center>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </Root>
    );
  }
};

export default SettingsScreen;

const styles = StyleSheet.create({
  view: {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#576cd6",
    width: "100%",
    paddingHorizontal: 10,
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
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    position: "relative",
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
