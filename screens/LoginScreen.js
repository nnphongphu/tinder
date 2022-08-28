import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Image, ThemeProvider } from "@rneui/themed";
import { Button } from "@rneui/base";
import { useEffect, useLayoutEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { Input, Icon, Stack, Center, NativeBaseProvider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { signIn, loading } = useAuth();

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

  const EmailAndPasswordInput = () => {
    const [show, setShow] = useState(false);
    return (
      <Stack space={4} w="100%" alignItems="center">
        <Input
          w={{
            base: "75%",
            md: "25%",
          }}
          onChangeText={(text) => setEmail(text)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="person" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          placeholder="Email"
        />
        <Input
          w={{
            base: "75%",
            md: "25%",
          }}
          onChangeText={(text) => setPassword(text)}
          type={show ? "text" : "password"}
          InputRightElement={
            <Icon
              as={
                <MaterialIcons name={show ? "visibility" : "visibility-off"} />
              }
              size={5}
              mr="2"
              color="muted.400"
              onPress={() => setShow(!show)}
            />
          }
          placeholder="Password"
        />
      </Stack>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image
        source={{
          uri: "https://cdn2.iconfinder.com/data/icons/social-media-icons-23/800/tinder-512.png",
        }}
        style={styles.image}
      />
      <EmailAndPasswordInput />
      <Button
        raised
        containerStyle={styles.button}
        color="#FE4C6A"
        onPress={logIn}
        title="Sign In"
      />
      <Button
        containerStyle={styles.button}
        type="link"
        onPress={() => navigation.navigate("Register")}
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 10,
  },

  inputContainer: {
    width: 300,
  },
});
