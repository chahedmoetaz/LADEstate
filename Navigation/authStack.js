import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import initAuthScreen from "../screens/auth/initAuthScreen";
import loginScreen from "../screens/auth/loginScreen";
import ForgotPasswordScreen from "../screens/auth/register/forgotPasswordScreen";
import RegisterAccountTypeScreen from "../screens/auth/register/registerAccountTypeScreen";
import registerScreen from "../screens/auth/register/registerScreen";
// import WelcomeScreen from '../screens/Welcome';
// import SignInScreen from '../screens/SignInScreen';
// import SignOutScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  // const [claims, setClaims] = useState();
  // getIdTokenResult(user).then((result) => setClaims(result.claims));

  return (
    <Stack.Group
      initialRouteName="auth"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="InitAuth" component={initAuthScreen} />
      <Stack.Screen name="Login" component={loginScreen} />
      <Stack.Screen name="Register" component={registerScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      <Stack.Screen
        name="RegisterAccountType"
        component={RegisterAccountTypeScreen}
      />
    </Stack.Group>
  );
}
