import {
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { Image, ThemeProvider } from "@rneui/themed";
import { useEffect, useLayoutEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import {
  Input,
  Icon,
  Stack,
  Button,
  Center,
  NativeBaseProvider,
  Flex,
  Text,
} from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { signIn, loading } = useAuth();
  const [show, setShow] = useState(false);

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const logIn = async () => {
    try {
      setError("");
      await signIn(email, password);
    } catch (err) {
      setError(err.message);
      alert(err);
    }
  };

  if (!fontLoaded) {
    return null;
  } else {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require("../assets/bg1.png")}
          resizeMode="cover"
          style={styles.container}
        >
          <AntDesign
            name="leftcircleo"
            size={50}
            color="white"
            style={styles.floatButton}
            onPress={() => navigation.navigate("StartScreen")}
          />
          <Text
            fontSize="4xl"
            color="white"
            style={{ fontFamily: "Lobster_400Regular" }}
            marginTop={20}
          >
            Welcome back!
          </Text>
          <Text fontSize="sm" color="white" marginBottom={30}>
            Login to your account
          </Text>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={{
                base: "75%",
                md: "25%",
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml="2"
                  color="white"
                />
              }
              placeholder="Email"
            />
            <Input
              w={{
                base: "75%",
                md: "25%",
              }}
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              type={show ? "text" : "password"}
              InputRightElement={
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="white"
                  onPress={() => setShow(!show)}
                />
              }
              placeholder="Password"
            />
          </Stack>
          <Button onPress={logIn} style={styles.button}>
            <Text
              fontSize="md"
              color="white"
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Sign In
            </Text>
          </Button>
          <Flex direction="row" marginTop={3}>
            <Text fontSize="sm" color="white">
              Don't have an account?{" "}
            </Text>
            <Text
              fontSize="sm"
              onPress={() => navigation.navigate("Register")}
              style={styles.register}
            >
              Sign up
            </Text>
          </Flex>
          {/* <Button onPress={() => navigation.navigate("Register")} rounded={"md"}>
        Register
      </Button> */}
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a5093",
    width: "100%",
    position: "relative",
  },
  button: {
    width: 300,
    marginTop: 100,
    borderRadius: 40,
    backgroundColor: "#4F67D8",
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
  floatButton: {
    position: "absolute",
    top: 30,
    left: 15,
  },
});
