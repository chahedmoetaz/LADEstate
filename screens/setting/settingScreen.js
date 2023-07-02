import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Switch, TouchableRipple } from "react-native-paper";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { UserIdContext } from "../../utils/hooks/context";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
const { width } = Dimensions.get("screen");

function SettingScreen({ navigation }) {
  const [state, setState] = useState({
    matchedPropertySwitch: true,
    newLaunchedPropertySwitch: false,
    newPropertySwitch: false,
    isLogout: false,
  });
  const auth = getAuth();
  const { user } = useAuthentication();
  const [userId, setUserId] = useContext(UserIdContext);
  // registerForPushNotificationsAsync().then((token) => console.log(token));
  
  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView style={{backgroundColor: Colors.whiteColor}}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 9.0 }}
        >
          {userInfo()}
          {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MyListing")}
        >
          {moreInfo({ info: "My Properties" })}
        </TouchableOpacity> */}
          {title({ title: "ABOUT" })}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            {moreInfo({ info: "Privacy Policy" })}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("TermsOfUse")}
          >
            {moreInfo({ info: "Terms of use" })}
          </TouchableOpacity>
          {/* {title({ title: "MANAGE NOTIFICATIONS" })}
          {matchedPropertyNotification({ info: "Email" })}
          {newLanchedPropertyNotification({
            info: "Push Notifications",
          })} */}
          {/* {newPropertyNotification({ info: "SMS" })} */}
          {title({ title: "APP" })}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Support")}
          >
            {moreInfo({ info: "Support" })}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("ChangePasswordScreen")}
          >
            {moreInfo({ info: "Personal Settings" })}
          </TouchableOpacity>
          {userId?.type === "Agent" ? <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("MembershipScreen")}
          >
            {moreInfo({ info: "Membership Details" })}
          </TouchableOpacity>: null}
          {/* {moreInfo({ info: "Report a Bug" })}
          {moreInfo({ info: "App Version 1.0" })} */}
          {logOutInfo()}
        </ScrollView>
        {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("AddNewListing")}
        style={styles.floatingButtonStyle}
      >
        <MaterialIcons name="add" size={35} color={Colors.whiteColor} />
      </TouchableOpacity> */}
        {logOutDialog()}
      </KeyboardAwareScrollView>
    </View>
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
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
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

  function newPropertyNotification({ info }) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: width - 80 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor12Regular }}>
              {info}
            </Text>
          </View>
          <TouchableRipple
            rippleColor="transparent"
            onPress={() =>
              setState({
                ...state,
                newPropertySwitch: !state.newPropertySwitch,
              })
            }
          >
            <View pointerEvents="none">
              <Switch
                value={state.newPropertySwitch}
                color={
                  state.newPropertySwitch
                    ? Colors.primaryColor
                    : "rgba(128, 128, 128, 0.3)"
                }
              />
            </View>
          </TouchableRipple>
        </View>
        {divider()}
      </View>
    );
  }

  function newLanchedPropertyNotification({ info }) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: width - 80 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor12Regular }}>
              {info}
            </Text>
          </View>
          <TouchableRipple
            rippleColor="transparent"
            onPress={() =>
              setState({
                ...state,
                newLaunchedPropertySwitch: !state.newLaunchedPropertySwitch,
              })
            }
          >
            <View pointerEvents="none">
              <Switch
                value={state.newLaunchedPropertySwitch}
                color={
                  state.newLaunchedPropertySwitch
                    ? Colors.primaryColor
                    : "rgba(128, 128, 128, 0.3)"
                }
              />
            </View>
          </TouchableRipple>
        </View>
        {divider()}
      </View>
    );
  }

  function divider() {
    return (
      <View
        style={{
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          height: 0.8,
          marginVertical: Sizes.fixPadding,
        }}
      ></View>
    );
  }

  function matchedPropertyNotification({ info }) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: width - 80 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor12Regular }}>
              {info}
            </Text>
          </View>
          <TouchableRipple
            rippleColor="transparent"
            onPress={() =>
              setState({
                ...state,
                matchedPropertySwitch: !state.matchedPropertySwitch,
              })
            }
          >
            <View pointerEvents="none">
              <Switch
                value={state.matchedPropertySwitch}
                color={
                  state.matchedPropertySwitch
                    ? Colors.primaryColor
                    : "rgba(128, 128, 128, 0.3)"
                }
              />
            </View>
          </TouchableRipple>
        </View>
        {divider()}
      </View>
    );
  }

  function title({ title }) {
    return (
      <Text
        numberOfLines={1}
        style={{
          ...Fonts.blackColor14Regular,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding,
        }}
      >
        {title}
      </Text>
    );
  }

  function moreInfo({ info }) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: width - 80 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor12Regular }}>
              {info}
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={15}
            color={Colors.blackColor}
          />
        </View>
        {divider()}
      </View>
    );
  }

  function userInfo() {
    return (
      <View style={styles.userInfoContentStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={
              user?.photoURL
                ? { uri: user?.photoURL }
                : require("../../assets/images/user/demo-profile.png")
            }
            style={{
              height: 80.0,
              width: 80.0,
              borderRadius: 40.0,
            }}
          />
          <View
            style={{
              width: width - 200,
              marginLeft: Sizes.fixPadding * 2.0,
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
              {user?.displayName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.editButtonStyle}
        >
          <MaterialIcons name="edit" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerStyle}>
        <Text style={{ ...Fonts.primaryColor18Bold }}>Settings</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 60.0,
    // elevation: 5.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  editButtonStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
  },
  floatingButtonStyle: {
    height: 60.0,
    width: 60.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: 30.0,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20.0,
    bottom: 80.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 40,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
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

export default SettingScreen;
