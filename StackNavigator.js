import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
//import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import useAuth from "./hooks/useAuth";
import ModalScreen from "./screens/ModalScreen";
import MatchScreen from "./screens/MatchScreen";
import MessageScreen from "./screens/MessageScreen";
import StartScreen from "./screens/StartScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccountScreen from "./screens/AccountScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#FE4C6A" },
  headerTitleStyle: { color: "black" },
  headerTintColor: "black",
};

export default function StackNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={globalScreenOptions}
    >
      {!user ? (
        <>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen
            options={{ title: "Sign In" }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      ) : (
        <>
          <Stack.Group>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen
              name="Profile"
              initialParams={{ uid: user.uid }}
              component={ProfileScreen}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                header: () => {
                  return null;
                },
              }}
            />
            <Stack.Screen
              name="Message"
              component={MessageScreen}
              options={{
                header: () => {
                  return null;
                },
              }}
            />
            <Stack.Screen
              options={{
                headerLeft: () => {
                  return null;
                },
              }}
              name="Home"
              initialParams={{ initialTab: "Feed" }}
              component={HomeScreen}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
              options={{
                header: () => {
                  return null;
                },
              }}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen
              name="Match"
              component={MatchScreen}
              options={{
                header: () => {
                  return null;
                },
              }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
