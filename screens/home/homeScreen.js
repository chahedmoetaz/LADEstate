import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Snackbar } from "react-native-paper";
import { useCollection, useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const { width } = Dimensions.get("screen");

function HomeScreen({ navigation }) {
  const [state, setState] = useState({
    isBuy: true,
    // nearbyProperyChangableList: nearByPropertyList,
    // featuredPropertyChangableList: featuredPropertyList,
    showSnackBar: false,
    isInWishList: false,
    dateSelected: null,
  });

  const { user: userAuth } = useAuthentication();
  const { data: user } = useDocument(
    userAuth ? `users/${userAuth.uid}` : undefined
  );
  const { data: contractData } = useCollection(
    user ? `contracts` : undefined,
    {},
    { where: ["agentEmail", "==", user?.email] }
  );

  const { data: landlordContractData } = useCollection(
    user ? `contracts` : undefined,
    {},
    { where: ["landlordEmail", "==", user?.email] }
  );

  const { data: tenantContractData } = useCollection(
    user ? `contracts` : undefined,
    {},
    { where: ["tenantEmail", "==", user?.email] }
  );

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     activeOpacity={0.9}
  //     onPress={() =>
  //       navigation.navigate("Property", {
  //         propertyImage: item.ImageList[0],
  //         propertyName: item.PropertyName,
  //         propertyAddress: item.PropertyAddress,
  //         propertyAmount: item.PropertyAmount,
  //         id: item.id,
  //         propertyDescription: item.PropertyDescription,
  //         propertyBedrooms: item.Bedrooms,
  //         propertyKitchens: item.Kitchens,
  //         propertySize: item.Size,
  //         propertyBathrooms: item.Bathrooms,
  //         propertyAminities: item.PropertyAminities,
  //         propertyParkingSpaces: item.ParkingSpaces,
  //         propertyNearestPlaces: item.NearestPlaces,
  //       })
  //     }
  //     style={styles.featuredPropertyContentStyle}
  //   >
  //     <Image
  //       source={{ uri: item.ImageList[0] }}
  //       resizeMode="cover"
  //       style={styles.featuredPropertyImageStyle}
  //     />
  //     <TouchableOpacity
  //       activeOpacity={0.9}
  //       onPress={() => {
  //         handleFeaturedPropertyUpdate({ id: item.id });
  //         setState({
  //           ...state,
  //           isInWishList: item.isFavourit,
  //           showSnackBar: true,
  //         });
  //       }}
  //       style={styles.addToFavouriteContainerStyle}
  //     >
  //       <MaterialIcons
  //         name={item.isFavourit ? "favorite" : "favorite-border"}
  //         size={16}
  //         color={Colors.grayColor}
  //       />
  //     </TouchableOpacity>
  //     <View style={styles.featuredPropertyInfoContentStyle}>
  //       <View style={{ width: width / 1.9 }}>
  //         <Text style={{ ...Fonts.blackColor14SemiBold }}>
  //           {item.PropertyName}
  //         </Text>
  //         <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
  //           {item.PropertyAddress}
  //         </Text>
  //       </View>
  //       <View style={styles.featuredPropertyAmountContentStyle}>
  //         <Text style={{ ...Fonts.blackColor16SemiBold }}>
  //           ${item.PropertyAmount}
  //         </Text>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  // function handleFeaturedPropertyUpdate({ id }) {
  //   const newList = state.featuredPropertyChangableList.map((property) => {
  //     if (property.id === id) {
  //       const updatedItem = { ...property, isFavourit: !property.isFavourit };
  //       return updatedItem;
  //     }
  //     return property;
  //   });
  //   setState({ ...state, featuredPropertyChangableList: newList });
  // }

  // function handleNearByPropertyUpdate({ id }) {
  //   const newList = state.nearbyProperyChangableList.map((property) => {
  //     if (property.id === id) {
  //       const updatedItem = { ...property, isFavourit: !property.isFavourit };
  //       return updatedItem;
  //     }
  //     return property;
  //   });
  //   setState({ ...state, nearbyProperyChangableList: newList });
  // }

  const handleNotifications = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Notification")}
        style={styles.homeScreenNotificationStyle}
      >
        <MaterialIcons
          name="notifications"
          size={24}
          color={Colors.secondaryColor}
          style={{ marginLeft: Sizes.fixPadding + 5.0 }}
        />
        <Text style={{ color: Colors.primaryColor, maxWidth: width / 2.0 }}>
          You have received{" "}
          <Text style={{ color: Colors.secondaryColor }}>0</Text> new contract
          activity
        </Text>
        <AntDesign name="right" size={24} color={Colors.primaryColor} />
      </TouchableOpacity>
    );
  };

  const handleOverview = () => {
    return (
      <>
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MyListing")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Properties</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
            {data?.length}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("UserContracts")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Contracts</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
           {contractData?.filter(x => x.status !="Cancelled").length} ({contractData?.length})
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const handleLandLordOverview = () => {
    return (
      <>
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MyListing")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Properties</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
            {data?.length}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("LandLordContracts")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Contracts</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
            {landlordContractData?.length}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const handleTenantOverview = () => {
    return (
      <>
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MyListing")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Properties</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
            {data?.length}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("TenantContracts")}
          style={styles.homeScreenOverviewStyle}
        >
          <Text>Total Contracts</Text>
          <Text style={{ color: Colors.primaryColor, fontSize: 20 }}>
            {tenantContractData?.length}
          </Text>
        </TouchableOpacity>
      </>
    );
  };
  // function scan() {
  //   <Button
  //     text="SCAN"
  //     onPress={() =>
  //       RNGeniusScan.setLicenceKey(
  //         "533c5006515f040600540e57395054023b5204510d0205085b0f0d"
  //       )
  //         .then(() => {
  //           return RNGeniusScan.scanWithConfiguration({ source: "camera" });
  //         })
  //         .then((result) => {
  //           console.lod(result);
  //         })
  //         .catch((error) => {
  //           // Handle error
  //         })
  //     }
  //   >
  //     Send Email
  //   </Button>;
  // }

  // function nearbyProperties() {
  //   const renderItem = ({ item }) => (
  //     <TouchableOpacity
  //       activeOpacity={0.9}
  //       onPress={() =>
  //         navigation.navigate("Property", {
  //           propertyImage: item.propertyImage,
  //           propertyName: item.propertyName,
  //           propertyAddress: item.propertyAddress,
  //           propertyAmount: item.propertyAmount,
  //         })
  //       }
  //       style={styles.nearByPropertContentStyle}
  //     >
  //       <Image
  //         source={item.propertyImage}
  //         resizeMode="cover"
  //         style={styles.nearByPropertyImageStyle}
  //       />
  //       <TouchableOpacity
  //         activeOpacity={0.9}
  //         onPress={() => {
  //           handleNearByPropertyUpdate({ id: item.id });
  //           setState({
  //             ...state,
  //             isInWishList: item.isFavourit,
  //             showSnackBar: true,
  //           });
  //         }}
  //         style={styles.addToFavouriteContainerStyle}
  //       >
  //         <MaterialIcons
  //           name={item.isFavourit ? "favorite" : "favorite-border"}
  //           size={16}
  //           color={Colors.grayColor}
  //         />
  //       </TouchableOpacity>
  //       <View style={{ marginHorizontal: Sizes.fixPadding }}>
  //         <Text
  //           style={{
  //             ...Fonts.blackColor14SemiBold,
  //             marginTop: Sizes.fixPadding,
  //           }}
  //         >
  //           {item.propertyName}
  //         </Text>
  //         <Text
  //           numberOfLines={1}
  //           style={{
  //             ...Fonts.grayColor12Medium,
  //             marginVertical: Sizes.fixPadding - 5.0,
  //           }}
  //         >
  //           {item.propertyAddress}
  //         </Text>
  //         <Text style={{ ...Fonts.blackColor16SemiBold }}>
  //           ${item.propertyAmount}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  //   return (
  //     <>
  //       <FlatList
  //         horizontal
  //         data={state.nearbyProperyChangableList}
  //         keyExtractor={(item) => `${item.id}`}
  //         renderItem={renderItem}
  //         contentContainerStyle={{
  //           paddingLeft: Sizes.fixPadding * 2.0,
  //           paddingBottom: Sizes.fixPadding + 5.0,
  //         }}
  //         showsHorizontalScrollIndicator={false}
  //       />
  //     </>
  //   );
  // }

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

  // function buyAndRentButton() {
  //   return (
  //     <View style={styles.buyAndRentButtonContainerStyle}>
  //       <TouchableOpacity
  //         activeOpacity={0.9}
  //         onPress={() => setState({ ...state, isBuy: true })}
  //         style={{
  //           ...styles.buyAndRentButtonStyle,
  //           backgroundColor: state.isBuy
  //             ? Colors.primaryColor
  //             : Colors.whiteColor,
  //           borderColor: state.isBuy ? null : Colors.primaryColor,
  //           borderWidth: state.isBuy ? 0.0 : 1.0,
  //         }}
  //       >
  //         <Text
  //           style={
  //             state.isBuy
  //               ? { ...Fonts.whiteColor16Bold }
  //               : { ...Fonts.primaryColor16Medium }
  //           }
  //         >
  //           Buy
  //         </Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         activeOpacity={0.9}
  //         onPress={() => setState({ ...state, isBuy: false })}
  //         style={{
  //           ...styles.buyAndRentButtonStyle,
  //           backgroundColor: state.isBuy
  //             ? Colors.whiteColor
  //             : Colors.primaryColor,
  //           borderColor: state.isBuy ? Colors.primaryColor : null,
  //           borderWidth: state.isBuy ? 1.0 : 0.0,
  //         }}
  //       >
  //         <Text
  //           style={
  //             state.isBuy
  //               ? { ...Fonts.primaryColor16Medium }
  //               : { ...Fonts.whiteColor16Bold }
  //           }
  //         >
  //           Rent
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  function addCreateContractButton() {
    return (
      <View style={styles.buyAndRentButtonContainerStyle}>
        {/* <TouchableOpacity
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
              name="home-plus"
              size={24}
              color={Colors.primaryColor}
            ></MaterialCommunityIcons>
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("UserCompletedContracts")}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: !state.isBuy
              ? Colors.primaryColor
              : Colors.whiteColor,
            borderColor: !state.isBuy ? null : Colors.primaryColor,
            borderWidth: !state.isBuy ? 0.0 : 1.0,
          }}
        >
          <MaterialCommunityIcons
            name="file"
            size={24}
            color={Colors.primaryColor}
          ></MaterialCommunityIcons>
          <Text
            style={
              !state.isBuy
                ? { ...Fonts.whiteColor16Bold, textAlign: "center" }
                : { ...Fonts.primaryColor16Medium, textAlign: "center" }
            }
          >
            Completed Contracts
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
          <MaterialCommunityIcons
            name="file-plus"
            size={24}
            color={Colors.whiteColor}
          ></MaterialCommunityIcons>
          <Text
            style={
              !state.isBuy
                ? {
                    ...Fonts.primaryColor16Medium,
                    textAlign: "center",
                  }
                : { ...Fonts.whiteColor16Bold, textAlign: "center" }
            }
          >
            Create New Contract
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // function calander() {
  //   return (
  //     <View>
  //       <CalendarStrip
  //         style={{
  //           height: 150,
  //           paddingTop: Sizes.fixPadding * 2.0,
  //           paddingBottom: Sizes.fixPadding * 2.0,
  //           paddingHorizontal: Sizes.fixPadding * 2.0,
  //         }}
  //         highlightDateContainerStyle={{
  //           backgroundColor: Colors.primaryColor,
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //         onDateSelected={(e) => setState({ ...state, dateSelected: e })}
  //         dateNumberStyle={{ color: "black", fontSize: 17.0 }}
  //         dateNameStyle={{ color: "black", fontSize: 15.0 }}
  //         highlightDateNameStyle={{ color: "white", fontSize: 15.0 }}
  //         highlightDateNumberStyle={{ color: "white", fontSize: 17.0 }}
  //         // datesBlacklist={datesBlacklistFunc}
  //         disabledDateOpacity={0.6}
  //         disabledDateNameStyle={{ color: "gray", fontSize: 15.0 }}
  //         disabledDateNumberStyle={{ color: "gray", fontSize: 17.0 }}
  //         useIsoWeekday={false}
  //         scrollable={true}
  //         upperCaseDays={false}
  //         styleWeekend={true}
  //       />
  //     </View>
  //   );
  // }

  // function dateDetails() {
  //   return (
  //     <View
  //       style={{
  //         height: 150,
  //         paddingTop: Sizes.fixPadding * 2.0,
  //         paddingBottom: Sizes.fixPadding * 2.0,
  //         paddingHorizontal: Sizes.fixPadding * 2.0,
  //       }}
  //     >
  //       <Text>{state.dateSelected && state.dateSelected.toString()}</Text>
  //     </View>
  //   );
  // }

  function header() {
    return (
      <View style={styles.headerStyle}>
        <View style={styles.headerContentStyle}>
          <Text style={{ ...Fonts.primaryColor18Bold }}>
            Hey, {user?.displayName}!
          </Text>
          <View style={{ flexDirection: "row" }}>
            {/* <MaterialIcons
              name="search"
              size={24}
              color={Colors.primaryColor}
              onPress={() => navigation.navigate("Search")}
            /> */}
            {/* <MaterialIcons
              name="settings"
              size={24}
              color={Colors.primaryColor}
              style={{ marginLeft: Sizes.fixPadding + 5.0 }}
              onPress={() => navigation.navigate("Settings")}
            /> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={{ marginLeft: Sizes.fixPadding - 5 }}
            >
              {user?.photoURL ? (
                <Avatar.Image size={24} source={{ uri: user?.photoURL }} />
              ) : (
                <Avatar.Icon
                  size={24}
                  icon="account"
                  backgroundColor={Colors.primaryColor}
                />
              )}
              {/* <Image
                source={
                  user?.photoURL
                    ? { uri: user?.photoURL }
                    : require("../../assets/images/user/demo-profile.png")
                }
                style={{
                  height: 24.0,
                  width: 24.0,
                  borderRadius: 40.0,
                  borderColor: Colors.primaryColor,
                  borderWidth: 0.3,
                  marginLeft: Sizes.fixPadding + 5.0,
                }}
                resizeMode="cover"
              /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <StatusBar
            translucent={false}
            backgroundColor={Colors.whiteColor}
            barStyle="dark-content"
          />
          {header()}
          {/* {handleNotifications()} */}
          {user?.type === "Agent" && addCreateContractButton()}
          {title({ title: "Overview" })}
          {user?.type === "Agent" && handleOverview()}
          {user?.type === "Landlord" && handleLandLordOverview()}
          {user?.type === "Tenant" && handleTenantOverview()}
          {/* {sendemail()} */}
          {/* <FlatList
        ListHeaderComponent={
          <>
            {handleNotifications()}
            {addCreateContractButton()}
            {title({ title: "Overview" })}
            {handleOverview()}
            {title({ title: "Today's Bookings" })}
            {calander()}
            {dateDetails()}
            {title({ title: "Nearby Properties" })}
            {nearbyProperties()}
            {title({ title: "Featured Properties" })}
          </>
        }
        data={data}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
        showsVerticalScrollIndicator={false}
      /> */}

          <Snackbar
            style={styles.snackBarStyle}
            visible={state.showSnackBar}
            onDismiss={() => setState({ ...state, showSnackBar: false })}
          >
            {state.isInWishList
              ? "Removed from shortlist"
              : "Added to shortlist"}
          </Snackbar>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 60.0,
    // elevation: 5.0,
    backgroundColor: Colors.whiteColor,
    marginTop: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    justifyContent: "center",
  },
  headerContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyAndRentButtonContainerStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  buyAndRentButtonStyle: {
    flex: 0.47,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding,
  },
  addToFavouriteContainerStyle: {
    width: 30.0,
    height: 30.0,
    borderRadius: 15.0,
    position: "absolute",
    right: 10.0,
    top: 10.0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  nearByPropertyImageStyle: {
    width: 160.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding + 5.0,
    borderTopRightRadius: Sizes.fixPadding + 5.0,
  },
  nearByPropertContentStyle: {
    backgroundColor: Colors.whiteColor,
    // elevation: 4.0,
    width: 160.0,
    height: 203.0,
    borderRadius: Sizes.fixPadding + 5.0,
    marginRight: Sizes.fixPadding * 2.0,
  },

  homeScreenNotificationStyle: {
    backgroundColor: "#eef3fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
  },

  homeScreenOverviewStyle: {
    backgroundColor: "#eef3fa",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding - 3.0,
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
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
    borderWidth: 1.0,
    alignItems: "center",
    height: 30.0,
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    borderColor: "rgba(128, 128, 128, 0.5)",
  },
  snackBarStyle: {
    position: "absolute",
    bottom: 50.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: "#333333",
  },
});

HomeScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default HomeScreen;
