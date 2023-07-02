import { MaterialIcons } from "@expo/vector-icons";
// import { StripeProvider } from "@stripe/stripe-react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
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
import Dialog from "react-native-dialog";
import { ActivityIndicator } from "react-native-paper";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection, useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import Purchases, { PurchasesOffering } from 'react-native-purchases';


const { width } = Dimensions.get("screen");

function MembershipScreen({ navigation }) {
  const [state, setState] = useState();
  const [cancel, setCancel] = useState(false);

  const { add } = useCollection("mail");
  const functions = getFunctions();
  const { user: userAuth } = useAuthentication();
  const { data: user, update } = useDocument(
    userAuth ? `users/${userAuth.uid}` : undefined
  );
  const customerDetails = () => {
    return (
      !state?.premium ? <ActivityIndicator animating={true} color={Colors.primaryColor} ></ActivityIndicator> : <View style={{ padding: Sizes.fixPadding * 2 }}>
        <Text>
          PRO membership
        
        </Text>
        <Text>
          Start Date:{" "}
          {state?.from
            ? state?.from : null}
        </Text>

        <Text>
          Expiry Date:{" "}
          {state?.to
            ? state?.to : null}
        </Text>

        <Text>
          Last Renewal:{" "}
          {state?.lastRenewal
            ? state?.lastRenewal : null}
        </Text>

        {/* <Text>Subscription Id: {state?.id}</Text>
        <Text>
          Current Start Date:{" "}
          {state?.current_period_start
            ? new Date(state?.current_period_start * 1000).toDateString()
            : null}
        </Text>
        <Text>
          Next Billing Cycle:{" "}
          {state?.current_period_end
            ? new Date(state?.current_period_end * 1000).toDateString()
            : null}
        </Text>
        <Text>
          Plan:{" "}
          {state?.plan?.amount / 100 +
            " USD"}
           
        </Text> */}
        <Text>Status: Active</Text>
      </View>
    );
  };

  const getCustomerInfo = async () => {
    //await Purchases.configure({ apiKey: "appl_GPfOYKXXwHVyfWWGSPMcmFSzgbb" });
    const customerInfo = await Purchases.getCustomerInfo();
    console.log(customerInfo)
    if (customerInfo) {

      const Pro = customerInfo?.entitlements?.active?.Pro
      Pro && setState({ ...state, premium: true, from: new Date(Pro?.originalPurchaseDate).toDateString(), to:  new Date(Pro?.expirationDate).toDateString(), lastRenewal: new Date(Pro.latestPurchaseDate).toDateString()});
    }
  

  }

  useEffect(() => {

        
            

getCustomerInfo()

  }, []);

  function cancelButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setCancel(true)}
        style={styles.cancelButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Cancel Subscription</Text>
      </TouchableOpacity>
    );
  }

  function cancelDialog() {
    return (
      <Dialog.Container
        visible={cancel}
        contentStyle={styles.dialogContainerStyle}
      >
        <View
          style={{
            backgroundColor: Colors.transparent,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Fonts.blackColor16Bold,
              paddingBottom: Sizes.fixPadding - 5.0,
            }}
          >
            You sure want to cancel subscription?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: Sizes.fixPadding,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setCancel(false)}
              style={styles.cancelxButtonStyle}
            >
              <Text style={{ ...Fonts.blackColor14Medium }}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={
                async () => {
                  const customer = await httpsCallable(
                    functions,
                    "cancelSubscription"
                  )({
                    subscriptionId: state?.id,
                  });

                  
                  add({
                    to: user?.email,

                    message: {
                      subject: `Your Subscription has been cancelled`,

                      html: `This is a confirmation that subscription ${state.id} has been cancelled`,
                    },
                  });

                  setCancel(false);
                }
                // setState({ ...state, isLogout: false });
                // navigation.navigate("Login");
              }
              style={styles.logOutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor14Medium }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
        >
          {/* {nameTextField()}
          {emailTextField()} */}
          {/* {passwordTextField()}
          {passwordTextField()} */}
          {/* <StripeProvider publishableKey="pk_test_51HTMJBIZoCLf5Xk2eKBCbsxo391SmBq86gdxfxzUFYCpxvR5fp8InKriurQFpV11p5y7M0kUy7awnWbtaC8gE4d600xa8m5IyV"> */}
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
              {/* <ImageBackground
        style={{ flex: 1 }}
        source={require("../../assets/images/bg.jpg")}
        resizeMode="cover"
      > */}
              <View
                // start={{ x: 0, y: 1 }}
                // end={{ x: 0, y: 0 }}
                // colors={["black", "rgba(0,0.10,0,0.77)", "rgba(0,0,0,0.1)"]}
                style={{
                  flex: 1,
                  paddingHorizontal: Sizes.fixPadding * 2.0,
                  backgroundColor: Colors.whiteColor,
                }}
              >
                {customerDetails()}
                {/* {cancelButton()} */}
              </View>

              {/* </ImageBackground> */}
            </SafeAreaView>
          {/* </StripeProvider> */}
        </ScrollView>
      </View>
      {/* {cancelDialog()} */}
    </SafeAreaView>
  );

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
          Membership Details
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 40,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
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
  cancelButtonStyle: {
    backgroundColor: Colors.red,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  cancelxButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.blackColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding - 7.0,
  },
  logOutButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.red,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 7.0,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
});

MembershipScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default MembershipScreen;
