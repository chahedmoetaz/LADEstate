import "expo-dev-client";
import { useFonts } from "expo-font";
import firebase from "firebase/compat/app";
import "intl";
import "intl/locale-data/jsonp/en";
import React from "react";
import { LogBox, SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import { ReactQueryFirestoreProvider } from "react-query-firestore";
import "./config/firebase";
import RootNavigation from "./Navigation";
import Store from "./utils/hooks/context";
import FlashMessage from "react-native-flash-message";
import {withIAPContext} from 'react-native-iap';

const App = () => {
  const reactQueryConfig = {
    queries: {
      retry: true,
    },
  };

  
  const [loaded] = useFonts({
    Poppins_Bold: require("./assets/fonts/Poppins-Bold.ttf"),
    Poppins_Medium: require("./assets/fonts/Poppins-Medium.ttf"),
    Poppins_Regular: require("./assets/fonts/Poppins-Regular.ttf"),
    Poppins_SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  
 
  LogBox.ignoreLogs([
    "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
    "NativeBase: The contrast ratio of",
    "'`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.",
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
  ]);
  return (
    <Store>
      <ReactQueryFirestoreProvider
        firestore={firebase.app().firestore()}
        reactQueryConfig={reactQueryConfig}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <FlashMessage position="top" />
          <RootNavigation />
        </SafeAreaView>
      </ReactQueryFirestoreProvider>
    </Store>
  );
}

export default withIAPContext(App);