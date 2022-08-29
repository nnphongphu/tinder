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
} from "native-base";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    let [fontLoaded] = useFonts({
      Lobster_400Regular,
    });
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Forgot Password Screen</Text>
    </View>

    )
   
  }

    export default ForgotPasswordScreen;