import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Checkbox, TextInput } from "react-native-paper";
import { useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { useAuthentication } from "../../../utils/hooks/useAuthentication";

function RegisterAdditionalScreen({ navigation }) {
  const [state, setState] = useState({
    userName: "",
    email: "",
    address: "",
    phone: "",
    image: "",
    agree: false,
  });
  const [uploading, setUploading] = useState(false);
  const { width } = Dimensions.get("screen");
  const { user } = useAuthentication();

  const { data: userData, update } = useDocument(
    user ? `users/${user.uid}` : undefined
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status != "granted") {
          alert("Permission Denied");
        }
      }
    })();
  }, []);

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.1,
      base64: true,
      allowsMultipleSelection: false,
    });
   
    if (!result.cancelled) {
      setState({ ...state, image: result.uri });
      setUploading(true);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
      
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), user.email);

    const result = await uploadBytes(fileRef, blob);
    setUploading(false);
    // We're done with the blob, close and release it
    blob.close();

    const url = await getDownloadURL(fileRef);
    await updateProfile(user, { photoURL: url });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <KeyboardAwareScrollView>
        <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />

        <View
          style={{
            flex: 1,
            paddingHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {backArrow()}
            {registerInfo()}
            {changeProfilePhoto()}
            {fullNameTextField()}
            {phoneTextField()}
            {addressTextField()}
            {termsConditions()}
            {/* {userNameTextField()} */}
            {continueButton()}
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );

  function changeProfilePhoto() {
    return (
      <View
        style={{
          alignSelf: "center",
          marginTop: Sizes.fixPadding * 1.0,
          marginBottom: Sizes.fixPadding - 30,
        }}
      >
        <Image
          source={
            state.image
              ? { uri: state.image }
              : user?.photoURL
              ? { uri: user?.photoURL }
              : require("../../../assets/images/user/demo-profile.png")
          }
          style={{ height: 100.0, width: 100.0, borderRadius: 50.0 }}
          resizeMode="cover"
        />
        {!uploading ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={PickImage}
            style={styles.changeInfoContentStyle}
          >
            <MaterialIcons
              name="photo-camera"
              size={17}
              color={Colors.whiteColor}
            />
            <Text
              style={{
                ...Fonts.whiteColor12Regular,
                marginLeft: Sizes.fixPadding - 5.0,
              }}
            >
              Change
            </Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="small" color={Colors.primaryColor} />
        )}
      </View>
    );
  }
  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.continueButtonStyle}
        onPress={() => {
          updateProfile(user, {
            displayName: state.userName,
          });

          if (userData.type === "Agent") {
            update({
              displayName: state.userName,
              phone: state.phone,
              address: state.address,
              step: "SubscriptionRequired",
            });
          } else {
            update({
              displayName: state.userName,
              phone: state.phone,
              address: state.address,
              step: "subscribed",
            });
          }
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Next</Text>
      </TouchableOpacity>
    );
  }

  function termsConditions() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginVertical: Sizes.fixPadding,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, agree: !state.agree })}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: width / 2.0,
          }}
        >
          <Checkbox />
          <Text
            style={{
              ...Fonts.blackColor14Medium,
              marginLeft: Sizes.fixPadding - 2.0,
            }}
          >
            I agree to LAD estate{" "}
            <Text style={{ color: Colors.primaryColor }}>
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function addressTextField() {
    return (
      <TextInput
        style={{ ...styles.textFieldStyle }}
        value={state.address}
        onChangeText={(text) => setState({ ...state, address: text })}
        placeholder="Address"
        mode="outlined"
      />
    );
  }

  function phoneTextField() {
    return (
      <TextInput
        style={{ ...styles.textFieldStyle }}
        value={state.phone}
        onChangeText={(text) => setState({ ...state, phone: text })}
        placeholder="Phone Number"
        mode="outlined"
      />
    );
  }

  function fullNameTextField() {
    return (
      <TextInput
        style={{ ...styles.textFieldStyle }}
        value={state.userName}
        mode="outlined"
        onChangeText={(text) => setState({ ...state, userName: text })}
        placeholder="Full Name"
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
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
          marginTop: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
        onPress={() => navigation.navigate("RegisterAccountType")}
      />
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
          Welcome to LAD estate
        </Text>
      </View>
    );
  }

  function registerInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1.0,
          marginBottom: Sizes.fixPadding * 1.0,
        }}
      >
        <Text style={{ ...Fonts.blackColor18Bold }}>Welcome to LAD estate</Text>
        <Text
          style={{
            ...Fonts.grayColor12Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Complete your profile
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buyOrRentUnselectedStyle: {
    height: 20.0,
    width: 20.0,
    borderRadius: 10.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  buyOrRentSelectedStyle: {
    width: 14.0,
    height: 14.0,
    borderRadius: 7.0,
    backgroundColor: Colors.primaryColor,
  },
  phoneNumberContentStyle: {
    height: 50.0,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 8.0,
    borderRadius: 5,
    borderColor: Colors.blackColor,
    borderWidth: 1,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 8.0,
    height: 50.0,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 1.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
});

RegisterAdditionalScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default RegisterAdditionalScreen;
