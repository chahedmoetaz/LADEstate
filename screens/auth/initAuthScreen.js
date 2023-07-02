import { useNavigation } from "@react-navigation/core";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const InitAuthScreen =  () => {
  const navigation = useNavigation();
  
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent backgroundColor={Colors.primaryColor} />
     
      {/* <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/images/bg.jpg")}
        resizeMode="cover"
      > */}
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding ,
          flex: 1,
          backgroundColor: Colors.whiteColor,
        }}
      >
        {welcomeInfo()}
        <View
          style={{  justifyContent: "center",  alignItems: "center", marginBottom: Sizes.fixPadding, marginTop: Sizes.fixPadding   }}
        ><Image
        source={require("../../assets/images/initAuth2.png")}
        resizeMode="cover"
        style={styles.imageStyle}
      /></View>
        
        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 40 }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.signInButtonStyle}
            onPress={() => navigation.navigate("Login")}
          >
            
            <Text style={{ color: Colors.primaryColor }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.signUpButtonStyle}
            onPress={() => navigation.navigate("RegisterAccountType")}
          >
            <Text style={{ color: Colors.whiteColor }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );

  // function loginWithGoogleButton() {
  //   return (
  //     <View style={styles.loginWithGoogleButtonStyle}>
  //       <Image
  //         source={require("../../assets/images/google.png")}
  //         style={{ height: 37.0, width: 37.0 }}
  //         resizeMode="cover"
  //       />
  //       <Text
  //         style={{
  //           ...Fonts.blackColor14Medium,
  //           marginLeft: Sizes.fixPadding + 5.0,
  //         }}
  //       >
  //         Log in with Google
  //       </Text>
  //     </View>
  //   );
  // }

  // function loginWithFacebookButton() {
  //   return (
  //     <View style={styles.loginWithFacebookButtonStyle}>
  //       <Image
  //         source={require("../../assets/images/facebook.png")}
  //         style={{ height: 37.0, width: 37.0 }}
  //         resizeMode="cover"
  //       />
  //       <Text
  //         style={{
  //           ...Fonts.whiteColor14Medium,
  //           marginLeft: Sizes.fixPadding + 5.0,
  //         }}
  //       >
  //         Log in with Facebook
  //       </Text>
  //     </View>
  //   );
  // }

  function signInButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.signInButtonStyle}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: Colors.primaryColor }}>Sign In</Text>
      </TouchableOpacity>
    );
  }

  function signUpButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.signUpButtonStyle}
        onPress={() => navigation.navigate("RegisterAccountType")}
      >
        <Text style={{ color: Colors.whiteColor }}>Sign Up</Text>
      </TouchableOpacity>
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1,
          
          flex: 1,
           alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <View>
          <Text
            style={{
              ...Fonts.primaryColor18Bold,
              fontSize: 25,
            }}
          >
            Welcome to LADestate
          </Text>
       
          {/* <Text
            style={styles.secondaryText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Create rental agreements in just a few clicks
          </Text> */}
        </View>

        {/* <Image
          source={require("../../assets/images/initAuth.jpg")}
          style={styles.imageStyle}
          resizeMode="cover"
        ></Image> */}
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
    height: 60,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },

  secondaryText: {
    ...Fonts.grayColor14Regular,
    fontSize: 16,
  },
  signUpButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  imageStyle: { marginTop: Sizes.fixPadding, height: 250, width: 250, marginBottom: Sizes.fixPadding*8},
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
    marginTop: Sizes.fixPadding * 4.0,
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

InitAuthScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default InitAuthScreen;
