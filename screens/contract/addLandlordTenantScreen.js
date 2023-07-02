import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { showMessage, hideMessage } from "react-native-flash-message";
import DocumentScanner from 'react-native-ios-documentscanner';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  Button,
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
import Modal from "react-native-modal";
import { Chip } from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
// import Scanner from "react-native-rectangle-scanner";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
const { width } = Dimensions.get("screen");
function AddLandlordTenantScreen({ route, navigation }) {
  const cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const sheetRef = useRef();
  const [imageType, setImageType] = useState();
  const { data, add, error } = useCollection(`properties`);
  const [isModalVisible, setModalVisible] = useState(false);
  const [item, setContract] = useContext(ContractContext);
  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...item,
    },
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState({
    ...item,
  });
  const toggleModal = (type) => {
    setModalVisible(!isModalVisible);
    setImageType(type);
  };
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

  // function handleOnPictureProcessed({ croppedImage, initialImage }) {
 
  // }
  // function docscan() {
  //   return (
  //     <Scanner
  //       onPictureProcessed={handleOnPictureProcessed}
  //       ref={this.camera}
  //       style={{ flex: 1 }}
  //     />
  //   );
  // }
  function title({ title }) {
    return (
      <Text
        style={{
          ...Fonts.blackColor18Bold,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        {title}
      </Text>
    );
  }

  const AddTenantForm = () => {
    return (
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <View
            style={{
              marginVertical: Sizes.fixPadding,

              borderColor: Colors.primaryColor,
              borderRadius: 5,
              borderWidth: 1,
            }}
          >
            {/* <Text>Emirates Id</Text> */}
            <Image
              source={
                state.tenantImage
                  ? { uri: state.tenantImage }
                  : require("../../assets/images/user/demo-profile.png")
              }
              style={{
                height: state.tenantImage ? 300.0 : 0,
                width: Dimensions.width,
                borderRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              [
                {
                  type: "text",
                  name: "tenantName",

                  rules: {
                    required: {
                      value: true,
                      message: "Tenant Name is required",
                    },
                  },
                  textInputProps: {
                    label: "Tenant Name",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "tenantEmiratesId",

                  rules: {
                    required: {
                      value: true,
                      message: "Tenant Emirates Id is required",
                    },
                  },
                  textInputProps: {
                    label: "Tenant Emirates Id",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                  pattern: {
                    value: /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]$/,
                    message: "Tenant Id is invalid",
                  },
                },
              ],

              [
                {
                  type: "text",
                  name: "tenantNationality",
                  rules: {
                    required: {
                      value: true,
                      message: "Tenant Nationality is required",
                    },
                  },
                  textInputProps: {
                    label: "Tenant Nationality",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "email",
                  name: "tenantEmail",

                  rules: {
                    required: {
                      value: true,
                      message: "Tenant email is required",
                    },
                  },
                  textInputProps: {
                    label: "Tenant Email",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ],
              {
                type: "text",
                name: "tenantPhone",

                rules: {
                  required: {
                    value: true,
                    message: "Tenant phone number is required",
                  },
                },
                textInputProps: {
                  label: "Tenant Phone Number",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
            ]}
          />
        </ScrollView>
      </View>
    );
  };

  const AddLandlordForm = () => {
    return (
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <View
            style={{
              marginVertical: Sizes.fixPadding,

              borderColor: Colors.primaryColor,
              borderRadius: 5,
              borderWidth: 1,
            }}
          >
            {/* <Text>Emirates Id</Text> */}
            <Image
              source={
                state.landlordImage
                  ? { uri: state.landlordImage }
                  : require("../../assets/images/user/demo-profile.png")
              }
              style={{
                height: state.landlordImage ? 300.0 : 0,
                width: Dimensions.width,
                borderRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              [
                {
                  type: "text",
                  name: "ownerName",

                  rules: {
                    required: {
                      value: true,
                      message: "Owner Name is required",
                    },
                  },
                  textInputProps: {
                    label: "Owner Name",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "landlordName",

                  rules: {
                    required: {
                      value: true,
                      message: "Landlord Name is required",
                    },
                  },
                  textInputProps: {
                    label: "Landlord Name",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ],
              {
                type: "text",
                name: "landlordEmiratesId",

                rules: {
                  required: {
                    value: true,
                    message: "Landlord Emirates Id is required",
                  },
                },
                textInputProps: {
                  label: "Landlord Emirates Id",
                  style: { backgroundColor: Colors.whiteColor },
                },
                pattern: {
                  value: /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]$/,
                  message: "Landlord Id is invalid",
                },
              },
              ,
              [
                {
                  type: "text",
                  name: "landlordNationality",
                  rules: {
                    required: {
                      value: true,
                      message: "Landlord Nationality is required",
                    },
                  },
                  textInputProps: {
                    label: "Landlord Nationality",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "email",
                  name: "landlordEmail",

                  rules: {
                    required: {
                      value: true,
                      message: "Landlord email is required",
                    },
                  },
                  textInputProps: {
                    label: "Landlord Email",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ],
              {
                type: "text",
                name: "landlordPhone",

                rules: {
                  required: {
                    value: true,
                    message: "Landlord Phone number is required",
                  },
                },
                textInputProps: {
                  label: "Landlord Phone Number",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
            ]}
          />
        </ScrollView>
      </View>
    );
  };

  function checkingstring(text) {
    var regex = /^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]$/.test(text);

    return regex;
  }

  async function PickImage(type) {
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
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyABUjG_Chamn2jnN6bYQFA9Ek7zZiJB6mM",
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
      let text 
      try {
        text = responseParsed.responses[0].fullTextAnnotation.text;  
      } catch (error) {
        showMessage({
          message: "No valid Id was recognised.",
          type: "danger",
        })
        return null
      }
     
      let textArray = text.split("\n");
    

      let initState = {};

      if (type === "landlord") {
        initState = {
          ...state,
          landlordImage: result.uri,
          showBottomSheet: false,
        };
      } else {
        initState = {
          ...state,
          tenantImage: result.uri,
          showBottomSheet: false,
        };
      }

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
              .replace("Nationality", "")
              .replace(":", "")
              .replace(".", "")
              .trim(),
          };
        }
        //Do something
      }

      if (type === "landlord") {
        setValue("landlordEmiratesId", initState.emiratesId);
        setValue("landlordNationality", initState.nationality);
        setValue("landlordName", initState.name);
        setValue("ownerName", initState.name);
      } else {
        setValue("tenantEmiratesId", initState.emiratesId);
        setValue("tenantNationality", initState.nationality);
        setValue("tenantName", initState.name);
      }
    
      setState(initState);
    }
  }
  function addTenatIdImage(type) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
          }}
          onPress={async () => {
            Platform.OS === "android" && await toggleModal(type);
            Platform.OS === "ios" && iosScan(type)
          }}
        >
          <Chip
            style={{ backgroundColor: Colors.primaryColor, borderRadius: 8 }}
          >
            {/* <MaterialIcons
            name="photo-album"
            size={22}
            color={Colors.blackColor}
          /> */}
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Scan Emirates Id
            </Text>
          </Chip>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
          }}
          onPress={async () => {
            await PickImage(type);
          }}
        >
          <Chip
            style={{ backgroundColor: Colors.primaryColor, borderRadius: 8 }}
          >
            {/* <MaterialIcons
            name="photo-album"
            size={22}
            color={Colors.blackColor}
          /> */}
            <Text
              style={{
                ...Fonts.whiteColor16Medium,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Pick Emirates Id
            </Text>
          </Chip>
        </TouchableOpacity>
      </View>
    );
  }

  async function uploadImage(uri) {
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
  }

  function addListingButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSubmit((data) => {
          setContract({ ...item, ...data });
          navigation.navigate("ReviewContract");
        })}
        style={styles.addNewListingButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Add Details</Text>
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
          Landlord & Tenant
        </Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current.snapToIndex(index);
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async (type) => {



    let options = {
      quality: 0.5,
      base64: true,
      exif: false,
    };

    
    let result = await cameraRef.current.takePictureAsync(options);
  
    // handleSnapPress(0);
    
    
    // setPhoto(newPhoto);

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
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyABUjG_Chamn2jnN6bYQFA9Ek7zZiJB6mM",
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
   

    let initState = {};
    if (imageType === "landlord") {
      initState = {
        ...state,
        landlordImage: result.uri,
        showBottomSheet: false,
      };
    } else {
      initState = { ...state, tenantImage: result.uri, showBottomSheet: false };
    }

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
            .replace("Nationality", "")
            .replace(":", "")
            .replace(".", "")
            .trim(),
        };
      }
      //Do something
    }

    if (imageType === "landlord") {
      setValue("landlordEmiratesId", initState.emiratesId);
      setValue("landlordNationality", initState.nationality);
      setValue("landlordName", initState.name);
      setValue("ownerName", initState.name);
    } else {
      setValue("tenantEmiratesId", initState.emiratesId);
      setValue("tenantNationality", initState.nationality);
      setValue("tenantName", initState.name);
    }

  
    setState({...state, ...initState});
    setModalVisible(false);
  };

  let sharePic = () => {
    shareAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };

  let savePhoto = () => {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };


  const iosScan = (type) => {
    
try {
  DocumentScanner().startScan(
    {
      
      savePath: { originalImagePath: 'temp/original', imagePath: 'temp/cropped' },
      callback: async (image) => {
        if (image) {
          let uri = image.imageList[image.imageList.length -1]
          let options = { encoding: FileSystem.EncodingType.Base64 };
          FileSystem.readAsStringAsync(uri, options).then(async data => {
            const result = data;
            const resultUri = 'data:image/png;base64,' + data;

            setUploading(true);
   

            let body = JSON.stringify({
              requests: [
                {
                  features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 }],
                  image: {
                    content: result,
                  },
                },
              ],
            });
        
           
            let response = await fetch(
              "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyABUjG_Chamn2jnN6bYQFA9Ek7zZiJB6mM",
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
           
        
            let initState = {};
            if (type === "landlord") {
              initState = {
                ...state,
                landlordImage: resultUri,
                showBottomSheet: false,
              };
            } else {
              initState = { ...state, tenantImage: resultUri, showBottomSheet: false };
            }
        
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
                    .replace("Nationality", "")
                    .replace(":", "")
                    .replace(".", "")
                    .trim(),
                };
              }
              //Do something
            }
        
            if (type === "landlord") {
              setValue("landlordEmiratesId", initState.emiratesId);
              setValue("landlordNationality", initState.nationality);
              setValue("landlordName", initState.name);
              setValue("ownerName", initState.name);
            } else {
              setValue("tenantEmiratesId", initState.emiratesId);
              setValue("tenantNationality", initState.nationality);
              setValue("tenantName", initState.name);
            }

            setState({...state, ...initState})

            //console.log(result)
        }).catch(err => {
            
            showMessage({
              message: "An unexpected error occured please try again.",
              type: "danger",
            })
            
        });
          //console.log(image?.originalImageList, image?.imageList)  
        }
        
      }
    })  
} catch (error) {
  showMessage({
    message: "An unexpected error occured please try again.",
    type: "danger",
  })
}

  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <KeyboardAwareScrollView>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          
          <Modal
            isVisible={isModalVisible }
            style={{
              flexDirection: "column",
              flex: 1,
              // alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Camera style={styles.container} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                  <Button title="Take Pic" onPress={() => takePic()} />
                </View>
                <StatusBar style="auto" />

                {/* {photo && (
                  <Image
                    style={styles.preview}
                    source={{
                      uri: "data:image/jpg;base64," + photo.base64,
                    }}
                  />
                )} */}
                {/* <Button title="Share" onPress={() => sharePic()} />
                {hasMediaLibraryPermission ? (
                  <Button title="Save" onPress={() => savePhoto()} />
                ) : undefined}
                <Button title="Discard" onPress={() => setPhoto()} /> */}
              </Camera>
              <Button title="Hide modal" onPress={toggleModal} />
            </View>
          </Modal>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
          >
            {/* {docscan()} */}
            {title({ title: "Landlord Details" })}
            {addTenatIdImage("landlord")}
            <AddLandlordForm />
            {title({ title: "Tenant Details" })}
            {addTenatIdImage("tenant")}
            <AddTenantForm />
          </ScrollView>
        </View>
        {addListingButton()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    resizeMode: "cover",
    height: 300,
  },
  containerFormStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  headingStyle: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 40,
  },
  homeScreenOverviewStyle: {
    backgroundColor: "#eef3fa",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding - 3.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
  },
  ContainerStyle: {
    paddingHorizontal: Sizes.fixPadding * 2.0,
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    borderColor: Colors.grayColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 50.0,
  },
  myDropdownContainerStyle: {
    paddingHorizontal: Sizes.fixPadding * 2.0,
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

AddLandlordTenantScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default AddLandlordTenantScreen;
