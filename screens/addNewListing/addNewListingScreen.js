import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Checkbox, Provider, TextInput } from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
const { width } = Dimensions.get("screen");

function AddNewListingScreen({ route, navigation }) {
  const [item, setContract] = useContext(ContractContext);
  const { data, add, error } = useCollection(`properties`);
  const [state, setState] = useState({
    isBuy: true,
    showBottomSheet: false,
    propertyUsage: "Residential",
  });

  const residentialOptions = [
    {
      label: "Apartment",
      value: "Apartment",
    },
    {
      label: "Villa",
      value: "Villa",
    },
    {
      label: "Townhouse",
      value: "Townhouse",
    },
    {
      label: "Duplex",
      value: "Duplex",
    },
    {
      label: "Plot",
      value: "Plot",
    },
    {
      label: "Other",
      value: "Other",
    },
  ]

  const commercialOptions = [
   
    {
      label: "Office",
      value: "Office",
    },
    {
      label: "Plot",
      value: "Plot",
    },
    {
      label: "Retail Shop",
      value: "Retail Shop",
    },
    {
      label: "Other",
      value: "Other",
    },
  ]

  // const { contractName } = route.params;
  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues: {
      PropertyUsage: "Residential",
      ...item,
    },
    mode: "onChange",
  });
  const AddPropertyForm = () => {
    return (
      <Provider>
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              [
                {
                  type: "text",
                  name: "PropertyName",

                  rules: {
                    required: {
                      value: true,
                      message: "Building Name is required",
                    },
                  },
                  textInputProps: {
                    label: "Building Name",
                    style: { backgroundColor: "white" },
                  },
                },
                {
                  
                  name: "PropertyType",
                  type: "select",
                  rules: {
                    required: {
                      value: true,
                      message: "Building type is required",
                    },
                  },
                
                  options: state.propertyUsage === "Residential" ? residentialOptions : commercialOptions,
                  textInputProps: {
                    label: "Building type",
                    style: { backgroundColor: "white" },
                  },
                },
              ],
              {
                type: "text",
                name: "PropertyAddress",

                rules: {
                  required: {
                    value: true,
                    message: "Address is required",
                  },
                },
                textInputProps: {
                  label: "Building address",
                  style: { backgroundColor: "white" },
                },
              },

              [
                {
                  type: "text",
                  name: "DewaNo",

                  rules: {
                    required: {
                      value: true,
                      message: "Dewa no is required",
                    },
                  },
                  textInputProps: {
                    label: "Dewa no",
                    style: { backgroundColor: "white" },
                  },
                },
                {
                  type: "text",
                  name: "PropertyNo",

                  rules: {
                    required: {
                      value: true,
                      message: "Building no is required",
                    },
                  },
                  textInputProps: {
                    label: "Building no",
                    style: { backgroundColor: "white" },
                  },
                },
              ],
              [
                {
                  type: "text",
                  name: "PlotNo",

                  rules: {
                    required: {
                      value: true,
                      message: "Plot no is required",
                    },
                  },
                  textInputProps: {
                    label: "Plot no",
                    style: { backgroundColor: "white" },
                  },
                },

                {
                  type: "text",
                  name: "MakaniNo",

                  rules: {
                    required: {
                      value: true,
                      message: "Makina no is required",
                    },
                  },
                  textInputProps: {
                    label: "Makina no",
                    style: { backgroundColor: "white" },
                  },
                },
              ],
              [
                {
                  type: "text",
                  name: "Size",
                  rules: {
                    required: {
                      value: true,
                      message: "Size in sqm is required",
                    },
                  },
                  textInputProps: {
                    label: "Size in sqm",
                    style: { backgroundColor: "white" },
                  },
                },
                {
                  type: "text",
                  name: "Bathrooms",

                  textInputProps: {
                    label: "No of Bathrooms",
                    style: { backgroundColor: "white" },
                  },
                },
              ],
              [
                {
                  type: "text",
                  name: "Bedrooms",

                  textInputProps: {
                    label: "No of bedrooms",
                    style: { backgroundColor: "white" },
                  },
                },
                {
                  type: "text",
                  name: "Kitchens",

                  textInputProps: {
                    label: "No of Kitchens",
                    style: { backgroundColor: "white" },
                  },
                },
              ],
            ]}
          />
        </ScrollView>
      </View>
      </Provider>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <KeyboardAwareScrollView>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          {/* {countryTextField()} */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
          >
            {/* {addPhoto()} */}
            {handlePropertyUsage()}
            {AddPropertyForm()}
            {/* {titleTextField()}
            {addressTextField()}
            {propertyType()}
            {squarefeetTextField()}
            {dewaNumber()}
            {plotNumber()}
            {noOfBathroomTextField()}
            {noOfBedroomTextField()}
            {noOfKitchenTextField()} */}
            {/* {priceTextField()} */}
            {/* {buyRentButton()} */}
            {/* {handleSaveCheck()} */}
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
      {addListingButton()}
      {changeProfileOptions()}
    </SafeAreaView>
  );

  function handleSaveCheck() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Checkbox />
        <Text>Save property for future use?</Text>
      </View>
    );
  }

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

  async function addProperty(data) {
    await add({
      PropertyName: data.PropertyName,
      PropertyAddress: data.PropertyAddress,
      Size: data.Size,
      Bathrooms: data.Bathrooms,
      Bedrooms: data.Bedrooms,
      Kitchens: data.Kitchens,
      DewaNo: data.DewaNo,
      PlotNo: data.PlotNo,
      PropertyType: data.PropertyType,
      PropertyUsage: data.PropertyUsage,
      PropertyNo: data.PropertyNo,
      MakaniNo: data.MakaniNo,
    });
  }

  function addListingButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSubmit((data) => {
          setContract({ ...item, ...data });
          addProperty(data);
          navigation.navigate("ContractCreation");
        })}
        // onPress={async () => {
        //   await addProperty();
        //   await setContract({
        //     ...item,
        //     PropertyName: state.titleText,
        //     PropertyAddress: state.addressText,
        //     Size: state.squarefeetText,
        //     Bathrooms: state.noOfBathroomText,
        //     Bedrooms: state.noOfBedroomText,
        //     Kitchens: state.noOfKitchenText,
        //     DewaNo: state.dewaNumberText,
        //     PlotNo: state.plotNoText,
        //     PropertyType: state.propertyTypeText,
        //     PropertyUsage: state.propertyUsage,
        //   });

        //   navigation.navigate("ContractCreation");
        // }}
        style={styles.addNewListingButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Next</Text>
      </TouchableOpacity>
    );
  }

  //   function buyRentButton() {
  //     return (
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           marginHorizontal: Sizes.fixPadding * 2.0,
  //           marginTop: Sizes.fixPadding,
  //         }}
  //       >
  //         <TouchableOpacity
  //           activeOpacity={0.9}
  //           onPress={() => setState({ ...state, isBuy: true })}
  //           style={{
  //             flexDirection: "row",
  //             alignItems: "center",
  //             width: width / 2.0,
  //           }}
  //         >
  //           <View style={styles.buyOrRentUnselectedStyle}>
  //             {state.isBuy ? (
  //               <View style={styles.buyOrRentSelectedStyle}></View>
  //             ) : null}
  //           </View>
  //           <Text
  //             style={{
  //               ...Fonts.blackColor14Medium,
  //               marginLeft: Sizes.fixPadding - 2.0,
  //             }}
  //           >
  //             Buy
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           activeOpacity={0.9}
  //           onPress={() => setState({ ...state, isBuy: false })}
  //           style={{ flexDirection: "row", alignItems: "center" }}
  //         >
  //           <View style={styles.buyOrRentUnselectedStyle}>
  //             {state.isBuy ? null : (
  //               <View style={styles.buyOrRentSelectedStyle}></View>
  //             )}
  //           </View>
  //           <Text
  //             style={{
  //               ...Fonts.blackColor14Medium,
  //               marginLeft: Sizes.fixPadding - 2.0,
  //             }}
  //           >
  //             Rent
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }

  //   function priceTextField() {
  //     return (
  //       <TextInput
  //         label="Price (in Local Currency)"
  //         mode="outlined"
  //         placeholder={state.priceFocus ? "Price (in Local Currency)" : ""}
  //         style={styles.textFieldStyle}
  //         onFocus={() => setState({ ...state, priceFocus: true })}
  //         // onFocus={() => setState({ ...state, priceFocus: false })}
  //         selectionColor={Colors.blackColor}
  //         theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
  //       />
  //     );
  //   }

  function noOfKitchenTextField() {
    return (
      <TextInput
        label="No. of kitchen rooms"
        mode="outlined"
        placeholder={state.noOfKitchenFocus ? "No. of kitchen rooms" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, noOfKitchenFocus: true })}
        onChangeText={(x) => setState({ ...state, noOfKitchenText: x })}
        value={state.noOfKitchenText}
        // onFocus={() => setState({ ...state, noOfKitchenFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function noOfBedroomTextField() {
    return (
      <TextInput
        label="No. of bed rooms"
        mode="outlined"
        placeholder={state.noOfBedroomFocus ? "No. of bed rooms" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, noOfBedroomFocus: true })}
        onChangeText={(x) => setState({ ...state, noOfBedroomText: x })}
        value={state.noOfBedroomText}
        // onFocus={() => setState({ ...state, noOfBedroomFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function noOfBathroomTextField() {
    return (
      <TextInput
        label="No. of bathrooms"
        mode="outlined"
        placeholder={state.noOfBathroomFocus ? "No. of bathrooms" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, noOfBathroomFocus: true })}
        onChangeText={(x) => setState({ ...state, noOfBathroomText: x })}
        value={state.noOfBathroomText}
        // onFocus={() => setState({ ...state, noOfBathroomFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function squarefeetTextField() {
    return (
      <TextInput
        label="Square Meters"
        mode="outlined"
        placeholder={state.squarefeetFocus ? "Square Meters" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, squarefeetFocus: true })}
        onChangeText={(x) => setState({ ...state, squarefeetText: x })}
        value={state.squarefeetText}
        // onFocus={() => setState({ ...state, squarefeetFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function propertyType() {
    return (
      <TextInput
        label="Property Type"
        mode="outlined"
        placeholder={state.propertyTypeFocus ? "Property Type" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, propertyTypeFocus: true })}
        onChangeText={(x) => setState({ ...state, propertyTypeText: x })}
        value={state.propertyTypeText}
        // onFocus={() => setState({ ...state, propertyTypeFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function dewaNumber() {
    return (
      <TextInput
        label="Dewa Number"
        mode="outlined"
        placeholder={state.dewaNumberFocus ? "Dewa Number" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, dewaNumberFocus: true })}
        onChangeText={(x) => setState({ ...state, dewaNumberText: x })}
        value={state.dewaNumberText}
        // onFocus={() => setState({ ...state, dewaNumberFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function plotNumber() {
    return (
      <TextInput
        label="Plot No"
        mode="outlined"
        placeholder={state.plotNoFocus ? "Plot No" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, plotNoFocus: true })}
        onChangeText={(x) => setState({ ...state, plotNoText: x })}
        value={state.plotNoText}
        // onFocus={() => setState({ ...state, plotNo: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function addressTextField() {
    return (
      <TextInput
        label="Address"
        mode="outlined"
        placeholder={state.addressFocus ? "Address" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, addressFocus: true })}
        onChangeText={(x) => setState({ ...state, addressText: x })}
        value={state.addressText}
        // onFocus={() => setState({ ...state, addressFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function titleTextField() {
    return (
      <TextInput
        label="Property Name"
        mode="outlined"
        placeholder={state.titleFocus ? "Property Name" : ""}
        style={styles.textFieldStyle}
        onFocus={() => setState({ ...state, titleFocus: true })}
        onChangeText={(x) => setState({ ...state, titleText: x })}
        value={state.titleText}
        // onFocus={() => setState({ ...state, titleFocus: false })}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }

  function handlePropertyUsage() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("UserContracts")}
        style={styles.homeScreenOverviewStyle}
      >
        <TouchableOpacity
          onPress={() => {
            setState({ ...state, propertyUsage: "Residential" });
            setValue("PropertyUsage", "Residential");
          }}
          style={{
            backgroundColor:
              state.propertyUsage === "Residential"
                ? Colors.primaryColor
                : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: "45%",
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              state.propertyUsage === "Residential"
                ? {
                    ...Fonts.whiteColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
                : {
                    ...Fonts.primaryColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
            }
          >
            Residential
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setState({ ...state, propertyUsage: "Commerical" });
            setValue("PropertyUsage", "Commerical");
          }}
          style={{
            backgroundColor:
              state.propertyUsage === "Commerical"
                ? Colors.primaryColor
                : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: "45%",
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              state.propertyUsage === "Commerical"
                ? {
                    ...Fonts.whiteColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
                : {
                    ...Fonts.primaryColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
            }
          >
            Commerical
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setState({ ...state, propertyUsage: "Industrial" })}
          style={{
            backgroundColor:
              state.propertyUsage === "Industrial"
                ? Colors.primaryColor
                : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: width / 3.5,
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              state.propertyUsage === "Industrial"
                ? {
                    ...Fonts.whiteColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
                : {
                    ...Fonts.primaryColor14SemiBold,
                    alignSelf: "center",
                    justifyContent: "center",
                  }
            }
          >
            Industrial
          </Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
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
          Add Contract Details
        </Text>
      </View>
    );
  }

  //   function countryTextField() {
  //     return (
  //       <CountryPicker
  //         InputFieldStyle={styles.ContainerStyle}
  //         DropdownContainerStyle={styles.myDropdownContainerStyle}
  //         DropdownRowStyle={styles.myDropdownRowStyle}
  //         Placeholder="choose country ..."
  //         DropdownCountryTextStyle={styles.myDropdownCountryTextStyle}
  //         countryNameStyle={styles.mycountryNameStyle}
  //         flagSize={24}
  //         selectedItem={handleSelection}
  //       />
  //     );
  //   }
}

const styles = StyleSheet.create({
  containerFormStyle: {
    flex: 1,
    marginHorizontal: Sizes.fixPadding,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
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

AddNewListingScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default AddNewListingScreen;
