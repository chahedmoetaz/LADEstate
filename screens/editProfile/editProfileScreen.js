import { MaterialIcons } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  ActivityIndicator,
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
import { BottomSheet } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
import { TransitionPresets } from "react-navigation-stack";
import { useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
function EditProfileScreen({ navigation }) {
  const { user } = useAuthentication();

  const { data: userData, update } = useDocument(
    user ? `users/${user.uid}` : undefined
  );

  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      fullName: "",
      description: "",
    },
    mode: "onChange",
  });

  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    showBottomSheet: false,
    image: "",
  });

  useEffect(() => {
    setValue("email", userData?.email);
    setValue("displayName", userData?.displayName);
    setValue("phone", userData?.phone);
    setValue("description", userData?.description);
    setValue("occupation", userData?.occupation);
  }, [userData]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status != "granted") {
        //   alert("Permission Denied");
        // }
      }
    })();
  }, []);

  const AddTenantForm = () => {
    return (
      <KeyboardAwareScrollView>
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <View
            style={{
              alignSelf: "center",
              marginTop: Sizes.fixPadding * 3.0,
              marginBottom: Sizes.fixPadding + 5.0,
            }}
          >

            <Image
              source={
                state.image
                  ? { uri: state.image }
                  : user?.photoURL
                  ? { uri: user?.photoURL }
                  : require("../../assets/images/user/demo-profile.png")
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
          <View style={{ marginHorizontal: Sizes.fixPadding }}>
            <FormBuilder
              control={control}
              setFocus={setFocus}
              formConfigArray={[
                {
                  type: "text",
                  name: "displayName",

                  rules: {
                    required: {
                      value: true,
                      message: "Full Name is required",
                    },
                  },
                  textInputProps: {
                    label: "Full Name",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "email",
                  name: "email",
                  
                  rules: {
                    required: {
                      value: true,
                      message: "Email Address is required",
                    },
                  },
                  textInputProps: {
                    label: "Email Address",
                    readOnly: true,
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "occupation",
                  
                  textInputProps: {
                    label: "Occupation",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "phone",

                  rules: {
                    required: {
                      value: true,
                      message: "Phone number is required",
                    },
                  },
                  textInputProps: {
                    label: "Phone Number",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "description",

                  rules: {
                    required: {
                      value: false,
                      message: "Description is required",
                    },
                  },
                  textInputProps: {
                    label: "Profile Description",
                    multiline: true,
                    numberOfLines: 6,
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ]}
            />
          </View>
        </ScrollView>
      </View>
      </KeyboardAwareScrollView>
    );
  };

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

    const result = await uploadBytes(fileRef, blob, {cacheControl: 'max-age=31536000'});
    setUploading(false);
    // We're done with the blob, close and release it
    blob.close();

    const url = await getDownloadURL(fileRef);
    await updateProfile(user, { photoURL: url });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <AddTenantForm />
          {/* {passwordTextField()}
          {passwordTextField()} */}
          {saveButton()}
        </ScrollView>
      </View>
      {changeProfileOptions()}
    </SafeAreaView>
  );

  function changeProfileOptions() {
    return (
      <BottomSheet
        isVisible={state.showBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, showBottomSheet: false })}
          style={styles.bottomSheetContentStyle}
        >
          <Text style={{ ...Fonts.blackColor18Bold, textAlign: "center" }}>
            Choose Option
          </Text>
          <View
            style={{
              backgroundColor: "#CFC6C6",
              height: 1.0,
              marginBottom: Sizes.fixPadding + 2.0,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            <MaterialIcons
              name="photo-camera"
              size={24}
              color={Colors.blackColor}
            />
            <Text
              style={{
                ...Fonts.blackColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Camera
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: Sizes.fixPadding,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            <MaterialIcons
              name="photo-album"
              size={22}
              color={Colors.blackColor}
            />
            <Text
              style={{
                ...Fonts.blackColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Choose from gallery
            </Text>
          </View>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSubmit((data) => {
          updateProfile(user, { displayName: data.displayName });
          showMessage({
            message: "Profile Saved!",
            type: "success",
          })
          update({
            displayName: data.displayName,
            description: data.description,
            phone: data.phone,
            occupation: data?.occupation
          });
          navigation.navigate("BottomBar")
        })}
        style={styles.saveButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Save</Text>
      </TouchableOpacity>
    );
  }

  function signatureButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Signature")}
        style={styles.saveButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Signature</Text>
      </TouchableOpacity>
    );
  }

  function phoneNumberTextField() {
    return (
      <TextInput
        label="Phone Number"
        mode="outlined"
        keyboardType="numeric"
        value={state.phoneNumber}
        onChangeText={(text) => setState({ ...state, phoneNumber: text })}
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function emailTextField() {
    return (
      <TextInput
        label="Email"
        mode="outlined"
        value={state.email}
        onChangeText={(text) => setState({ ...state, email: text })}
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Occupation"
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
      />
    );
  }

  function changeProfilePhoto() {
    return (
      <View
        style={{
          alignSelf: "center",
          marginTop: Sizes.fixPadding * 3.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        <Image
          source={
            state.image
              ? { uri: state.image }
              : user?.photoURL
              ? { uri: user?.photoURL }
              : require("../../assets/images/user/demo-profile.png")
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
          Edit Profile
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerFormStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
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
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
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
