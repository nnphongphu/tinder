import { useLayoutEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Input, Image, Text } from "@rneui/themed";
import { Button } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebaseConfig";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigation = useNavigation();

  const register = async () => {
    try {
      setError("");
      console.log("HI");
      await signUp(email, password);
      console.log("Bye");
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
      headerTitleStyle: { color: "white" },
      headerTintColor: "white",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://cdn2.iconfinder.com/data/icons/social-media-icons-23/800/tinder-512.png",
        }}
        style={styles.image}
      />
      <Text h6 style={{ marginBottom: 50 }}>
        Create New Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          autoFocus
          placeholder="Full Name"
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          secureTextEntry
          placeholder="Password"
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button
        raised
        containerStyle={styles.button}
        onPress={register}
        title="Register"
      />
      <Button
        containerStyle={styles.button}
        type="link"
        onPress={() => navigation.navigate("Login")}
        title="I have an account"
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
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
