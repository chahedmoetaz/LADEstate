import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCollection } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";

function ContractScreen({ route, navigation }) {
  const { data, add, error } = useCollection(`properties`);
  const [state, setState] = useState({
    expanded: false,

    showSnackBar: false,
    isInWishList: false,
  });
  const [item, setContract] = useContext(ContractContext);

  function searchTextField() {
    return (
      <View style={styles.searchFieldStyle}>
        <MaterialIcons
          name="search"
          size={24}
          color={state.isSearch ? Colors.primaryColor : Colors.grayColor}
        />
        <TextInput
          placeholder="Search for properties"
          style={{
            flex: 1,
            ...Fonts.grayColor14Medium,
            marginLeft: Sizes.fixPadding,
            paddingTop: 2.0,
          }}
          selectionColor={Colors.primaryColor}
          onFocus={() => setState({ isSearch: true })}
          onBlur={() => setState({ isSearch: false })}
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
          New {item?.contractName}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.propertyContainer}
        onPress={() => {
          setContract({ ...item });
          navigation.navigate("ContractCreation");
        }}
      >
        <View style={styles.propertyDetails}>
          <Text>{item?.PropertyName}</Text>
          <Text>{item?.PropertyAddress}</Text>
        </View>

        <Image
          source={
            item.PropertyImage
              ? { uri: item.PropertyImage }
              : require("../../assets/images/house.png")
          }
          resizeMode="cover"
          style={styles.featuredPropertyImageStyle}
        />
      </TouchableOpacity>
    );
  };

  function dummyText() {
    return (
      <Text
        style={{
          ...Fonts.blackColor12Regular,
          marginHorizontal: Sizes.fixPadding * 2.0,
          textAlign: "justify",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies mi id
        faucibus odio lobortis vitae, ante malesuada mauris.
      </Text>
    );
  }

  function newProperty() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("AddNewProperty", {
            contractName: item?.contractName,
          })
        }
        style={styles.saveButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Create New Property</Text>
      </TouchableOpacity>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {header()}
              {title({ title: "Description" })}
              {dummyText()}
              {newProperty()}
              {title({ title: "Choose Existing Property" })}
              {searchTextField()}
            </>
          }
          data={data}
          renderItem={renderItem}
        />
      </View>
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
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
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
  searchFieldStyle: {
    flexDirection: "row",
    alignItems: "center",
    height: 37.0,
    backgroundColor: "rgba(128, 128, 128, 0.25)",
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
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
  headerContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 10.0,
  },
});

ContractScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default ContractScreen;
