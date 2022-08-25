import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Input, Image, ThemeProvider } from '@rneui/themed'
import { Button } from '@rneui/base'
import { useEffect, useLayoutEffect, useState } from 'react'
import { auth } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { signIn, loading } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [])

  const logIn = async () => {
    try {
      setError("");
      await signIn(email, password);
    } catch (err) {
      setError(err.message);
      alert(err);
    }
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <Image 
        source={{uri: 'https://cdn2.iconfinder.com/data/icons/social-media-icons-23/800/tinder-512.png'}} 
        style={styles.image}
      />
      <View style={styles.inputContainer}>
        <Input autoFocus
          placeholder='Email'
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input secureTextEntry
          placeholder='Password' 
          type="password"  
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button raised containerStyle={styles.button} color="#FE4C6A" onPress={logIn} title="Sign In" />
      <Button containerStyle={styles.button} type="link" onPress={() => navigation.navigate('Register')} title="Register" />
      <View style={{ height: 150}} />
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  image: {
    width: 120, 
    height: 120,
    marginBottom: 50
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white'
  },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 10
  },

  inputContainer: {
    width: 300
  }
})