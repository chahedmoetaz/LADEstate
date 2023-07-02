import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const LoginScreen = ({ navigation }) => {
  const auth = getAuth();

  const [state, setState] = useState({ email: "", phoneNumber: "" });
  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange",
  });
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
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              
                {
                  type: "text",
                  name: "email",

                  rules: {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                  },
                  textInputProps: {
                    label: "Email",
                    style: { backgroundColor: "white" },
                  },
                },
                {
                  type: "password",
                  name: "password",

                  rules: {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  },
                  textInputProps: {
                    label: "Password",
                    style: { backgroundColor: "white" },
                  },
                },
            
              
            ]}
          />
          {/* {emailTextField()}
          {passwordTextField()} */}
          {forgotPassword()}
          <View
            style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 40 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.continueButtonStyle}
              onPress={handleSubmit((data) => {
                signInWithEmailAndPassword(auth, data.email, data.password).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  if (errorCode === 'auth/wrong-password') {
                    showMessage({
                      message: "Incorrect Email or Password!",
                      type: "danger",
                    })
                  } else {
                    showMessage({
                      message: errorMessage.replace("Firebase:",""),
                      type: "danger",
                    })
                    
                  }
                
                });
                
              })}
              // onPress={() => {
              //   try {
                  
              //     signInWithEmailAndPassword(auth, state.email, state.password)
              //   } catch (error) {
         
              //   }
              // }}
            >
              <Text style={{ ...Fonts.whiteColor18Medium }}>Sign In</Text>
            </TouchableOpacity>
          </View>
          {/* {loginWithFacebookButton()}
          {loginWithGoogleButton()} */}
        </ScrollView>
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );

  function forgotPassword() {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={{ marginHorizontal: Sizes.fixPadding }}
      >
        <Text style={{ color: Colors.primaryColor, textAlign: "right" }}>
          Forgot your password?
        </Text>
      </TouchableOpacity>
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
          marginTop: Sizes.fixPadding * 3.0,
          marginBottom: Sizes.fixPadding * 4.0,
        }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            ...Fonts.blackColor18Bold,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Welcome back!
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            ...Fonts.grayColor14Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Sign in to your account
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
    height: 60,
    marginTop: Sizes.fixPadding * 4.0,
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

LoginScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default LoginScreen;
