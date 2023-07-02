import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge } from "react-native-paper";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection, useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const { width } = Dimensions.get("screen");
function EditProfileScreen({ navigation }) {
  const { user } = useAuthentication();

  const { data: userData, update } = useDocument(
    user ? `users/${user.uid}` : undefined
  );
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    occupation: "",
    showBottomSheet: false,
    type: "",
  });

  const { data: contractData, error } = useCollection(
    user?.email ? `contracts` : undefined,
    {},
    {
      where: ["agentEmail", "==", user?.email],
    }
  );

  useEffect(() => {
    setState({
      name: userData?.displayName,
      email: userData?.email,
      desc: userData?.description,
      phoneNumber: userData?.phone,
      occupation: userData?.occupation,
      showBottomSheet: false,
      type: userData?.type,
    });
  }, [userData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}

        {changeProfilePhoto()}
        {summary()}
        {saveButton()}
        {title({ title: "About " + state?.name })}
        {nameTextField()}
      </View>
    </SafeAreaView>
  );

  function title({ title }) {
    return (
      <Text
        style={{
          ...Fonts.blackColor18SemiBold,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding - 5.0,
        }}
      >
        {title}
      </Text>
    );
  }

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>   navigation.navigate("EditProfile")}
        style={styles.saveButtonStyle}
      >
        <Text style={{ ...Fonts.primaryColor16Medium }}>Edit Profile</Text>
      </TouchableOpacity>
    );
  }

  function nameTextField() {
    return (
      <Text
        label="Name"
        mode="outlined"
        value={state.name}
        onChangeText={(text) => setState({ ...state, name: text })}
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      >
        {state.desc}
      </Text>
    );
  }

  function changeProfilePhoto() {
    return (
      <View
        style={{
          alignSelf: "center",
          flexDirection: "column",
          marginTop: Sizes.fixPadding * 3.0,
          marginBottom: Sizes.fixPadding + 5.0,
          paddingHorizontal: Sizes.fixPadding,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            
            flexDirection: "row",
          }}
        >
          <Image
            source={
              user?.photoURL
                ? { uri: user?.photoURL }
                : require("../../assets/images/user/demo-profile.png")
            }
            style={{ height: 100.0, width: 100.0, borderRadius: 50.0 }}
            resizeMode="cover"
          />
          <View style={{flexDirection: "column", justifyContent: "center", alignItems: 'flex-start'}}>
            <Text
              label="Name"
              mode="outlined"
              value={state.name}
              onChangeText={(text) => setState({ ...state, name: text })}
              style={{
                ...Fonts.primaryColor18Bold,
                marginHorizontal: Sizes.fixPadding,
                backgroundColor: Colors.whiteColor,
                marginVertical: Sizes.fixPadding - 3.0,
              }}
              selectionColor={Colors.blackColor}
              theme={{
                colors: { primary: "gray", underlineColor: "transparent" },
              }}
            >
              {state.name}
            </Text>
           {state.occupation ? <Text
              label="Name"
              mode="outlined"
              value={state.name}
              onChangeText={(text) => setState({ ...state, name: text })}
              style={{
                ...Fonts.blackColor16SemiBold,
                marginHorizontal: Sizes.fixPadding,
                backgroundColor: Colors.whiteColor,
                marginVertical: Sizes.fixPadding - 15.0,
              }}
              selectionColor={Colors.blackColor}
              theme={{
                colors: { primary: "gray", underlineColor: "transparent" },
              }}
            >
              {state.occupation}
            </Text> : null}
            <Badge     style={{
                
                marginHorizontal: Sizes.fixPadding,
                
                marginVertical: Sizes.fixPadding ,
              }}
              >
              {state?.type}
            </Badge>
          </View>
        </View>
      </View>
    );
  }

  function summary() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("UserContracts")}
        style={styles.homeScreenNotificationStyle}
      >
        <Text style={{ color: Colors.primaryColor }}>
          Active Contracts {"   "}
          <Text style={{ color: Colors.blackColor }}>
            {contractData?.length}
          </Text>
        </Text>
      </TouchableOpacity>
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
            ...Fonts.blackColor18Bold,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          Profile
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeScreenNotificationStyle: {
    backgroundColor: "#eef3fa",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
  },
  headerContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 10.0,
  },
  saveButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  bottomSheetContentStyle: {
    backgroundColor: Colors.whiteColor,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding,
  },
  changeInfoContentStyle: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0.0,
    backgroundColor: "#FF8C00",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 6.0,
    alignItems: "center",
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
});

EditProfileScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default EditProfileScreen;
