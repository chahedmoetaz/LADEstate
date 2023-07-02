import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import WebView from "react-native-webview";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection, useDocument } from "react-query-firestore";
import { format } from "timeago.js";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
const { width } = Dimensions.get("screen");

function TenantContracts({ route, navigation }) {
  const { user } = useAuthentication();
  const { data: contractData, error } = useCollection(
    user?.email ? `contracts` : undefined,
    {},
    {
      where: ["tenantEmail", "==", user?.email],
       orderBy: ["contractDate", "desc"],
    }
  );
  const [selectedItem, setSelectedItem] = useState();
  const [contract, setContract] = useContext(ContractContext);
  const [searchString, setSearchString] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [filter, setFilter] = useState("All");

  const renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor='#f0f5fc'
        style={styles.propertyContainer}
        onPress={() => {
          delete item.__snapshot;
          setContract({ ...item });
          navigation.navigate("ContractCreatedView");
        }}
      >
        <>
        <View style={styles.propertyDetails}>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Created: {item?.contractDate ? format(item.contractDate) : ""}
          </Text>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Contract Type: {item.contractName}
          </Text>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Property: {item.PropertyName}
          </Text>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Address: {item.PropertyAddress}
          </Text>
          {/* <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Annual Rent: {item.annualRent} AED
          </Text>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Agent Commision: {item.agentCommision} AED
          </Text> */}
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Date From: {item?.dateFrom ? item.dateFrom : ""}
          </Text>
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 8 }}>
            Date To: {item?.dateTo ? item.dateTo : ""}
          </Text>

          {item.TenantSignature && item.LandlordSignature ? (
            <View
              style={{
                borderRadius: 5,
                backgroundColor: "#42ba96",
                paddingHorizontal: Sizes.fixPadding,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.whiteColor,
                  marginHorizontal: Sizes.fixPadding - 15,
                }}
              >
                Signed
              </Text>
            </View>
          ) : item.TenantSignature ? (
            <View
              style={{
                borderRadius: 5,
                backgroundColor: Colors.secondaryColor,
                paddingHorizontal: Sizes.fixPadding,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.whiteColor,

                  marginHorizontal: Sizes.fixPadding - 15,
                }}
              >
                Awaiting Landlord Signature
              </Text>
            </View>
          ) : item.LandlordSignature ? (
            <View
              style={{
                borderRadius: 5,
                backgroundColor: Colors.secondaryColor,
                paddingHorizontal: Sizes.fixPadding,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.whiteColor,

                  marginHorizontal: Sizes.fixPadding - 15,
                }}
              >
                Awaiting Tenant Signature
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 5,
                backgroundColor: Colors.secondaryColor,
                paddingHorizontal: Sizes.fixPadding,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.whiteColor,

                  marginHorizontal: Sizes.fixPadding - 15,
                }}
              >
                Unsigned Both Parties
              </Text>
            </View>
          )}
        </View>
        <Image
          source={
            item.PropertyImage
              ? { uri: item.PropertyImage }
              : require("../../assets/images/contract/ejari.png")
          }
          resizeMode="cover"
          style={styles.featuredPropertyImageStyle}
        />
        </>
      </TouchableHighlight>
    );
  };

  function pdfView() {
   
    return (
      <ScrollView
        style={{ width: width }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <WebView
          // style={styles.pdf}
          javaScriptEnabled={true}
          style={{ width: width }}
          useWebKit={true}
          originWhitelist={["*"]}
          scrollEnabled={true}
          mediaPlaybackRequiresUserAction={true}
          source={{
            html: `
            <html>
            <object data="${state}" type="application/pdf">
                <embed 
                    scrollbar="1" 
                    src="${state}" 
                    type="application/pdf" 
                   
                />
            </object>
            </html>
            `,
          }}
        />
      </ScrollView>
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

  function searchTextField() {
    return (
      <View style={styles.searchFieldStyle}>
        <MaterialIcons
          name="search"
          size={24}
          color={isSearch ? Colors.primaryColor : Colors.grayColor}
        />
        <TextInput
          placeholder="Contracts, by property name, tenant.."
          style={{
            flex: 1,
            ...Fonts.grayColor14Medium,
            marginLeft: Sizes.fixPadding,
            paddingTop: 2.0,
          }}
          selectionColor={Colors.primaryColor}
          value={searchString}
          onChangeText={(e) => setSearchString(e)}
          onFocus={() => setIsSearch(true)}
          onBlur={() => setIsSearch(false)}
        />
      </View>
    );
  }

  const handleFilter = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("TenantContracts")}
        style={styles.homeScreenOverviewStyle}
      >
        <TouchableOpacity
          onPress={() => setFilter("All")}
          style={{
            backgroundColor:
              filter === "All" ? Colors.primaryColor : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: width / 3.5,
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              filter === "All"
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
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("Signed")}
          style={{
            backgroundColor:
              filter === "Signed" ? Colors.primaryColor : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: width / 3.5,
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              filter === "Signed"
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
            Signed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("Unsigned")}
          style={{
            backgroundColor:
              filter === "Unsigned" ? Colors.primaryColor : Colors.whiteColor,
            paddingHorizontal: Sizes.fixPadding * 1,
            width: width / 3.5,
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={
              filter === "Unsigned"
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
            Unsigned
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
          Outstanding Contracts
        </Text>
      </View>
    );
  }

  const { data: selectedContract, deleteDocument } = useDocument(
    selectedItem ? `contracts/${selectedItem}` : undefined
  );

  const hiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={async () => {
            // await setSelectedItem(data.item?.id);
            deleteDocument();
          }}
        >
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      {header()}
      {handleFilter()}
      {searchTextField()}
      <SwipeListView
        data={
          contractData
            ? contractData
                .filter((x) =>
                  filter === "Signed"
                    ? x.TenantSignature && x.LandlordSignature
                    : filter === "Unsigned"
                    ? !x.TenantSignature || !x.LandlordSignature
                    : x
                )
                .filter(
                  (item) =>
                    item.PropertyName?.toUpperCase().includes(
                      searchString?.toUpperCase()
                    ) ||
                    item.tenantName
                      ?.toUpperCase()
                      .includes(searchString?.toUpperCase()) ||
                    item.landlordName
                      ?.toUpperCase()
                      .includes(searchString?.toUpperCase())
                )
            : []
        }
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
        showsVerticalScrollIndicator={false}
        renderHiddenItem={(data, rowMap) => hiddenItem(data, rowMap)}
        onRowDidOpen={(data) => setSelectedItem(data)}
        // leftOpenValue={75}
        rightOpenValue={-75}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding - 3,
    borderRadius: Sizes.fixPadding,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
  rowBack: {
    alignItems: "center",

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
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
  propertyDetails: { color: Colors.blackColor },
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
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
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

TenantContracts.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default TenantContracts;
