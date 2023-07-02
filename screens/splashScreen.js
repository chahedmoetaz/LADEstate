import React from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { CircleFade } from "react-native-animated-spinkit";
import { Colors, Sizes } from "../constant/styles";

function SplashScreen({ navigation }) {
  setTimeout(() => {
    navigation.navigate("BottomBar");
  }, 2000);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      {/* <ImageBackground
          style={{ flex: 1 }}
          source={require("../assets/images/bg.jpg")}
          resizeMode="cover"
        > */}
      <View style={styles.pageStyle}>
        <Image
          source={require("../assets/images/icon.png")}
          style={{
            height: 24.0,
            width: 24.0,
          }}
          resizeMode="contain"
        ></Image>
        <CircleFade
          size={50}
          color={Colors.whiteColor}
          style={{
            position: "absolute",
            bottom: 40.0,
          }}
        />
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageStyle: {
    flex: 1,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
  },
});

SplashScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default SplashScreen;
