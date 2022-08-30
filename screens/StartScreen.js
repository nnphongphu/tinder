import {
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Column, Spinner, Text } from "native-base";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";

const StartScreen = () => {
  const navigation = useNavigation();
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  if (!fontLoaded) {
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
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require("../assets/bg3.png")}
          resizeMode="cover"
          style={styles.container}
        >
          <Text
            fontSize="6xl"
            color="white"
            style={{ fontFamily: "Lobster_400Regular" }}
            marginTop={"200px"}
          >
            Platonic
          </Text>
          <Text fontSize="sm" color="white" marginBottom={30}>
            Can't seem to stay put? {"\n"}
            Join us. Join the initiative.
          </Text>
          <Button
            onPress={() => navigation.navigate("Login")}
            style={styles.button}
          >
            <Text
              fontSize="md"
              color="white"
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Login
            </Text>
          </Button>
          <Button
            onPress={() => navigation.navigate("Register")}
            style={styles.buttonInvert}
          >
            <Text
              fontSize="md"
              color="white"
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Sign up
            </Text>
          </Button>
          {/* <Button onPress={() => navigation.navigate("Register")} rounded={"md"}>
        Register
      </Button> */}
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a5093",
    width: "100%",
  },
  button: {
    width: 300,
    marginTop: 40,
    borderRadius: 40,
    backgroundColor: "#4F67D8",
  },
  buttonInvert: {
    width: 300,
    marginTop: 10,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#4F67D8",
  },
  input: {
    backgroundColor: "transparent",
    color: "white",
  },
  inputContainer: {
    width: 300,
  },
  register: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
