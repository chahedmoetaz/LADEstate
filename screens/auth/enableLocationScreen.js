import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const EnableLocationScreen = ({ navigation }) => {
  const auth = getAuth();
  const [state, setState] = useState({ email: "", phoneNumber: "" });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {welcomeInfo()}

          {allowAccessButton()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function allowAccessButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.signUpButtonStyle}
        onPress={() => navigation.navigate("SubscriptionScreen")}
      >
        <Text style={{ color: Colors.whiteColor }}>Allow Access</Text>
      </TouchableOpacity>
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1.0,
          marginBottom: Sizes.fixPadding * 1.0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <Text
            onPress={() => navigation.navigate("SubscriptionScreen")}
            style={{
              ...Fonts.primaryColor18Bold,

              alignSelf: "flex-end",
            }}
          >
            Skip
          </Text>
        </View>
        <Image
          source={require("../../assets/images/navigation.png")}
          style={styles.imageStyle}
          resizeMode="cover"
        ></Image>
        <Text
          style={{
            ...Fonts.primaryColor18Bold,
            marginVertical: Sizes.fixPadding * 3,
          }}
        >
          Enable Location
        </Text>
        <Text
          style={{
            ...Fonts.blackColor14Medium,
            textAlign: "center",
          }}
        >
          Choose your location to start the request around you
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  signInButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  signUpButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  imageStyle: { marginTop: Sizes.fixPadding * 2.0, height: 300, width: 300 },
  phoneNumberContentStyle: {
    height: 60.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: Colors.blackColor,
    borderWidth: 1,
    marginTop: Sizes.fixPadding * 3.0,
  },
  textFieldContentStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: "rgba(128, 128, 128, 0.8)",
    borderRadius: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  loginWithGoogleButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: Colors.grayColor,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    height: 56.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  loginWithFacebookButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 6.0,
    marginBottom: Sizes.fixPadding * 2.5,
    backgroundColor: "#3B5998",
    flexDirection: "row",
    height: 56.0,
  },
  continueButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    height: 56.0,
  },
  searchCountryTextFieldContentStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
    borderBottomWidth: 1.0,
    borderBottomColor: Colors.grayColor,
  },
});

EnableLocationScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default EnableLocationScreen;
