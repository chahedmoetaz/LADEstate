import "dotenv/config";
export default {
  expo: {
    name: "RNLADEstate",
    slug: "rn-LADEstate",
    version: "1.0.3",
    privacy: 'public',
    platforms: ['ios', 'android'],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    plugins: [
      // [
      //   "@stripe/stripe-react-native",
      //   {
      //     merchantIdentifier: "merchant.ladestate",
      //     enableGooglePay: true,
      //   },
      // ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow LADestate to access your photos for your profile and OCR reasons.",
          savePhotosPermission: "Allow LADestate to save photos for your profile and OCR reasons.",
          isAccessMediaLocationEnabled: "true",
        },
      ],
      [
        "expo-notifications",
        {
          color: "#ffffff",
        },
      ],
    ],
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.render.ladestate",
      buildNumber: "5.1.0",
      supportsTablet: true,
      associatedDomains: ["applinks:rnladestate.page.link"],
      infoPlist: {
        
        "Privacy - Photo Library Usage Description": "App allows you to upload photos for your profile picture as well as OCR reasons.",
        "NSPhotoLibraryUsageDescription": "App allows you to upload photos for your profile picture as well as OCR reasons.",
        "NSLocationWhenInUseUsageDescription": "App allows you to locate nearby events, property details etc.",
        "NSCameraUsageDescription": "App allows you to take photos for your profile picture as well as OCR reasons.",
        "NSAllowsLocalNetworking": true,
      }
      
    },
    android: {
     
    package: "com.render.ladestate",
     versionCode: 3,
     useNextNotificationsApi: true,
     intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [{
          scheme: "https",
          host: "*.rnladestate.page.link",
          pathPrefix: "/"
        }],
        category: ["BROWSABLE", "DEFAULT"]
       
     }],
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#FFFFFF",
      },
      config: {
        googleMaps: {
          apiKey: "AIzaSyBEwLe83JL_WAPUQmGsT7ayyxUETqkqgUg",
        },
      },
    },
  
    extra: {
      firebaseApiKey:"AIzaSyABUjG_Chamn2jnN6bYQFA9Ek7zZiJB6mM",
      firebaseAuthDomain:"ladestate.firebaseapp.com",
      firebaseProjectId:"ladestate",
      firebaseStorageBucket:"ladestate.appspot.com",
      firebaseMessagingSenderId:"904052595490",
      firebaseAppId:"1:904052595490:web:037960816bb754fd1ea37b",
      firebaseMeasurementId:"G-2WKPH8QE2Z",
      googleVisionAPI:"AIzaSyBEwLe83JL_WAPUQmGsT7ayyxUETqkqgUg",
     
    },
  },
};
