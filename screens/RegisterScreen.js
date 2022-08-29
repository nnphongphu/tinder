import { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { Image } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
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

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  const register = async () => {
    try {
      setError("");
      await signUp(email, password);
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  if (!fontLoaded) {
    return null;
  } else {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require("../assets/bg2.png")}
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
            Register
          </Text>
          <Text fontSize="sm" color="white" marginBottom={30}>
            Create your account
          </Text>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={{
                base: "75%",
                md: "25%",
              }}
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              placeholder="Display Name"
            />
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
              value={password}
              style={styles.input}
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
          <Text fontSize="sm" color="white" width={300} marginTop={2}>
            By registering, you are agreeing to our Terms of Use and Privacy
            Policy
          </Text>
          <Button onPress={register} style={styles.button}>
            <Text
              fontSize="md"
              color="white"
              style={{ fontFamily: "Lobster_400Regular" }}
            >
              Register
            </Text>
          </Button>
          <Flex direction="row" marginTop={3}>
            <Text fontSize="sm" color="white">
              Already have an account?{" "}
            </Text>
            <Text
              fontSize="sm"
              onPress={() => navigation.navigate("Login")}
              style={styles.register}
            >
              Login
            </Text>
          </Flex>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
};

export default RegisterScreen;

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
    marginTop: 20,
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
