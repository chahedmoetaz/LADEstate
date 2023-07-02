import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DocumentScannerView from "../../component/DcoumentScanner";
import { Colors, Fonts, Sizes } from "../../constant/styles";

function DocuScreen({ navigation, user }) {
  function docscan() {
    return (
      <DocumentScannerView
        onPictureProcessed={(event) => {}}
        onPictureTaken={(event) => {}}
        onLayout={(event) => {}}
        onSkip={() => {}}
        onCancel={() => navigation.goBack()}
        hideSkip={true}
      />
    );
  }

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

  return <View style={{ flex: 1 }}>{docscan()}</View>;
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 60.0,
    // elevation: 5.0,
    backgroundColor: Colors.whiteColor,
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

  DocuScreenNotificationStyle: {
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

  DocuScreenOverviewStyle: {
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

DocuScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default DocuScreen;
