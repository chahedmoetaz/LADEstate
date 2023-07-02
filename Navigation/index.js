import { Link, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useCollection, useDocument } from "react-query-firestore";
import bottomTabBarScreen from "../component/bottomTabBarScreen";
import DocumentScannerView from "../component/DcoumentScanner";
import addNewListingScreen from "../screens/addNewListing/addNewListingScreen";
import addNewTenantScreen from "../screens/addNewTenant/addNewTenantScreen";
import signatureScreen from "../screens/addSignature/signatureScreen";
import { default as EnableLocationScreen } from "../screens/auth/enableLocationScreen";
import initAuthScreen from "../screens/auth/initAuthScreen";
import loginScreen from "../screens/auth/loginScreen";
import { default as SubscriptionScreen } from "../screens/auth/payment/subscriptionScreen";
import ForgotPasswordScreen from "../screens/auth/register/forgotPasswordScreen";
import RegisterAccountTypeScreen from "../screens/auth/register/registerAccountTypeScreen";
import { default as registerAdditionalScreen } from "../screens/auth/register/registerAdditionalScreen";
import registerScreen from "../screens/auth/register/registerScreen";
import verificationScreen from "../screens/auth/verificationScreen";
import addTenantLandlordScreen from "../screens/contract/addLandlordTenantScreen";
import contractCreationScreen from "../screens/contract/contractCreationScreen";
import contractScreen from "../screens/contract/contractScreen";
import LandlordContracts from "../screens/contract/landlordContracts";
import reviewContractScreen from "../screens/contract/reviewContractScreen";
import TenantContracts from "../screens/contract/tenantContracts";
import UserCompletedContracts from "../screens/contract/userCompletedContracts";
import userContractScreen from "../screens/contract/userContracts";
import viewContractCreated from "../screens/contract/viewCreateContractScreen";
import editProfileScreen from "../screens/editProfile/editProfileScreen";
import imageFullViewScreen from "../screens/imageFullView/imageFullViewScreen";
import messageScreen from "../screens/message/messageScreen";
import myListingScreen from "../screens/myListing/myListingScreen";
import createContractScreen from "../screens/newContract/newContractScreen";
import notificationScreen from "../screens/notification/notificationScreen";
import privacyPolicyScreen from "../screens/privacyPolicy/privacyPolicyScreen";
import profileScreen from "../screens/profile/profileScreen";
import propertyScreen from "../screens/property/propertyScreen";
import searchScreen from "../screens/search/searchScreen";
import settingScreen from "../screens/setting/settingScreen";
import ChangePasswordScreen from "../screens/support/changePasswordScreen";
import MembershipScreen from "../screens/support/membershipScreen";
import supportScreen from "../screens/support/supportScreen";
import termsOfUseScreen from "../screens/termsOfUse/termsOfUseScreen";
import { UserIdContext } from "../utils/hooks/context";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import * as Linking from "expo-linking";
import * as RootNavigate from "./rootNavigation";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "../constant/styles";
import { showMessage } from "react-native-flash-message";
const Stack = createStackNavigator();
// function PhoneStack() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           presentation: "modal",
//         }}
//       >
//         <Stack.Screen name="Verify" component={verifyScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default function RootNavigation() {
  const { user: userAuth } = useAuthentication();
  const [user, setUser] = useContext(UserIdContext);
  const [state, setState] = useState({timePassed: false})
  const [linkdata, setLinkData] = useState(null)
  if (!userAuth) {
    setTimeout(() => {setState({timePassed: true})}, 1500)
  }

  const { data: userData, status, update } = useDocument(
    userAuth?.uid ? `users/${userAuth?.uid}` : undefined
 );
  const getMembership = async () => {
   
  const customerInfo = await Purchases.getCustomerInfo();
  
  if(customerInfo?.entitlements?.all["Pro"]?.isActive !== true) {
   
    update({
     step: "SubscriptionRequired",
      })  
  }
  // console.log(customerInfo)
  //   if (customerInfo?.activeSubscriptions?.length == 0) {
  //     console.error("TRUE")
  //      update({
  //       step: "SubscriptionRequired",
  //        })  
  //   }
   
    
  }

  const initPurchases = async () => {

    await Purchases.configure({ apiKey: "appl_GPfOYKXXwHVyfWWGSPMcmFSzgbb" });
  }

  
  useEffect(() => {

    Linking.addEventListener("url", handleDeepLink);
    return ( () => {

      Linking.removeEventListener("url")
    })
  }, [])

  useEffect(() => {

    handleInitialLink()
    //initPurchases()
  
 
  
  },[])

  useEffect(() => {

   if (userData?.step =="subscribed") {
   // getMembership()
   }
      
  },[userData])


  async function handleInitialLink() {
    const url = await Linking.getInitialURL()

    if (url) {

      let data = Linking.parse(url)

      console.log("data", data)
      if (data?.path == "register") {
        
        RootNavigate.navigate("Register", {type: data?.queryParams?.type ,email: data?.queryParams?.id, name: data?.queryParams?.name})
      }
      setLinkData(data)
      
    }
  }

  function handleDeepLink(event){
    let data = Linking.parse(event.url)

  
    if (data?.path == "register") {

      if (!userAuth) {
        try {
          RootNavigate.navigate("Register", {type: data?.queryParams?.type ,email: data?.queryParams?.id, name: data?.queryParams?.name})
          setLinkData(data)
          showMessage({message: "Link registered", type:"success"})
        } catch (error) {
          showMessage({message: "An issue occured or the link is invalid", type:"warning"})
        }
        
      } else {
        showMessage({message: "You must be signed out to use this registration link", type:"warning"})
      }
      
     
    }
   
  }

  const animation = useRef(null);
  useEffect(() => {
    setUser(userData);
  }, [userData]);

  if (userAuth?.uid && status === "loading" || !state.timePassed ) return (
    <SafeAreaView style={styles.animationContainer}>
     <ActivityIndicator animating={true} color={Colors.primaryColor} ></ActivityIndicator> 
     {/* <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#fff',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/loading.json')}
      /> */}
    </SafeAreaView>
  ) 


  return (
    <NavigationContainer ref={RootNavigate.navigationRef}>
      <Stack.Navigator>
        {user?.exists ? (
          // Screens for logged in users
          <Stack.Group
            screenOptions={{
              headerShown: false,
            }}
          >
            {user?.step === "SubscriptionRequired" && (
              <Stack.Screen
                name="SubscriptionScreen"
                component={SubscriptionScreen}
              />
            )}

            {user?.step === "subscribed" && (
              <>
                <Stack.Screen name="BottomBar" component={bottomTabBarScreen} />
                <Stack.Screen
                  name="EnableLocation"
                  component={EnableLocationScreen}
                />
                <Stack.Screen name="Search" component={searchScreen} />
                <Stack.Screen
                  name="Notification"
                  component={notificationScreen}
                />
                <Stack.Screen name="Property" component={propertyScreen} />
                <Stack.Screen
                  name="ImageFullView"
                  component={imageFullViewScreen}
                />
                <Stack.Screen name="Message" component={messageScreen} />
                <Stack.Screen
                  name="EditProfile"
                  component={editProfileScreen}
                />
                <Stack.Screen name="Profile" component={profileScreen} />
                <Stack.Screen
                  name="AddNewProperty"
                  component={addNewListingScreen}
                />
                <Stack.Screen
                  name="AddNewTenant"
                  component={addNewTenantScreen}
                />
                <Stack.Screen name="MyListing" component={myListingScreen} />
                <Stack.Screen
                  name="PrivacyPolicy"
                  component={privacyPolicyScreen}
                />
                <Stack.Screen name="TermsOfUse" component={termsOfUseScreen} />
                <Stack.Screen name="Support" component={supportScreen} />
                <Stack.Screen
                  name="ChangePasswordScreen"
                  component={ChangePasswordScreen}
                />
                <Stack.Screen
                  name="MembershipScreen"
                  component={MembershipScreen}
                />
                <Stack.Screen
                  name="CreateContract"
                  component={createContractScreen}
                />
                <Stack.Screen name="Contract" component={contractScreen} />
                <Stack.Screen
                  name="UserContracts"
                  component={userContractScreen}
                />
                <Stack.Screen
                  name="LandLordContracts"
                  component={LandlordContracts}
                />
                <Stack.Screen
                  name="TenantContracts"
                  component={TenantContracts}
                />
                <Stack.Screen
                  name="UserCompletedContracts"
                  component={UserCompletedContracts}
                />
                <Stack.Screen name="Signature" component={signatureScreen} />
                <Stack.Screen name="Settings" component={settingScreen} />
                <Stack.Screen
                  name="ReviewContract"
                  component={reviewContractScreen}
                />
                <Stack.Screen
                  name="DocuScanScreen"
                  component={DocumentScannerView}
                />
                <Stack.Screen
                  name="AddTenantLandlord"
                  component={addTenantLandlordScreen}
                />
                <Stack.Screen
                  name="ContractCreatedView"
                  component={viewContractCreated}
                />
                <Stack.Screen
                  name="ContractCreation"
                  component={contractCreationScreen}
                />
              </>
            )}

            {user?.step === "RegisterAdditional" && (
              <Stack.Screen
                name="RegisterAdditional"
                component={registerAdditionalScreen}
              />
            )}
          </Stack.Group>
        ) : (
          // Auth screens
          <Stack.Group
            initialRouteName="auth"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="InitAuth" component={initAuthScreen} />
            <Stack.Screen name="Login" component={loginScreen} />
            <Stack.Screen name="Register" component={registerScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />

            <Stack.Screen
              name="RegisterAccountType"
              component={RegisterAccountTypeScreen}
            />
          </Stack.Group>
        )}

        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          {user?.step === "Verification" && (
            <Stack.Screen name="Verification" component={verificationScreen} />
          )}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//pk_test_51HTMJBIZoCLf5Xk2eKBCbsxo391SmBq86gdxfxzUFYCpxvR5fp8InKriurQFpV11p5y7M0kUy7awnWbtaC8gE4d600xa8m5IyV
//sk_test_51HTMJBIZoCLf5Xk2FNjxy1fxIkcmy5bS3Pp31GKTG8qnx0cznxN9UEbxkns7G8OHCUv7PynsJy9rLomqnzPopJNh005uAscZy4

//monthly ID prod_M3vrApK9dQZ6M2   price_1LLo0DIZoCLf5Xk2AQLc7f0A
//yearly ID prod_M3vtiq885Qtm2c  price_1LLo1GIZoCLf5Xk2Mx6PjqQ3
const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});