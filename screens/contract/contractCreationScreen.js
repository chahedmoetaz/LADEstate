import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { useForm, useController } from "react-hook-form";
import {TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker'
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


import { FormBuilder } from "react-native-paper-form-builder";


import { TransitionPresets } from "react-navigation-stack";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";



function ContractCreationScreen({ route, navigation }) {
  const [item, setContract] = useContext(ContractContext);
  const [dateFromValue, setDateFrom] = useState(new Date(item?.dateFrom ? item.dateFrom : new Date().toDateString()))
  const [openFrom, setOpenFrom] = useState(false)
  const [dateToValue, setDateTo] = useState(new Date(item?.dateTo ? item.dateTo : new Date().toDateString()))
  const [openTo, setOpenTo] = useState(false)
  const { control, setFocus, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...item,
    },
    mode: "onSubmit",
  });
  

  function addContractDetailsForm() {
    return (
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              [
                {
                  name: 'dateFrom',
                  type: 'custom',
                  JSX: dateFrom,
                }, {
                  name: 'dateTo',
                  type: 'custom',
                  JSX: dateTo,
                }],
              [
                {
                  type: "text",
                  name: "annualRent",

                  rules: {
                    required: {
                      value: true,
                      message: "Annual rent is required",
                    },
                  },
                  textInputProps: {
                    label: "Annual Rent",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "contractValue",

                  rules: {
                    required: {
                      value: false,
                      message: "Contract value is required",
                    },
                  },
                  textInputProps: {
                    label: "Contract Value",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ],

              [
                {
                  type: "text",
                  name: "agentCommision",
                  rules: {
                    required: {
                      value: false,
                      message: "Agent commision is required",
                    },
                  },
                  textInputProps: {
                    label: "Agent commision",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
                {
                  type: "text",
                  name: "securityDeposit",

                  rules: {
                    required: {
                      value: true,
                      message: "Security deposit is required",
                    },
                  },
                  textInputProps: {
                    label: "Security Deposit",
                    style: { backgroundColor: Colors.whiteColor },
                  },
                },
              ],
              {
                type: "text",
                name: "modePayment",
                rules: {
                  required: {
                    value: true,
                    message: "Mode of payment is required",
                  },
                },
                textInputProps: {
                  label: "Mode of Payment",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
              {
                type: "text",
                name: "additional1",

                textInputProps: {
                  label: "Additional Terms",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
              {
                type: "text",
                name: "additional2",

                textInputProps: {
                  label: "Additional Terms",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
              {
                type: "text",
                name: "additional3",

                textInputProps: {
                  label: "Additional Terms",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
              {
                type: "text",
                name: "additional4",

                textInputProps: {
                  label: "Additional Terms",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
              {
                type: "text",
                name: "additional5",

                textInputProps: {
                  label: "Additional Terms",
                  style: { backgroundColor: Colors.whiteColor },
                },
              },
            ]}
          />
        </ScrollView>
      </View>
    );
  }

  

  function dateFrom(props) {
    const {name, rules, shouldUnregister, defaultValue, control} = props;
    const {field} = useController({
      name,
      rules,
      shouldUnregister,
      defaultValue,
      control,
    });
  
    return (
      <>
      
      <DatePicker
        modal
        mode="date"
        open={openFrom}
        date={dateFromValue}
        onConfirm={(date) => {
          setOpenFrom(false)
          setDateFrom(date)
          setValue("dateFrom", date ? date.toDateString(): "");
        }}
        onCancel={() => {
          setOpenFrom(false)
        }}
      />
   <TextInput label="Date From" style={{backgroundColor: "white"}} value={dateFromValue.toDateString()} mode="outlined" right={<TextInput.Icon icon="calendar-month-outline" title="Open" onPress={() => setOpenFrom(true)} />}></TextInput>
     
       </>
    );
  }

  function dateTo(props) {
    const {name, rules, shouldUnregister, defaultValue, control} = props;
    const {field} = useController({
      name,
      rules,
      shouldUnregister,
      defaultValue,
      control,
    });
  
    return (
      <>
      
      <DatePicker
        modal
        mode="date"
        open={openTo}
        date={dateToValue}
        onConfirm={(date) => {
          setOpenTo(false)
          setDateTo(date)
          setValue("dateTo", date ? date.toDateString(): "");
        }}
        onCancel={() => {
          setOpenFrom(false)
        }}
      />
   <TextInput label="Date To" style={{backgroundColor: "white"}} value={dateToValue.toDateString()} mode="outlined" right={<TextInput.Icon icon="calendar-month-outline" title="Open" onPress={() => setOpenTo(true)} />}></TextInput>
     
       </>
    );
  }

  function addListingButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSubmit((data) => {
          setContract({ ...item, ...data });
          navigation.navigate("AddTenantLandlord");
        })}
        style={styles.addNewListingButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Add Contract Details</Text>
      </TouchableOpacity>
    );
  }

  const property = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.featuredPropertyContentStyle}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <View style={styles.featuredPropertyAmountContentStyle}>
            <Text style={{ ...Fonts.blackColor16SemiBold }}>
              {item.PropertyUsage}
            </Text>
          </View>
          <View style={{ flex: 1, marginHorizontal: 15 }}>
            <Text style={{ ...Fonts.grayColor14Medium }}>
              {item.PropertyName}
            </Text>
            <Text style={{ ...Fonts.grayColor14Medium }}>
              {item.PropertyAddress}
            </Text>
            <Text style={{ ...Fonts.grayColor14Medium }}>
              {item.PropertyType}
            </Text>
            {/* <Text style={{ ...Fonts.blackColor14SemiBold }}>{item.Size}m2</Text> */}
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={
                item.PropertyImage
                  ? { uri: item.PropertyImage }
                  : require("../../assets/images/house.png")
              }
              resizeMode="cover"
              style={styles.featuredPropertyImageStyle}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: Sizes.fixPadding,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>{item.PlotNo}</Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              Plot No
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>
              {item.Bedrooms}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              <MaterialCommunityIcons
                name="bed"
                size={15}
                color={Colors.primaryColor}
              />
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>
              {item.Bathrooms}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              <MaterialIcons
                name="bathtub"
                size={15}
                color={Colors.primaryColor}
              />
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>
              {item.Kitchens}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              <MaterialIcons
                name="kitchen"
                size={15}
                color={Colors.primaryColor}
              />
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>
              {item.ParkingSpaces ? item.ParkingSpaces : 0}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              <MaterialCommunityIcons
                name="parking"
                size={15}
                color={Colors.primaryColor}
              />
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>{item.Size}m2</Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              <MaterialCommunityIcons
                name="image-size-select-small"
                size={15}
                color={Colors.primaryColor}
              />
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor12Regular }}>{item.DewaNo}</Text>
            <Text
              style={{
                ...Fonts.blackColor12Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              DEWA
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          Contract Creation
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <KeyboardAwareScrollView>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {header()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
          >
            {/* {title({
              title: `${item?.contractName} for ${item?.PropertyName}`,
            })} */}
            {/* {property(item)} */}
            {/* {title({
              title: "Contract Details",
            })} */}
           
            {addContractDetailsForm()}
          </ScrollView>
        </View>
        {addListingButton()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerFormStyle: {
    marginHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding

  },
  featuredPropertyContentStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 3.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  featuredPropertyImageStyle: {
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    width: "100%",
    height: 220.0,
  },
  featuredPropertyInfoContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
    alignItems: "center",
  },
  featuredPropertyAmountContentStyle: {
    flex: 1,
    borderWidth: 1.0,
    alignItems: "center",
    height: 30.0,
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    borderColor: "rgba(128, 128, 128, 0.5)",
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
  featuredPropertyImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 10,
  },
  propertyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    marginVertical: Sizes.fixPadding * 0.5,
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

ContractCreationScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default ContractCreationScreen;
