import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function PictureTaker() {
  const cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const sheetRef = useRef();

  const snapPoints = useMemo(() => ["90%"], []);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current.snapToIndex(index);
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 0.5,
      base64: true,
      exif: false,
    };

    handleSnapPress(0);
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    
    setPhoto(newPhoto);
  };

  let sharePic = () => {
    shareAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };

  let savePhoto = () => {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };
  //   if (photo) {
  //     return (
  //       <SafeAreaView style={styles.container}>
  //         <Image
  //           style={styles.preview}
  //           source={{ uri: "data:image/jpg;base64," + photo.base64 }}
  //         />
  //         <Button title="Share" onPress={sharePic} />
  //         {hasMediaLibraryPermission ? (
  //           <Button title="Save" onPress={savePhoto} />
  //         ) : undefined}
  //         <Button title="Discard" onPress={() => setPhoto(undefined)} />
  //       </SafeAreaView>
  //     );
  //   }
  

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={() => takePic()} />
      </View>
      <StatusBar style="auto" />
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setPhoto()}
      >
        <BottomSheetView>
          {photo && (
            <Image
              style={styles.preview}
              source={{ uri: "data:image/jpg;base64," + photo.base64 }}
            />
          )}
          <Button title="Share" onPress={() => sharePic()} />
          {hasMediaLibraryPermission ? (
            <Button title="Save" onPress={() => savePhoto()} />
          ) : undefined}
          <Button title="Discard" onPress={() => setPhoto()} />
        </BottomSheetView>
      </BottomSheet>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    resizeMode: "cover",
    height: 300,
  },
});
