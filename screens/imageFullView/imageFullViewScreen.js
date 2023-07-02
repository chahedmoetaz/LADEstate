import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, SafeAreaView, StatusBar } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { Colors } from "../../constant/styles";

function ImageFullViewScreen({ route, navigation }) {
  const { id, propertyImage } = route.params;

  function closeButton() {
    return (
      <MaterialIcons
        name="close"
        size={24}
        color={Colors.whiteColor}
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", left: 20.0, top: 40.0 }}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.blackColor,
        justifyContent: "center",
      }}
    >
      <StatusBar backgroundColor={Colors.blackColor} />
      {closeButton()}
      <SharedElement id={id}>
        <Image
          source={propertyImage}
          style={{ height: 414.0, width: "100%" }}
          resizeMode="contain"
        />
      </SharedElement>
    </SafeAreaView>
  );
}

ImageFullViewScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default ImageFullViewScreen;
