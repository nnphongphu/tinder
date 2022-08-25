# Tinder 2.0 clone with REACT NATIVE
  A copy of the Tinder app to learn and improve coding skills with the React Native platform.

## What I have learned in this project are:

  1. **Context api** to provide a way to share values (global variables) like user info after authentication between components without having to explicitly pass a prop through every level of the tree.
  2. **Custom Hook**: When we have component logic that needs to be used by multiple components, we can extract that logic to a custom Hook
  3. **Higher Order Component (HOC)** is an advanced technique in React for reusing component logic. They are a pattern that emerges from React's compositional nature. Concretely, a higher-order component is a function that takes a component and returns a new component. [Read more...](https://reactjs.org/docs/higher-order-components.html)
  4. Using Environment variables and setup 
  5. Firebase authentication and sign in & sign up using email and password
  6. Using **useMemo** to memoize expensive functions so that you can avoid calling them on every render. [Read more...](https://usehooks.com/useMemo/)
  7. Using Swiper package in order to show data inside cards and swipe them [Read more...](https://github.com/webraptor/react-native-deck-swiper)

  ## Dependencies
  - Tailwind React Native Classnames [link](https://www.npmjs.com/package/tailwind-react-native-classnames)
  - React Native Safe Area Context [link](https://reactnavigation.org/)
  - React Native Navigation  [link](https://reactnavigation.org/)
  - React Native Screens
  - React Native Stack Navigator [link](https://reactnavigation.org/docs/hello-react-navigation)
  - React Native Dotenv [link](https://www.npmjs.com/package/react-native-dotenv)
  - React Native Elements [link](https://reactnativeelements.com/docs)
  - Expo Vector Icon [link](https://docs.expo.dev/guides/icons/)
  - React Native Deck Swiper [link](https://www.npmjs.com/package/react-native-deck-swiper)

##### Note 1: 

  let's use expo to install: 
  - react-native-screens 
  - react-native-safe-area-context
  - firebase
  - @expo/vector-icons

##### Note 2:

  By using React Native Dotenv to protect important keys we need to configure `babel.config.js` but it will run into issues. Environment changes won’t be picked up and that is because of cache issue. So to resolve the issues we need to clear the cache:

>     rm -rf node_modules/.cache/babel-loader/*
>     expo r -c
>     expo start --clear

## App overview
![Tinder-clone](https://user-images.githubusercontent.com/7660220/185729543-a2813a3c-4c0a-4f4f-a139-ad2e42ea1b62.png)

## React Context Example

> Use react context and create custom Hook
```jsx
const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{
      user: "Hamid"
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}
```

> The way to use custom Hook

```jsx
const LoginScreen = () => {

  const { user } = useAuth();

  return (
    <View>
      <Text>Welcome { user }!</Text>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
```


### Supported platform

- Ios
- Android