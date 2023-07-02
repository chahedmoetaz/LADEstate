import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  BackHandler,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constant/styles";
import ChatScreen from "../screens/chat/chatScreen";
import HomeScreen from "../screens/home/homeScreen";
import SettingScreen from "../screens/setting/settingScreen";
import ShortlistScreen from "../screens/shortlist/shortlistScreen";
import { useAuthentication } from "../utils/hooks/useAuthentication";

function BottomTabBarScreen({ navigation }) {
  const [state, setState] = useState({ currentIndex: 1 });
  //   componentDidMount() {
  //     BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       this.handleBackButton.bind(this)
  //     );
  //   }

  //   componentWillUnmount() {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       this.handleBackButton.bind(this)
  //     );
  //   }
  const { user } = useAuthentication();
  const handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  function bottomTabBarItem({ index, iconName }) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={
          state.currentIndex == index ? styles.bottomTabSelectedIconStyle : null
        }
        onPress={() => setState({ currentIndex: index })}
      >
        <MaterialIcons
          name={iconName}
          size={24}
          color={
            state.currentIndex == index
              ? Colors.primaryColor
              : Colors.lightgrayColor
          }
        />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        {state.currentIndex == 1 ? (
          <HomeScreen navigation={navigation} user={user} />
        ) : state.currentIndex == 2 ? (
          <ChatScreen navigation={navigation} user={user} />
        ) : state.currentIndex == 3 ? (
          <ShortlistScreen navigation={navigation} user={user} />
        ) : (
          <SettingScreen navigation={navigation} user={user} />
        )}
        <View style={styles.bottomTabBarStyle}>
          {bottomTabBarItem({
            index: 1,
            iconName: "home",
          })}
          {/* {bottomTabBarItem({
            index: 2,
            iconName: "chat",
          })}
          {bottomTabBarItem({
            index: 3,
            iconName: "favorite",
          })} */}
          {bottomTabBarItem({
            index: 4,
            iconName: "settings",
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

BottomTabBarScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default BottomTabBarScreen;

const styles = StyleSheet.create({
  bottomTabBarStyle: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30.0,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
    borderTopWidth: 1.0,
    // elevation: 2.0
  },
  bottomTabSelectedIconStyle: {
    // height: 40.0,
    // width: 40.0,
    // // borderRadius: 20.0,
    // // backgroundColor: "rgba(128, 128, 128, 0.2)",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
