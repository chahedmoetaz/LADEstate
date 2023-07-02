import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import React, { useState } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CircleFade } from "react-native-animated-spinkit";
import Dialog from "react-native-dialog";
import { useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
const { width } = Dimensions.get("screen");

function VerificationScreen({ route, navigation }) {
  const [state, setState] = useState({
    isLoading: false,
    firstDigit: "",
    secondDigit: "",
    thirdDigit: "",
    forthDigit: "",
  });
  const functions = getFunctions();
  const auth = getAuth();
  const items = route.params;
  // const {user} =

  const { data: user, update } = useDocument(
    auth.currentUser ? `users/${auth.currentUser.uid}` : undefined
  );

  // const { data: user, set } = useColle(
  //   data?.id ? `users/${data.id}` : undefined
  // );


  // if (user?.emailVerified) {
  //   navigation.navigate("RegisterAdditional", items);
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      {/* <ImageBackground
          style={{ flex: 1 }}
          source={require("../../assets/images/bg.jpg")}
          resizeMode="cover"
        > */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {backArrow()} */}
          {verificationInfo()}
          {/* {otpFields()} */}
          {continueButton(items)}
          {resendInfo(items)}
          {logOutInfo()}
        </ScrollView>
      </View>
      {/* </ImageBackground> */}
      {loading()}
      {logOutDialog()}
    </SafeAreaView>
  );

  function logOutDialog() {
    return (
      <Dialog.Container
        visible={state.isLogout}
        contentStyle={styles.dialogContainerStyle}
      >
        <View
          style={{
            backgroundColor: Colors.transparent,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Fonts.blackColor16Bold,
              paddingBottom: Sizes.fixPadding - 5.0,
            }}
          >
            You sure want to logout?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setState({ ...state, isLogout: false })}
              style={styles.cancelButtonStyle}
            >
              <Text style={{ ...Fonts.blackColor12Regular }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                signOut(auth);
                // setState({ ...state, isLogout: false });
                // navigation.navigate("Login");
              }}
              style={styles.logOutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor14Medium }}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function logOutInfo() {
    return (
      <TouchableOpacity
        onPress={() => setState({ ...state, isLogout: true })}
        style={{
          flexDirection: "row",
          // alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding
        }}
      >
        <MaterialCommunityIcons
          name="login-variant"
          size={24}
          color="#FF0000"
        />
        <Text
          style={{ ...Fonts.redColor14Medium, marginLeft: Sizes.fixPadding }}
        >
          Logout
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
        onPress={() => navigation.goBack()}
      />
    );
  }

  function loading() {
    return (
      <Dialog.Container
        visible={state.isLoading}
        contentStyle={styles.dialogContainerStyle}
      >
        <View style={{ backgroundColor: "white", alignItems: "center" }}>
          <CircleFade size={56} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.grayColor12Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            Please wait..
          </Text>
        </View>
      </Dialog.Container>
    );
  }

  function continueButton(items) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={async () => {
        
          await auth.currentUser.reload();
          if (auth?.currentUser.emailVerified) {
            // await set({ step: "RegisterAdditional" });

            update({ step: "RegisterAdditional" });

            // navigation.navigate("RegisterAdditional", items);
          }
          // setState({ ...state, isLoading: true });
          // setTimeout(() => {
          //   setState({ ...state, isLoading: false });
          //   navigation.navigate("RegisterAdditional");
          // }, 2000);
        }}
      >
        <View style={styles.continueButtonStyle}>
          <Text style={{ ...Fonts.whiteColor18Medium }}>Refresh</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function resendInfo() {
    return (
      <TouchableOpacity
        onPress={() => sendEmailVerification(auth.currentUser).then(function() { showMessage({  message: "Email Resent!",
        type: "success"})}).catch(function(error) { showMessage({  message: "Too many requests, please wait and try again.",
        type: "danger",})})}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.blackColor12Bold }}>
          Didn’t receive the link?
        </Text>
        <Text
          style={{
            ...Fonts.primaryColor16Medium,
            marginLeft: Sizes.fixPadding - 5.0,
          }}
        >
          Resend
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
        onPress={() => navigation.navigate("RegisterAccountType")}
      />
    );
  }
  function otpFields() {
    return (
      <View style={styles.otpFieldsContentStyle}>
        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            value={state.firstDigit}
            style={{ ...Fonts.primaryColor18Bold }}
            onChangeText={(text) => {
              setState({ ...state, firstDigit: text });
              secondTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            value={state.secondDigit}
            style={{ ...Fonts.primaryColor18Bold }}
            ref={(input) => {
              secondTextInput = input;
            }}
            keyboardType="numeric"
            onChangeText={(text) => {
              setState({ ...state, secondDigit: text });
              thirdTextInput.focus();
            }}
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            style={{ ...Fonts.primaryColor18Bold }}
            keyboardType="numeric"
            value={state.thirdDigit}
            ref={(input) => {
              thirdTextInput = input;
            }}
            onChangeText={(text) => {
              setState({ ...state, thirdDigit: text });
              forthTextInput.focus();
            }}
          />
        </View>

        <View style={styles.textFieldContentStyle}>
          <TextInput
            selectionColor={Colors.primaryColor}
            style={{ ...Fonts.primaryColor18Bold }}
            keyboardType="numeric"
            value={state.forthDigit}
            ref={(input) => {
              forthTextInput = input;
            }}
            onChangeText={(text) => {
              setState({ ...state, forthDigit: text });
              setState({ ...state, isLoading: true });
              setTimeout(() => {
                setState({ ...state, isLoading: false });
                navigation.navigate("RegisterAdditional");
              }, 2000);
            }}
          />
        </View>
      </View>
    );
  }

  function verificationInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 7.0,
          marginBottom: Sizes.fixPadding * 4.0,
        }}
      >
        <Text style={{ ...Fonts.blackColor18Bold }}>Verify Email Address</Text>
        <Text
          style={{
            ...Fonts.blackColor14Regular,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Check your Email messages. We have sent you the link to{" "}
          {<Text style={{ color: Colors.primaryColor }}>{auth?.email}</Text>}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  otpFieldsContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Sizes.fixPadding * 4.0,
  },
  textFieldContentStyle: {
    height: 60.0,
    width: 60.0,
    borderRadius: Sizes.fixPadding,
    backgroundColor: "#d5dff0",
    alignItems: "center",
    justifyContent: "center",
    // borderColor: Colors.primaryColor,
    // borderWidth: 1.0,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 5.0,
    height: 56.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 40,
    paddingHorizontal: Sizes.fixPadding * 3.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding,
  },
  cancelButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.blackColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding - 7.0,
  },
  logOutButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 7.0,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
});

VerificationScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default VerificationScreen;
