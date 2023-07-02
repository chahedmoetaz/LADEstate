import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { TransitionPresets } from "react-navigation-stack";
import { useCollection } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

function SupportScreen({ navigation }) {
  const [state, setState] = useState({
    name: "",
    email: "",
    support: "",
  });
  const { add } = useCollection("mail");

  const { user } = useAuthentication();

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          add({
            to: "tech@ladestate.com",

            message: {
              subject: `Hello from ${user?.displayName}`,

              html: `This is the user message: ${state.support}, Email from: ${user?.email}`,
            },
          }).then(() =>
          {
            setState({
              name: "",
              email: "",
              support: "",
            })
            showMessage({
              message: "Support Email has been sent, it may take up to 2 business days for a reply",
              type: "success",
            })
            navigation.navigate("BottomBar")
          }
          )
        }
        style={styles.submitButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Submit</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
        >
          {/* {nameTextField()}
          {emailTextField()} */}
          {supportTextField()}
          {submitButton()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function supportTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Write here"
          multiline={true}
          numberOfLines={6}
          mode="outlined"
          
          value={state.support}
          onChangeText={(text) => setState({ ...state, support: text })}
          style={{
            ...Fonts.blackColor14Medium,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
        />
      </View>
    );
  }

  function emailTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Email"
          mode="outlined"
          value={state.email}
          onChangeText={(text) => setState({ ...state, email: text })}
          style={{
            ...Fonts.blackColor14Medium,
            height: 50.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
        />
      </View>
    );
  }

  function nameTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Name"
          mode="outlined"
          value={state.name}
          onChangeText={(text) => setState({ ...state, name: text })}
          style={{
            ...Fonts.blackColor14Medium,
            height: 50.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
        />
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
            ...Fonts.blackColor18Bold,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          Email Support
        </Text>
      </View>
    );
  }
}

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
  submitButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
});

SupportScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default SupportScreen;
