import { MaterialIcons } from "@expo/vector-icons";
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from "accordion-collapse-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { SharedElement } from "react-navigation-shared-element";
import GoogleMap from "../../component/googleMapScreen";
import CollapsingToolbar from "../../component/sliverAppBarScreen";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const nearestPlacesList = [
  {
    id: "1",
    place: "RailwayStation",
    isExpandable: false,
    more: [
      {
        id: "1",
        name: "Santa Cruise Railway Station",
        time: "8 min | 2.5 km",
      },
      {
        id: "2",
        name: "Manhattan Railway Station",
        time: "14 min | 4.0 km",
      },
    ],
  },
  {
    id: "2",
    place: "Airport",
    isExpandable: false,
    more: [
      {
        id: "1",
        name: "LaGuardia Airport",
        time: "8 min | 2.5 km",
      },
    ],
  },
  {
    id: "3",
    place: "Hospitals",
    isExpandable: false,
    more: [
      {
        id: "1",
        name: "Presbyterian Hospital",
        time: "8 min | 2.5 km",
      },
      {
        id: "2",
        name: "Lenox Hill Hospital",
        time: "14 min | 4.0 km",
      },
      {
        id: "3",
        name: "Mount Sinai Hospital",
        time: "20 min | 6.0 km",
      },
    ],
  },
  {
    id: "4",
    place: "Banks",
    isExpandable: false,
    more: [
      {
        id: "1",
        name: "Kotak Mahindra Bank",
        time: "5 min | 1.5 km",
      },
    ],
  },
];

const propertyPhotosList = [
  {
    id: "1",
    photo: require("../../assets/images/bedroom-1.jpg"),
  },
  {
    id: "2",
    photo: require("../../assets/images/bedroom-2.jpg"),
  },
  {
    id: "3",
    photo: require("../../assets/images/kitchen.jpg"),
  },
  {
    id: "4",
    photo: require("../../assets/images/bathroom-1.png"),
  },
  {
    id: "5",
    photo: require("../../assets/images/bathroom-2.jpg"),
  },
  {
    id: "6",
    photo: require("../../assets/images/parking.jpg"),
  },
];

const projectAminitiesList = [
  {
    id: "1",
    aminities: "Garden",
  },
  {
    id: "2",
    aminities: "Jogging Track",
  },
  {
    id: "3",
    aminities: "Power Backup",
  },
  {
    id: "4",
    aminities: "Complete RCC Structure",
  },
  {
    id: "5",
    aminities: "Design Door Frames",
  },
  {
    id: "6",
    aminities: "PVC Concealed wiring",
  },
];

