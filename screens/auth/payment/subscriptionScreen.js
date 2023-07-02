import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useState, useEffect } from "react";
import { Linking } from "react-native";
import Dialog from "react-native-dialog";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { useAuthentication } from "../../../utils/hooks/useAuthentication";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import Purchases, { PurchasesOffering } from 'react-native-purchases';


const { width } = Dimensions.get("screen");
const SubscriptionScreen = ({ navigation }) => {
  const functions = getFunctions();
  const auth = getAuth();
  const { user: userAuth } = useAuthentication();
  const { data: user, update } = useDocument(
    userAuth ? `users/${userAuth.uid}` : undefined
  );
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    email: "",
    phoneNumber: "",
    monthly: true,
    quarterly: false,
    yearly: false
  });

  //console.log("user", userAuth?.uid)

 //const items = Platform.select({ios: ["lad_1999_1m","lad_4999_3m","lad_17999_1y"], android: [""]})


  // const handlePurchases = async() => {

  //   console.log("running")
  //   await Purchases.configure({ apiKey: "appl_GPfOYKXXwHVyfWWGSPMcmFSzgbb" });
  //   //const customerInfo = await Purchases.getCustomerInfo();
  //   //console.log(customerInfo)
      

  //     // try {
  //     //   const offerings = await Purchases.getOfferings();
  //     //   console.log(offerings)
  //     //   if (offerings.current !== null) {  
  //     //       console.log("hello", offerings.current)
  //     //   }
  //     // } catch (e) {
  //     //  console.log(e)
  //     // }
  // } 
  

  // useEffect(() => {
    
  //   handlePurchases()

  // },[])

  // useEffect( () => {
  //   IAP.initConnection().catch(() => console.log("error")).then(()=> {console.log("success"); IAP.getSubscriptions(items)})
  
  //   const PurchaseUpdatedListener = IAP.purchaseUpdatedListener( purchase => {try {

  //     console.log("YOOOOO")
  //     if (purchase) {
  //       const receipt = purchase?.transactionReceipt ? purchase?.transactionReceipt : purchase?.originalJson
    
  //       if (receipt) {
  //         const ackResult = IAP.finishTransaction(purchase, false
  //           );


  //         console.log("OOOO", receipt)
  //         update({"appleReceipt": receipt})
  //         showMessage({message: "ackResult"+ JSON.stringify(ackResult), type: "success" })
  //       }
  //     }
    
     
  //   } catch (error) {
  //     showMessage({message: "Purchase Error: ", type: "danger" })
  //     console.log(error)
  //   }})
    
  //   const PurchaseErrorListener = IAP.purchaseErrorListener(error => {console.log(error); setLoading(false);})
    
  //   return () => {
  //     PurchaseUpdatedListener.remove()
  //    PurchaseErrorListener.remove()
  //   }


  // }, []);






  return (
    //<StripeProvider publishableKey="pk_test_51HTMJBIZoCLf5Xk2eKBCbsxo391SmBq86gdxfxzUFYCpxvR5fp8InKriurQFpV11p5y7M0kUy7awnWbtaC8gE4d600xa8m5IyV">
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {welcomeInfo()}
            {handleSubscriptionChoice()}
            {whyLAD()}
            {subscribeButton()}
            {/* {logOutInfo()} */}
          </ScrollView>
        </View>
        {/* </ImageBackground> */}
        {logOutDialog()}
      </SafeAreaView>
   // </StripeProvider>
  );

  function logOutDialog() {
    return (
      <Dialog.Container
        visible={state.isLogout}
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
            You sure want to logout?
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
              onPress={() => setState({ ...state, isLogout: false })}
              style={styles.cancelButtonStyle}
            >
              <Text style={{ ...Fonts.blackColor12Regular }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                signOut(auth);
                // setState({ ...state, isLogout: false });
                // navigation.navigate("Login");
              }}
              style={styles.logOutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor14Medium }}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function logOutInfo() {
    return (
      <TouchableOpacity
        onPress={() => setState({ ...state, isLogout: true })}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialCommunityIcons
          name="login-variant"
          size={24}
          color="#FF0000"
        />
        <Text
          style={{ ...Fonts.redColor14Medium, marginLeft: Sizes.fixPadding }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    );
  }

  function subscribeButton() {
    return (
      <>
      {/* <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        style={styles.signUpButtonStyle}
        onPress={async () => {
          setLoading(true)
          let customerId;
          if (!user.stripeCustomerId) {
            const customer = await httpsCallable(
              functions,
              "createCustomer"
            )({
              customerEmail: user.email,
            });

            update({ stripeCustomerId: customer.data.id });
            customerId = customer.data.id;
          } else {
            customerId = user.stripeCustomerId;
          }

          const data = await httpsCallable(
            functions,
            "createPaymentIntent"
          )({
            price: state.monthly
              ? "price_1LLo0DIZoCLf5Xk2AQLc7f0A"
              : state?.quarterly ? "price_1Ldc2bIZoCLf5Xk2O0byL2af" : "price_1Ldc8BIZoCLf5Xk2eEEBbnwQ",
            quantity: 1,
            customerId: customerId,
          });

          const initSheet = await initPaymentSheet({
            customerId: customerId,
            paymentIntentClientSecret: data.data.paymentIntent,
            customerEphemeralKeySecret: data.data.ephemeralKey,

            // applePay: true,
            // merchantCountryCode: "AE",
            // googlePay: true,
            merchantDisplayName: "LADestate",
          });
          if (initSheet.error) {
            setLoading(false)
            showMessage({
              message: initSheet.error,
              type: "danger",
            })
            
            return;
          }
          const presentSheet = await presentPaymentSheet({
            paymentIntentClientSecret: data.data.paymentIntent,
            customerEphemeralKeySecret: data.data.ephemeralKey,
            merchantDisplayName: "LADestate",
          });

          //   const confPayment = await handleNextAction({
          //     paymentIntentClientSecret: data.data.paymentIntent,
          //   });

          if (presentSheet.error) {
            setLoading(false)
            showMessage({
              message: "Payment Request Cancelled",
              type: "info",
            })
            return;
          } else {
            showMessage({
              message: "Payment Successful, account activated!",
              type: "success",
            })
            update({
              step: "subscribed",
              subscriptionPeriod: state.monthly ? "Monthly" : state.quarterly? "Quarterly" : "Yearly",
              subscriptionInitDate: new Date().toDateString(),
            });
          }

     
        }}
      >
        <Text style={{ color: Colors.whiteColor }}>{loading ? "Loading...." : "Pay and unlock now"}</Text>
      </TouchableOpacity> */}




<TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        style={styles.signUpButtonStyle}
        onPress={async () => {
          setLoading(true)

          try {
         
            const purchaseMade = await Purchases.purchaseProduct(state.monthly
              ? "lad_1999_1m"
              : state?.quarterly ? "lad_4999_3m" : "lad_17999_1y", null, Purchases.PURCHASE_TYPE.INAPP);
            
          
            if ( purchaseMade?.customerInfo?.entitlements?.active?.Pro?.isActive) {
             
              showMessage({
                message: "Payment Successful, account activated!",
                type: "success",
              })


              update({
                step: "subscribed",
                subscriptionPeriod: state.monthly ? "Monthly" : state.quarterly? "Quarterly" : "Yearly",
                subscriptionInitDate: new Date(purchaseMade.customerInfo.entitlements.active.Pro.originalPurchaseDate).toDateString(),
                subscriptionExpDate: new Date(purchaseMade.customerInfo.entitlements.active.Pro.expirationDate).toDateString(),
              }).catch(() =>  {setLoading(false);  showMessage({
                message: "Error occured, try restore purchase or contact support.",
                type: "danger",
              })})
                        
           
            }

            setLoading(false)
          } catch (e){
            setLoading(false)
            if (!e.userCancelled) {
              alert(e);
              
            }
          }

          // IAP.getSubscriptions(items).catch((error) => console.log(error))
          // IAP.requestSubscription(state.monthly
          //   ? "lad_1999_1m"
          //   : state?.quarterly ? "lad_4999_3m" : "lad_17999_1y").then(() => {


     
            
            // /.catch((err) => {
            //   setLoading(false)
            // showMessage({
            //   message: err,
            //   type: "danger",
            // })
            // }).then(() => {
            //   showMessage({
            //     message: "Payment Successful, account activated!",
            //     type: "success",
            //   })
            //   update({
            //     step: "subscribed",
            //     subscriptionPeriod: state.monthly ? "Monthly" : state.quarterly? "Quarterly" : "Yearly",
            //     subscriptionInitDate: new Date().toDateString(),
            //   });

            // })


          }
        }
      >
        <Text style={{ color: Colors.whiteColor }}>{loading ? "Loading...." : "Subscribe and unlock now"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        style={styles.signUpButtonStyle}
        onPress={async () => {
         
          try {
            const restore = await Purchases.restorePurchases();
            
            
           console.log(restore?.entitlements?.active?.Pro)

           if (restore?.entitlements?.active?.Pro) {
            update({
              step: "subscribed",
               })  
               showMessage({message: "Your subscription has been reactivated", type: "success"})
           }
           else {
            showMessage({message: "You do not have any active subscriptions", type: "warning"})
           }
            
            
          } catch (e){
            
            console.log(e)
          }
        }}><Text style={{ color: Colors.whiteColor }}>Restore Previous Purchases</Text>
          </TouchableOpacity>
        <View style={{flexDirection: "row", marginHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding, alignItems: "center", justifyContent:"space-between"}}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.ladestate.com/privacy-and-policy')}>
  <Text style={{color: Colors.primaryColor, marginRight: Sizes.fixPadding /2}}>
  Privacy Policy
  </Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
  <Text style={{color: Colors.primaryColor}}>
  Terms of Use
  </Text>
</TouchableOpacity>
<TouchableOpacity
        onPress={() => setState({ ...state, isLogout: true })}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialCommunityIcons
          name="login-variant"
          size={24}
          color="#FF0000"
        />
        <Text
          style={{ ...Fonts.redColor14Medium, marginLeft: Sizes.fixPadding }}
        >
          Logout
        </Text>
      </TouchableOpacity>
</View>

      </>
    );
  }

  function welcomeInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            ...Fonts.primaryColor18Bold,
          }}
        >
          LADestate Subscription
        </Text>

        {/* <Image
          source={require("../../assets/images/initAuth.png")}
          style={styles.imageStyle}
          resizeMode="cover"
        ></Image> */}
      </View>
    );
  }

  function stripePortal() {
    return <Button>PAY</Button>;
  }

  function whyLAD() {
    return (
      <View>
        <View style={styles.whyLADStyle}>
          <MaterialIcons name="check" size={16} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Usable dashboard to manage your property & contracts
          </Text>
        </View>
        <View style={styles.whyLADStyle}>
          <MaterialIcons name="check" size={16} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Create new contracts & share with other users
          </Text>
        </View>
        <View style={styles.whyLADStyle}>
          <MaterialIcons name="check" size={16} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Digitally sign contracts
          </Text>
        </View>
        <View style={styles.whyLADStyle}>
          <MaterialIcons name="check" size={16} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.blackColor14SemiBold,
              marginLeft: Sizes.fixPadding,
            }}
          >
            Full end to end encryption to ensure safety
          </Text>
        </View>
      </View>
    );
  }

  function handleSubscriptionChoice() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, monthly: true, quarterly: false, yearly: false })}
          style={{
            ...styles.homeScreenNotificationStyle,
            borderColor: Colors.primaryColor,
            borderWidth: state.monthly ? 2 : 0,
          }}
        >
          {/* <MaterialIcons
            name="notifications"
            size={24}
            color={Colors.primaryColor}
            style={{ marginLeft: Sizes.fixPadding + 5.0 }}
          /> */}
          <View>
            <Text
              style={{ ...Fonts.primaryColor18Bold, maxWidth: width / 2.0 }}
            >
              Monthly
            </Text>
            <Text>
              <Text style={{ color: Colors.primaryColor }}>$19.99</Text> per month
            </Text>
          </View>
          {/* <AntDesign name="right" size={24} color={Colors.primaryColor} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, monthly: false, quarterly: true, yearly: false })}
          style={{
            ...styles.homeScreenNotificationStyle,
            borderColor: Colors.primaryColor,
            borderWidth: state.quarterly ? 2 : 0,
          }}
        >
          {/* <MaterialIcons
            name="notifications"
            size={24}
            color={Colors.primaryColor}
            style={{ marginLeft: Sizes.fixPadding + 5.0 }}
          /> */}
          <View>
            <Text
              style={{ ...Fonts.primaryColor18Bold, maxWidth: width / 2.0 }}
            >
              Quarterly
            </Text>
            <Text>
              <Text style={{ color: Colors.primaryColor }}>$49.99</Text> per quarter
            </Text>
          </View>
          {/* <AntDesign name="right" size={24} color={Colors.primaryColor} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setState({ ...state, quarterly: false, monthly: false, yearly: true })}
          style={{
            ...styles.homeScreenNotificationStyle,
            borderColor: Colors.primaryColor,
            borderWidth: state.yearly ? 2 : 0,
          }}
        >
          <View>
            <Text
              style={{ ...Fonts.primaryColor18Bold, maxWidth: width / 2.0 }}
            >
              Yearly
            </Text>
            <Text>
              <Text style={{ color: Colors.primaryColor }}>$179.99</Text> per year
            </Text>
          </View>
          {/* <AntDesign name="right" size={24} color={Colors.primaryColor} /> */}
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  signInButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  homeScreenNotificationStyle: {
    backgroundColor: "#eef3fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
  },
  whyLADStyle: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    height: 100.0,
    borderRadius: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding - 35,
    marginHorizontal: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
  },
  signUpButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  imageStyle: { marginTop: Sizes.fixPadding * 9.0, height: 300, width: 300 },
  phoneNumberContentStyle: {
    height: 60.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: Colors.blackColor,
    borderWidth: 1,
    marginTop: Sizes.fixPadding * 3.0,
  },
  textFieldContentStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: "rgba(128, 128, 128, 0.8)",
    borderRadius: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  loginWithGoogleButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: Colors.grayColor,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    height: 56.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  loginWithFacebookButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 6.0,
    marginBottom: Sizes.fixPadding * 2.5,
    backgroundColor: "#3B5998",
    flexDirection: "row",
    height: 56.0,
  },
  continueButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 4.0,
    marginBottom: Sizes.fixPadding * 2.0,
    height: 56.0,
  },
  searchCountryTextFieldContentStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
    borderBottomWidth: 1.0,
    borderBottomColor: Colors.grayColor,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 40,
    paddingHorizontal: Sizes.fixPadding * 3.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding,
  },
  cancelButtonStyle: {
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
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 7.0,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
});

SubscriptionScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default SubscriptionScreen;
