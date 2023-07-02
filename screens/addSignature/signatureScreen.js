import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Signature from "react-native-signature-canvas";
import { useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
const { width, height } = Dimensions.get("screen");

const SignatureScreen = ({ route, navigation }) => {
  const { user: userAuth } = useAuthentication();
  const [item, setContract] = useContext(ContractContext);
  const { data, update } = useDocument(item?.id ? `contracts/${item?.id}` : undefined);
  console.log(item)
  const { data: user } = useDocument(
    userAuth ? `users/${userAuth.uid}` : undefined
  );

  const [signature, setSign] = useState(null);

  
  const handleOK = (signature) => {
   

    user.type === "Tenant" &&
      update(
        {
          TenantSignature: signature,
          TenantSignDate: new Date().toDateString(),
        }
      );

    user.type === "Landlord" &&
      update(
        {
          LandlordSignature: signature,
          LandlordSignDate: new Date().toDateString(),
        }
      );

    setSign(signature);

    user.type === "Tenant" && update({ TenantSigned: true }) && navigation.navigate("TenantContracts");
    user.type === "Landlord" && update({ LandlordSigned: true }) && navigation.navigate("LandlordContracts");
    showMessage({
      message: "The contract has been signed and parties have been notified",
      type: "success",
    })
  };

//   const handleSignSend = (signature) => {


//     user.type === "Tenant" &&
//       update(
//         {
//           TenantSignature: signature,
//           TenantSignDate: new Date().toDateString(),
//         }
//       );

//     user.type === "Landlord" &&
//       update(
//         {
//           LandlordSignature: signature,
//           LandlordSignDate: new Date().toDateString(),
//         }
//       );

//     setSign(signature);

//     user.type === "Tenant" && update({ TenantSigned: true }) && navigation.navigate("TenantContracts");
//     user.type === "Landlord" && update({ LandlordSigned: true }) && navigation.navigate("LandlordContracts");
//     showMessage({
//       message: "The contract has been signed",
//       type: "success",
//     })
//  };


  const handleEmpty = () => {
    console.log("Empty");
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: ${Colors.primaryColor};
      color: #FFF;
    }`;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
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
          Signature
        </Text>
      </View>
      {/* <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View> */}
      <View style={{ marginHorizontal: Sizes.fixPadding, marginBottom: Sizes.fixPadding*2 }}>
        <Text style={{ color: Colors.grayColor }}>
          Contract Type: {item.contractName}
        </Text>
        <Text style={{ color: Colors.grayColor }}>
          Address: {item.PropertyAddress} 
        </Text>
      </View>
      {/* <TouchableOpacity activeOpacity={0.9} style={styles.continueButtonStyle}>
        <Text style={{ ...Fonts.whiteColor18Medium }}>Review Contract</Text>
      </TouchableOpacity> */}
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText=""
        clearText="Clear"
        confirmText="Sign & Send"
        webStyle={style}
      />
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding,
        }}
      >
        <Checkbox />
        <Text
          style={{
            color: Colors.primaryColor,
          }}
        >
          I agree to Contract Terms & Conditions
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.continueButtonStyle}
        onPress={handleSignSend}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Sign & Send</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
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
  preview: {
    width: width,
    height: height / 3,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});

export default SignatureScreen;
