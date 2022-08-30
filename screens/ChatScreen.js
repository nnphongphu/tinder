import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import {  Box, FlatList, Heading, Avatar, HStack, VStack, Text, Spacer, Center, NativeBaseProvider } from "native-base";

const ProfileScreen = ({ route }) => {
  const user = useAuth();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const [passesList, setPassesList] = useState([]);
  const [swipesList, setSwipesList] = useState([]);
  const [matchList, setMatchList] = useState([]);

  const { uid } = route.params;
  let [fontLoaded] = useFonts({
    Lobster_400Regular,
  });
  const navigation = useNavigation();

  const profile = { displayName, job, age, images, bio, school, gender };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      console.log(user.user.uid);
      const snapshot = await db.collection("Users").doc(uid).get();
      if (snapshot.exists) {
        
        const m = await db
          .collection("Users")
          .doc(uid)
          .collection("match")
          .get();
        if (m && m.docs && m.docs.length) {
          let tm = [];
          m.docs.forEach((doc) => tm.push(doc.id));
          setMatchList(tm);
        }
      }
      setIsLoading(false);
    };
    getData();
  }, [user]);

  console.log(matchList);

  
  if (!fontLoaded || isLoading) {
    return null;
  } else {
    return <Box>
      <Heading fontSize="xl" p="4" pb="3">
        Inbox
      </Heading>
      <FlatList data={matchList} renderItem={({
      item
    }) => <Box borderBottomWidth="1" _dark={{
      borderColor: "muted.50"
    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
            <HStack space={[2, 3]} justifyContent="space-between">
              <Avatar size="48px" source={{
          uri: item.images
        }} />
              <VStack>
                <Text _dark={{
            color: "warmGray.50"
          }} color="coolGray.800" bold>
                  {item.name}
                </Text>
                <Text color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
                  {item.job}
                </Text>
              </VStack>
              <Spacer />
          
            </HStack>
          </Box>} keyExtractor={item => item.id} />
    </Box>;
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  view: {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 100,
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
  floatButtonBack: {
    position: "absolute",
    top: 30,
    left: 15,
  },
  shadow: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    alignSelf: "center",
    width: 300,
    marginTop: 5,
    borderRadius: 40,
    marginBottom: 30,
    backgroundColor: "#4F67D8",
  },
});
