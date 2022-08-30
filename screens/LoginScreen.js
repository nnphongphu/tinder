import {
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { Image, ThemeProvider } from "@rneui/themed";
import { useEffect, useLayoutEffect, useState } from "react";
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
  Spinner,
  Column,
} from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { Modal, FormControl } from "native-base";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { signIn, loading, resetPassword } = useAuth();
  const [show, setShow] = useState(false);

  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

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
          <Flex direction="row-reverse" marginTop={2}>
            <Text
              fontSize="sm"
              onPress={() => setModalVisible(true)}
              style={{
                alignItems: "flex-start",
                color: "white",
                fontWeight: "bold",
                justifyContent: "flex-end",
              }}
            >
              Forgot Password?
            </Text>
          </Flex>
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
        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          avoidKeyboard
          justifyContent="flex-end"
          bottom="300"
          size="lg"
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header style={{ color: "white" }}>
              Forgot Password?
            </Modal.Header>
            <Modal.Body>
              Enter email address and we'll send a link to reset your password.
              <FormControl mt="3">
                <FormControl.Label>Email</FormControl.Label>
                <Input value={email} onChangeText={(text) => setEmail(text)} />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button
                flex="1"
                onPress={() => {
                  resetPassword(email);
                  setModalVisible(false);
                }}
                style={styles.button1}
              >
                Proceed
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
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
  button1: {
    width: 300,
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
