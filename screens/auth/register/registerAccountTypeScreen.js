import { MaterialIcons } from "@expo/vector-icons";
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
import { TextInput } from "react-native-paper";
import { useCollection } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../../constant/styles";

const RegisterAccountTypeScreen = ({ navigation }) => {
  const [state, setState] = useState();

  const { data: tenantData, error } = useCollection(
    state ? `contracts` : undefined,
    {},
    {
      where: ["tenantUUID", "==", state],
    }
  );

  const { data: landlordData, error: landlordError } = useCollection(
    state ? `contracts` : undefined,
    {},
    {
      where: ["landlordUUID", "==", state],
    }
  );

  const validateCode = () => {
    if (tenantData.length > 0) {
      let name = tenantData[0].tenantName;
      let email = tenantData[0].tenantEmail;
      let phone = tenantData[0].tenantPhone;
      let type = "Tenant";
      return navigation.navigate("Register", {
        type: type,
        name: name,
        email: email,
        phone: phone,
      });
    }

    if (landlordData.length > 0) {
      let name = landlordData[0].landlordName;
      let email = landlordData[0].landlordEmail;
      let phone = landlordData[0].landlordPhone;
      let type = "Landlord";
      return navigation.navigate("Register", {
        type: type,
        name: name,
        email: email,
        phone: phone,
      });
    }

    // return navigation.navigate("Register", { type: "Code" });
  };

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
          {header()}
          {welcomeInfo()}
          <View
            style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 40 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.signUpButtonStyle}
              onPress={() => navigation.navigate("Register", { type: "Agent" })}
            >
              <Text style={{ color: Colors.whiteColor }}>
                Continue as new agent
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Sizes.fixPadding * 2,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
              <View>
                <Text style={{ width: 50, textAlign: "center", color: "gray" }}>
                  or
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
            </View>
            <TextInput
              underlineColor="transparent"
              placeholder="Enter with invite code"
              onChangeText={(text) => setState(text)}
              style={{
                color: Colors.whiteColor,
                marginHorizontal: Sizes.fixPadding * 2,
                height: 60,
                borderRadius: Sizes.fixPadding,
                borderTopEndRadius: Sizes.fixPadding,
                borderTopStartRadius: Sizes.fixPadding,
                backgroundColor: "white",
                borderColor: "grey",
                borderWidth: 1,
              }}
              right={
                <TextInput.Icon
                  style={{ borderRadius: 0 }}
                  onPress={() => validateCode()}
                  name="login"
                />
              }
            ></TextInput>
          </View>
          {/* {sellerButton()} */}
        </ScrollView>
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );

  function agentButton() {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.signUpButtonStyle}
          onPress={() => navigation.navigate("Register", { type: "Agent" })}
        >
          <Text style={{ color: Colors.whiteColor }}>
            Continue as new agent
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: Sizes.fixPadding * 2,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
          <View>
            <Text style={{ width: 50, textAlign: "center", color: "gray" }}>
              or
            </Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "gray" }} />
        </View>
      </>
    );
  }

  function authCodeButton() {
    return (
      // <TouchableOpacity
      //   activeOpacity={0.9}
      //   style={styles.signUpButtonStyle}
      //   onPress={() => navigation.navigate("Register", { type: "Code" })}
      // >
      <TextInput
        underlineColor="transparent"
        placeholder="Enter with invite code"
        onChangeText={(text) => setState(text)}
        style={{
          color: Colors.whiteColor,
          marginHorizontal: Sizes.fixPadding * 2,
          height: 60,
          borderRadius: Sizes.fixPadding,
          borderTopEndRadius: Sizes.fixPadding,
          borderTopStartRadius: Sizes.fixPadding,
        }}
        right={
          <TextInput.Icon
            style={{ borderRadius: 0 }}
            onPress={() => validateCode()}
            name="login"
          />
        }
      ></TextInput>
      // </TouchableOpacity>
    );
  }

  function sellerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.signUpButtonStyle}
        onPress={() => navigation.navigate("Register", { type: "Seller" })}
      >
        <Text style={{ color: Colors.whiteColor }}>Seller</Text>
      </TouchableOpacity>
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/chooseInterest.png")}
          style={styles.imageStyle}
          resizeMode="cover"
        ></Image>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerContentStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 20.0 }}
        />
        <Text
          style={{
            ...Fonts.primaryColor18Bold,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          Choose your interest
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 10.0,
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
  imageStyle: { marginTop: Sizes.fixPadding, height: 250, width: 250 },
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

RegisterAccountTypeScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default RegisterAccountTypeScreen;
