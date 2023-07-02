import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";
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
import IntlPhoneInput from "react-native-intl-phone-input";
import { TextInput } from "react-native-paper";
import { Colors, Fonts, Sizes } from "../../../constant/styles";

const ForgotPasswordScreen = ({ navigation }) => {
  const auth = getAuth();
  const [state, setState] = useState({ email: "", phoneNumber: "" });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      {/* <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/images/bg.jpg")}
        resizeMode="cover"
      > */}
      <View
        // start={{ x: 0, y: 1 }}
        // end={{ x: 0, y: 0 }}
        // colors={["black", "rgba(0,0.10,0,0.77)", "rgba(0,0,0,0.1)"]}
        style={{
          flex: 1,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {backArrow()}
          {welcomeInfo()}

          {emailTextField()}
          {/* {passwordTextField()} */}

          {continueButton()}
          {forgotPassword()}
          {/* {loginWithFacebookButton()}
          {loginWithGoogleButton()} */}
        </ScrollView>
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );

  function loginWithGoogleButton() {
    return (
      <View style={styles.loginWithGoogleButtonStyle}>
        <Image
          source={require("../../../assets/images/google.png")}
          style={{ height: 37.0, width: 37.0 }}
          resizeMode="cover"
        />
        <Text
          style={{
            ...Fonts.blackColor14Medium,
            marginLeft: Sizes.fixPadding + 5.0,
          }}
        >
          Log in with Google
        </Text>
      </View>
    );
  }

  function loginWithFacebookButton() {
    return (
      <View style={styles.loginWithFacebookButtonStyle}>
        <Image
          source={require("../../../assets/images/facebook.png")}
          style={{ height: 37.0, width: 37.0 }}
          resizeMode="cover"
        />
        <Text
          style={{
            ...Fonts.whiteColor14Medium,
            marginLeft: Sizes.fixPadding + 5.0,
          }}
        >
          Log in with Facebook
        </Text>
      </View>
    );
  }

  function forgotPassword() {
    return (
      <Text style={{ color: Colors.blackColor, textAlign: "center" }}>
        Didn't recieve the email?{" "}
        <Text style={{ color: Colors.primaryColor }} >Resend again</Text>
      </Text>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.continueButtonStyle}
        onPress={async () =>
          await sendPasswordResetEmail(auth, state.email)
            .then(() => {
              setState({ ...state, emailLabel: "PASSWORD EMAIL SENT" });
              showMessage({message: "Reset password email has been successfully sent", type: "success"})
              navigation.navigate("Login")
              // Password reset email sent!
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              showMessage({
                message: error.message,
                type: "danger",
              })
            })
        }
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Send</Text>
      </TouchableOpacity>
    );
  }

  function phoneNumberTextField() {
    return (
      <IntlPhoneInput
        onChangeText={({ phoneNumber }) =>
          setState({ ...state, phoneNumber: phoneNumber })
        }
        defaultCountry="US"
        containerStyle={styles.phoneNumberContentStyle}
        placeholder="Phone Number"
        dialCodeTextStyle={{
          ...Fonts.blackColor14Regular,
          marginLeft: Sizes.fixPadding,
        }}
        phoneInputStyle={{
          flex: 1,
          marginLeft: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor14Regular,
        }}
      />
    );
  }

  function backArrow() {
    return (
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={Colors.blackColor}
        style={{
          marginTop: Sizes.fixPadding * 7.0,
          marginBottom: Sizes.fixPadding,
        }}
        onPress={() => navigation.navigate("InitAuth")}
      />
    );
  }

  function emailTextField() {
    return (
      <TextInput
        style={{ ...Fonts.whiteColor14Medium, ...styles.textFieldContentStyle }}
        value={state.email}
        onChangeText={(text) => setState({ ...state, email: text })}
        placeholder="Email"
        mode="outlined"
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function passwordTextField() {
    return (
      <TextInput
        style={{ ...Fonts.whiteColor14Medium, ...styles.textFieldContentStyle }}
        value={state.password}
        secureTextEntry={true}
        onChangeText={(text) => setState({ ...state, password: text })}
        placeholder="Password"
        mode="outlined"
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 5.0,
          marginBottom: Sizes.fixPadding * 4.0,
        }}
      >
        <Text
          style={{
            ...Fonts.blackColor18Bold,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Forgot your password
        </Text>
        <Text
          style={{
            ...Fonts.grayColor14Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Please enter your email address below to recieve your password reset
          instructions.
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
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
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    height: 50.0,
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
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  searchCountryTextFieldContentStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
    borderBottomWidth: 1.0,
    borderBottomColor: Colors.grayColor,
  },
});

ForgotPasswordScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default ForgotPasswordScreen;
