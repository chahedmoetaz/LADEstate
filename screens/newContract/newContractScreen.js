import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { TransitionPresets } from "react-navigation-stack";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const contractList = [
  // {
  //   id: "1",
  //   contractImage: require("../../assets/images/contract/contract.jpeg"),
  //   contractName: "Agent to Agent Form",
  // },
  {
    id: "1",
    contractImage: require("../../assets/images/contract/ejari.png"),
    contractName: "Tenancy Contract",
  },
  {
    id: "2",
    contractImage: require("../../assets/images/contract/contract.jpeg"),
    contractName: "MOU",
  },
  // {
  //   id: "4",
  //   contractImage: require("../../assets/images/contract/contract.jpeg"),
  //   contractName: "Contract A",
  // },
  // {
  //   id: "5",
  //   contractImage: require("../../assets/images/contract/contract.jpeg"),
  //   contractName: "Contract B",
  // },
];

const { width } = Dimensions.get("screen");

function NewContractScreen({ navigation }) {
  const [item, setContract] = useContext(ContractContext);
  const { user } = useAuthentication();
  // state = {
  //   isBuy: true,
  //   nearbyProperyChangableList: nearByPropertyList,
  //   featuredPropertyChangableList: featuredPropertyList,
  //   showSnackBar: false,
  //   isInWishList: false,
  // };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        setContract({
          contractName: item.contractName,
          agentEmail: user?.email,
          id: item.id,
        });

        navigation.navigate("AddNewProperty"),
          { contractName: item.contractName };
      }}
      style={styles.optionCard}
    >
      <Image
        source={item.contractImage}
        resizeMode="cover"
        style={styles.optionCardImage}
      />

      <Text style={{ marginTop: 10, fontSize: 18 }}>{item.contractName}</Text>
    </TouchableOpacity>
  );

  function title({ title }) {
    return (
      <Text
        style={{
          ...Fonts.blackColor18SemiBold,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding + 5.0,
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
          Create Contract
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      {header()}

      {title({ title: "Choose Contract Type" })}
      {/* {this.handleContractCreate()} */}
      <View style={styles.optionListContainer}>
        <FlatGrid
          data={contractList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  optionListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionCard: {
    height: 210,
    // width: width/2  - 50,
    // flex: 0.47,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    borderRadius: 20,
    paddingTop: 10,
    marginTop: 10,
    marginRight:10,
    paddingHorizontal: 10,
  },
  optionCardImage: {
    height: 140,
    borderRadius: 10,
    width: "100%",
  },
  // gridView: {
  //   flex: 1,
  // },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: "#000",
    fontWeight: "300",
  },
  itemCode: {
    fontWeight: "300",
    fontSize: 9,
    flexWrap: "wrap",
    color: "#000",
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
    // elevation: 4.0,
    paddingVertical: Sizes.fixPadding - 3.0,
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
  },

  homeScreenOverviewStyle: {
    backgroundColor: "#eef3fa",
    // elevation: 4.0,
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
    width: "100%",
    borderColor: Colors.blackColor,
    borderStyle: "solid",
    borderWidth: 1,

    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  featuredPropertyImageStyle: {
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    width: "100%",
    height: 75.0,
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

NewContractScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default NewContractScreen;
