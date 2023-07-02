import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword,deleteUser} from "firebase/auth";
import React, { useState } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";
import Dialog from "react-native-dialog";
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
import { TextInput } from "react-native-paper";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection, useDocument } from "react-query-firestore";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
const { width } = Dimensions.get("screen");

function ChangePasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { add } = useCollection("mail");
 
  const [state, setState] = useState({
        isLogout: false,
  });
  const auth = getAuth();
  const { deleteDocument } = useDocument(auth?.currentUser?.uid ? `users/${auth?.currentUser?.uid}`: undefined);

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={async () => {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        )
          await reauthenticateWithCredential(auth.currentUser,credential).then(function() {
            updatePassword(auth.currentUser, password).then(function() {
              // Update successful.
              showMessage({
                message: "Password Saved!",
                type: "success",
              })
              navigation.navigate("Settings")
            }).catch(function(error) {
              console.log(error)
              showMessage({
                message: "Error",
                type: "danger",
              })
            })
          }
          ).catch(function(error) {
            
            var errorCode = error.code;
                  var errorMessage = error.message;
                  if (errorCode === 'auth/wrong-password') {
            return showMessage({
              message: "Incorrect Password!",
              type: "danger",
            })}
            
            if (errorCode === 'auth/too-many-requests') {
              return showMessage({
                message: "Too many attempts, please logout and use the forgot password link.",
                type: "danger",
              })}
            
              return showMessage({
                message: "An unidentified issue occured please try again!",
                type: "danger",
              })
            }
            
            
            )
          

        }
          
                  }
        style={styles.submitButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Submit</Text>
      </TouchableOpacity>
    );
  }

  function currentPasswordTextField() {
    return (
      <TextInput
        label="Current Password"
        mode="outlined"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword( text) }
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
    );
  }
  function passwordTextField() {
    return (
      <TextInput
        label="New Password"
        mode="outlined"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword( text) }
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
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
           {title({ title: "Change Password" })}
          {currentPasswordTextField()}
          {passwordTextField()}
          {/* {passwordTextField()} */}
          {submitButton()}
          {title({ title: "Delete Account" })}
          {logOutInfo()}
        </ScrollView>
      </View>
      {logOutDialog()}
    </SafeAreaView>
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
            //alignItems: "center",
          }}
        >
          <Text
            style={{
              ...Fonts.blackColor16Bold,
              paddingBottom: Sizes.fixPadding - 5.0,
            }}
          >
            This will delete all information regarding the user, any subscriptions must be cancelled with the app store / google play. Any contracts which are created and still open will remain unless deleted.
          </Text>
          <TextInput
        label="Current Password"
        mode="outlined"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword( text) }
        style={{
          ...Fonts.blackColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          marginVertical: Sizes.fixPadding - 3.0,
        }}
        selectionColor={Colors.blackColor}
        theme={{ colors: { primary: "gray", underlineColor: "transparent" } }}
      />
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
              onPress={async () => {

                const credential = EmailAuthProvider.credential(
                  auth.currentUser.email,
                  currentPassword
              )

              await reauthenticateWithCredential(auth.currentUser,credential).then(function() {
                deleteUser(auth.currentUser).then(function() {
                  // Update successful.
                  deleteDocument();
                  showMessage({
                    message: "User Info Deleted!",
                    type: "success",
                  })
                  
                }).catch(function(error) {
                  console.log(error)
                  showMessage({
                    message: "Error",
                    type: "danger",
                  })
                })
              }
              ).catch(function(error) {
                
                var errorCode = error.code;
                      var errorMessage = error.message;
                      if (errorCode === 'auth/wrong-password') {
                return showMessage({
                  message: "Incorrect Password!",
                  type: "danger",
                })}
                
                if (errorCode === 'auth/too-many-requests') {
                  return showMessage({
                    message: "Too many attempts, please logout and use the forgot password link.",
                    type: "danger",
                  })}
                
                  return showMessage({
                    message: "An unidentified issue occured please try again!",
                    type: "danger",
                  })
                }
                
                
                )
              
    
            
              
                // signOut(auth);
                // setState({ ...state, isLogout: false });
                // navigation.navigate("Login");
              }}
              style={styles.logOutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor14Medium }}>Delete</Text>
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
          Delete Account
        </Text>
      </TouchableOpacity>
    );
  }

  function supportTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Write here"
          multiline={true}
          numberOfLines={6}
          mode="outlined"
          value={state.support}
          onChangeText={(text) => setState({ ...state, support: text })}
          style={{
            ...Fonts.blackColor14Medium,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
        />
      </View>
    );
  }

  function emailTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Email"
          mode="outlined"
          value={state.email}
          onChangeText={(text) => setState({ ...state, email: text })}
          style={{
            ...Fonts.blackColor14Medium,
            height: 50.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
        />
      </View>
    );
  }

  function nameTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
        <TextInput
          placeholder="Name"
          mode="outlined"
          value={state.name}
          onChangeText={(text) => setState({ ...state, name: text })}
          style={{
            ...Fonts.blackColor14Medium,
            height: 50.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
          selectionColor={Colors.primaryColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: "transparent",
            },
          }}
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
          Personal Settings
        </Text>
      </View>
    );
  }
}

function title({ title }) {
  return (
    <Text
      numberOfLines={1}
      style={{
        ...Fonts.blackColor14Regular,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
      }}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  headerContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 10.0,
  },
  submitButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 40,
    paddingTop: -Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
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

ChangePasswordScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default ChangePasswordScreen;
