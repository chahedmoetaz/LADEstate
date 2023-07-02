import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
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
import { TransitionPresets } from "react-navigation-stack";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const { width } = Dimensions.get("screen");

function AddNewTenantScreen({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState({
    nameFocus: false,
    emailAddressFocus: false,
    identityFocus: false,
    phoneFocus: false,
    businessLicenseFocus: false,
    businessLicenseNoFocus: false,
    countryFocus: false,
    isResident: true,
    showBottomSheet: false,
    image: "",
    responseUrls: "",
    responseReceived: false,
    badResponseReceived: false,
    name: "",
    emiratesId: "",
    nationality: "",
    isBuy: true,
  });

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

  function checkingstring(text) {
    var regex = /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]$/.test(text);

    return regex;
  }

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.cancelled) {
      // setState({ ...state, image: result.uri });
      setUploading(true);
     

      let body = JSON.stringify({
        requests: [
          {
            features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 }],
            image: {
              content: result.base64,
            },
          },
        ],
      });

     
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBEwLe83JL_WAPUQmGsT7ayyxUETqkqgUg",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );

      let responseJson = await response.json();

     
      let responseParsed = JSON.parse(JSON.stringify(responseJson));
      // try {
      let text = responseParsed.responses[0].fullTextAnnotation.text;
      let textArray = text.split("\n");

      let initState = { ...state, image: result.uri, showBottomSheet: false };

      for (var i = 0; i < textArray.length; i++) {
        if (checkingstring(textArray[i])) {
          initState = { ...initState, emiratesId: textArray[i] };
        }

        if (textArray[i].includes("Name:")) {
          initState = {
            ...initState,
            name: textArray[i].replace("Name: ", ""),
          };
        }

        if (textArray[i].includes("Nationality")) {
          initState = {
            ...initState,
            nationality: textArray[i]
              .replace("Nationality ", "")
              .replace(":", "")
              .replace(".", ""),
          };
        }
        //Do something
      }

   
      setState(initState);

      // await urlify(text).then((result) => {
      //   if (result != null) {
      //     setState({
      //       ...state,
      //       responseUrls: result,
      //       responseReceived: true,
      //     });
      //   } else {
      
      //     setState({ ...state, badResponseReceived: true });
      //   }
      // });
      // } catch (err) {
      
      //   // will often be caught here if picture is too blurry and API response produces undefined 'text' key in JSON
      //   setState({ ...state, badResponseReceived: true });
      // }

      // const resultFromUri = await MlkitOcr?.detectFromUri(result.base64);
      
      // uploadImage(result.uri);
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
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View>
        {header()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
        >
          {buttonOptions()}
          {addPhoto()}
          {nameTextField()}
          {emailAddressTextField()}
          {idTextField()}
          {phoneTextField()}
          {countryTextField()}
          {tenantTypeButton()}
          {!state.isResident && businessLicenseAuth()}
          {!state.isResident && businessLicenseNo()}
        </ScrollView>
      </View>
      {addTenantButton()}
      {changeProfileOptions()}
    </SafeAreaView>
  );

  function changeProfileOptions() {
    return (
      <BottomSheet
        isVisible={state.showBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      >
        <View style={styles.bottomSheetContentStyle}>
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
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: Sizes.fixPadding,
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
            onPress={async () => {
              await PickImage();
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
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }

  function addTenantButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.goBack()}
        style={styles.addNewListingButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Add Tenant</Text>
      </TouchableOpacity>
    );
  }

  function tenantTypeButton() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, isResident: true })}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: width / 2.0,
          }}
        >
          <View style={styles.buyOrRentUnselectedStyle}>
            {state.isResident ? (
              <View style={styles.buyOrRentSelectedStyle}></View>
            ) : null}
          </View>
          <Text
            style={{
              ...Fonts.blackColor14Medium,
              marginLeft: Sizes.fixPadding - 2.0,
            }}
          >
            Residential
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, isResident: false })}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={styles.buyOrRentUnselectedStyle}>
            {state.isResident ? null : (
              <View style={styles.buyOrRentSelectedStyle}></View>
            )}
          </View>
          <Text
            style={{
              ...Fonts.blackColor14Medium,
              marginLeft: Sizes.fixPadding - 2.0,
            }}
          >
            Commerical
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function countryTextField() {
    return (
      <TextInput
        label="Nationality"
        mode="outlined"
        value={state.nationality}
        placeholder={state.countryFocus ? "Nationality" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, countryFocus: true })}
        // onFocus={() => setState({...state, countryFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function businessLicenseNo() {
    return (
      <TextInput
        label="Business License No"
        mode="outlined"
        placeholder={state.businessLicenseNoFocus ? "Business License No" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, businessLicenseNoFocus: true })}
        // onFocus={() => setState({...state, businessLicenseNoFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function businessLicenseAuth() {
    return (
      <TextInput
        label="Business License Auth"
        mode="outlined"
        placeholder={state.businessLicenseFocus ? "Business License Auth" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, businessLicenseFocus: true })}
        // onFocus={() => setState({...state, businessLicenseFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function phoneTextField() {
    return (
      <TextInput
        label="Phone No"
        mode="outlined"
        placeholder={state.phoneFocus ? "Phone No" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, phoneFocus: true })}
        // onFocus={() => setState({...state, phoneFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function idTextField() {
    return (
      <TextInput
        label="Identity Number"
        mode="outlined"
        value={state.emiratesId}
        placeholder={state.identityFocus ? "Identity Number" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, identityFocus: true })}
        // onFocus={() => setState({...state, identityFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function emailAddressTextField() {
    return (
      <TextInput
        label="Email Address"
        mode="outlined"
        placeholder={state.emailAddressFocus ? "Email Address" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, emailAddressFocus: true })}
        // onFocus={() => setState({...state, addressFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Full Name"
        mode="outlined"
        type="email"
        value={state.name}
        placeholder={state.titleFocus ? "Name" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, nameFocus: true })}
        // onFocus={() => setState({...state, titleFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function addPhoto() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setState({ ...state, showBottomSheet: true })}
        style={styles.addPhotoContentStyle}
      >
        <MaterialCommunityIcons name="camera-plus" size={24} color="black" />
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
          Add New Tenant
        </Text>
      </View>
    );
  }

  function buttonOptions() {
    return (
      <View style={styles.buyAndRentButtonContainerStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("AddNewListing")}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: !state.isBuy
              ? Colors.primaryColor
              : Colors.whiteColor,
            borderColor: !state.isBuy ? null : Colors.primaryColor,
            borderWidth: !state.isBuy ? 0.0 : 1.0,
          }}
        >
          <Text
            style={
              !state.isBuy
                ? { ...Fonts.whiteColor16Bold }
                : { ...Fonts.primaryColor16Medium }
            }
          >
            <MaterialCommunityIcons
              name="camera-plus"
              size={24}
              color={Colors.primaryColor}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("AddNewTenant")}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: !state.isBuy
              ? Colors.primaryColor
              : Colors.whiteColor,
            borderColor: !state.isBuy ? null : Colors.primaryColor,
            borderWidth: !state.isBuy ? 0.0 : 1.0,
          }}
        >
          <Text
            style={
              !state.isBuy
                ? { ...Fonts.whiteColor16Bold }
                : { ...Fonts.primaryColor16Medium }
            }
          >
            <MaterialCommunityIcons
              name="file-plus"
              size={24}
              color={Colors.primaryColor}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("CreateContract")}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: !state.isBuy
              ? Colors.whiteColor
              : Colors.primaryColor,
            borderColor: !state.isBuy ? Colors.primaryColor : null,
            borderWidth: !state.isBuy ? 1.0 : 0.0,
          }}
        >
          <Text
            style={
              !state.isBuy
                ? { ...Fonts.primaryColor16Medium }
                : { ...Fonts.whiteColor16Bold }
            }
          >
            <MaterialIcons
              name="article"
              size={24}
              color={Colors.whiteColor}
            ></MaterialIcons>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buyAndRentButtonContainerStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  buyAndRentButtonStyle: {
    flex: 0.47,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding,
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
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    height: 50.0,
  },
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
  addNewListingButtonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
  addPhotoContentStyle: {
    width: 100.0,
    height: 100.0,
    borderRadius: 50.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding,
  },
  bottomSheetContentStyle: {
    backgroundColor: Colors.whiteColor,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding,
  },
});

AddNewTenantScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default AddNewTenantScreen;
