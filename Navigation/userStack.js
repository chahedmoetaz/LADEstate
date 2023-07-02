import { createStackNavigator } from "@react-navigation/stack";
import { getAuth } from "firebase/auth";
import React from "react";
import { useDocument } from "react-query-firestore";
import bottomTabBarScreen from "../component/bottomTabBarScreen";
import DocumentScannerView from "../component/DcoumentScanner";
import addNewListingScreen from "../screens/addNewListing/addNewListingScreen";
import addNewTenantScreen from "../screens/addNewTenant/addNewTenantScreen";
import signatureScreen from "../screens/addSignature/signatureScreen";
import { default as EnableLocationScreen } from "../screens/auth/enableLocationScreen";
import { default as SubscriptionScreen } from "../screens/auth/payment/subscriptionScreen";
import { default as registerAdditionalScreen } from "../screens/auth/register/registerAdditionalScreen";
import verificationScreen from "../screens/auth/verificationScreen";
import addTenantLandlordScreen from "../screens/contract/addLandlordTenantScreen";
import contractCreationScreen from "../screens/contract/contractCreationScreen";
import contractScreen from "../screens/contract/contractScreen";
import landlordContracts from "../screens/contract/landlordContracts";
import reviewContractScreen from "../screens/contract/reviewContractScreen";
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
import supportScreen from "../screens/support/supportScreen";
import termsOfUseScreen from "../screens/termsOfUse/termsOfUseScreen";
const Stack = createStackNavigator();

export default function UserStack() {
  const auth = getAuth();
  const userAuth = auth.currentUser;

  const { data: user } = useDocument(
    userAuth.email ? `users/${userAuth.email}` : undefined
  );

 
  if (!user) return null;

  return (
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
          <Stack.Screen name="Notification" component={notificationScreen} />
          <Stack.Screen name="Property" component={propertyScreen} />
          <Stack.Screen name="ImageFullView" component={imageFullViewScreen} />
          <Stack.Screen name="Message" component={messageScreen} />
          <Stack.Screen name="EditProfile" component={editProfileScreen} />
          <Stack.Screen name="Profile" component={profileScreen} />
          <Stack.Screen name="AddNewProperty" component={addNewListingScreen} />
          <Stack.Screen name="AddNewTenant" component={addNewTenantScreen} />
          <Stack.Screen name="MyListing" component={myListingScreen} />
          <Stack.Screen name="PrivacyPolicy" component={privacyPolicyScreen} />
          <Stack.Screen name="TermsOfUse" component={termsOfUseScreen} />
          <Stack.Screen name="Support" component={supportScreen} />
          <Stack.Screen
            name="LandLordContracts"
            component={landlordContracts}
          />
          <Stack.Screen
            name="CreateContract"
            component={createContractScreen}
          />
          <Stack.Screen name="Contract" component={contractScreen} />
          <Stack.Screen name="UserContracts" component={userContractScreen} />
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
          <Stack.Screen name="DocuScanScreen" component={DocumentScannerView} />
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
      {userAuth.emailVerified === false && (
        <Stack.Screen name="Verification" component={verificationScreen} />
      )}
      {user?.step === "RegisterAdditional" && (
        <Stack.Screen
          name="RegisterAdditional"
          component={registerAdditionalScreen}
        />
      )}
    </Stack.Group>
  );
}