function PropertyScreen({ route, navigation }) {
  const {
    propertyImage,
    propertyName,
    propertyAddress,
    propertyAmount,
    id,
    propertyDescription,
    propertyBedrooms,
    propertyKitchens,
    propertySize,
    propertyBathrooms,
    propertyAminities,
    propertyParkingSpaces,
    propertyNearestPlaces,
  } = route.params;
  const [state, setState] = useState({
    expanded: false,
    nearestPlacesChangableList: propertyNearestPlaces,
    showSnackBar: false,
    isInWishList: false,
  });

  const handleBackButton = () => {
    navigation.pop();
    return true;
  };

  function contactOwnerInfo() {
    return (
      <View style={styles.ownerInfoContentStyle}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/user/user_7.jpg")}
              style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
            />
            <View style={{ marginLeft: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16Bold }}>John Smith</Text>
              <Text style={{ ...Fonts.grayColor14Medium }}>Owner</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate("Message", { name: "John Smith" })
            }
            style={styles.ownerContactContentStyle}
          >
            <Text style={{ ...Fonts.whiteColor14SemiBold }}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleNearestPlacesUpdate({ id, isExpanded }) {
    const newList = state.nearestPlacesChangableList.map((property) => {
      if (property.id === id) {
        const updatedItem = { ...property, isExpandable: isExpanded };
        return updatedItem;
      }
      return property;
    });
    setState({ ...state, nearestPlacesChangableList: newList });
  }

  function nearestPlaces() {
    return (
      <View>
        {state.nearestPlacesChangableList.map((item, index) => (
          <View
            key={index}
            style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
          >
            <Collapse
              onToggle={(isExpanded) =>
                handleNearestPlacesUpdate({ id: index, isExpanded })
              }
            >
              <CollapseHeader>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: Sizes.fixPadding - 8.0,
                  }}
                >
                  <Text style={{ ...Fonts.blackColor14Bold }}>
                    {item.place}({item.more?.length})
                  </Text>
                  <MaterialIcons
                    name={
                      item?.isExpandable
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={Colors.primaryColor}
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <View style={{ marginVertical: Sizes.fixPadding - 5.0 }}>
                  {item?.more.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: Sizes.fixPadding - 7.0,
                      }}
                    >
                      <Text style={{ ...Fonts.grayColor12Medium }}>
                        {item.name}
                      </Text>
                      <Text style={{ ...Fonts.grayColor12Medium }}>
                        {item.time}
                      </Text>
                    </View>
                  ))}
                </View>
              </CollapseBody>
            </Collapse>
          </View>
        ))}
      </View>
    );
  }

  function aminities() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding - 8.0,
          paddingBottom: Sizes.fixPadding - 5.0,
        }}
      >
        {propertyAminities.map((item, index) => (
          <View key={index}>
            <View style={styles.aminitiesContentStyle}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.primaryColor}
              />
              <Text
                style={{
                  ...Fonts.blackColor14Regular,
                  marginLeft: 2.0,
                  marginTop: 1.5,
                }}
              >
                {item}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function mapInfo() {
    return (
      <View style={styles.mapStyle}>
        <GoogleMap
          latitude={37.33233141}
          longitude={-122.0312186}
          height={150}
          pinColor={Colors.primaryColor}
        />
      </View>
    );
  }

  function photos() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ overflow: "hidden" }}
        onPress={() =>
          navigation.navigate("ImageFullView", {
            propertyImage: item.photo,
            id: item.id,
          })
        }
      >
        <SharedElement id={item.id}>
          <Image
            source={item.photo}
            style={styles.propertyPhotosStyle}
            resizeMode="cover"
          />
        </SharedElement>
      </TouchableOpacity>
    );
    return (
      <FlatList
        horizontal
        data={propertyPhotosList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: Sizes.fixPadding * 2.0,
          paddingTop: Sizes.fixPadding - 5.0,
        }}
      />
    );
  }

  function dummyText() {
    return (
      <Text
        style={{
          ...Fonts.blackColor12Regular,
          marginHorizontal: Sizes.fixPadding * 2.0,
          textAlign: "justify",
        }}
      >
        {propertyDescription}
      </Text>
    );
  }

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

  function propertyInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{ ...Fonts.blackColor18Bold, marginTop: Sizes.fixPadding }}
        >
          {propertyName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          <View>
            <Text style={{ ...Fonts.grayColor14Medium }}>
              {propertyAddress}
            </Text>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>
              {propertySize}
            </Text>
          </View>
          <View style={styles.propertyAmountContentStyle}>
            <Text style={{ ...Fonts.blackColor16SemiBold }}>
              {propertyAmount}$
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: Sizes.fixPadding,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor22Bold }}>
              {propertyBedrooms}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              Bedrooms
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor22Bold }}>
              {propertyBathrooms}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              Bathrooms
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor22Bold }}>
              {propertyKitchens}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              Kitchens
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ ...Fonts.blackColor22Bold }}>
              {propertyParkingSpaces}
            </Text>
            <Text
              style={{
                ...Fonts.blackColor14Regular,
                marginTop: Sizes.fixPadding - 20,
              }}
            >
              Parking
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CollapsingToolbar
        leftItem={
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.whiteColor}
            onPress={() => navigation.goBack()}
          />
        }
        rightItem={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              setState({
                showSnackBar: true,
                isInWishList: !state.isInWishList,
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={state.isInWishList ? "favorite" : "favorite-border"}
              size={24}
              color={Colors.whiteColor}
            />
            <MaterialIcons
              name="share"
              size={24}
              color={Colors.whiteColor}
              style={{ marginLeft: Sizes.fixPadding }}
            />
          </TouchableOpacity>
        }
        borderBottomRadius={20}
        toolbarColor={Colors.primaryColor}
        toolBarMinHeight={40}
        toolbarMaxHeight={358}
        src={{ uri: propertyImage }}
      >
        <View style={{ paddingBottom: Sizes.fixPadding * 8.0 }}>
          {propertyInfo()}
          {title({ title: "Description" })}
          {dummyText()}
          {title({ title: "Photos" })}
          {photos()}
          {title({ title: "Location" })}
          {mapInfo()}
          {title({ title: "Project Amenities" })}
          {aminities()}
          {nearestPlaces()}
        </View>
      </CollapsingToolbar>
      {contactOwnerInfo()}
      <Snackbar
        style={styles.snackBarStyle}
        visible={state.showSnackBar}
        onDismiss={() => setState({ showSnackBar: false })}
      >
        {state.isInWishList ? "Added to shortlist" : "Removed from shortlist"}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  propertyAmountContentStyle: {
    borderWidth: 1.0,
    alignItems: "center",
    height: 34.0,
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    borderColor: "rgba(128, 128, 128, 0.5)",
  },
  propertyPhotosStyle: {
    width: 120.0,
    height: 150.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 8.0,
  },
  mapStyle: {
    borderRadius: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding - 5.0,
    overflow: "hidden",
    // elevation: 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  aminitiesContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.fixPadding - 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  ownerInfoContentStyle: {
    position: "absolute",
    bottom: 0.0,
    height: 70.0,
    backgroundColor: Colors.whiteColor,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
    borderTopWidth: 1.0,
    // elevation: 2.0,
  },
  ownerContactContentStyle: {
    height: 31.0,
    width: 78.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
  },
  snackBarStyle: {
    position: "absolute",
    bottom: 60.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: "#333333",
  },
});

PropertyScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default PropertyScreen;
