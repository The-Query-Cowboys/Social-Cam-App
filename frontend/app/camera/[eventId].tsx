import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Camera = () => {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  console.log(eventId);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { isDark } = useTheme();

  const styles = {
    container: "flex-1",
    centeredContainer: "flex-1 justify-center items-center p-5",

    controlsBar: ` h-[15%] flex-row justify-around items-center pb-5`,
    flipButton:
      "w-12 h-12 rounded-full bg-black/30 justify-center items-center",
    captureButton: `w-18 h-18 rounded-full bg-white/30 justify-center items-center border-4`,
    captureButtonInner: "w-14 h-14 rounded-full bg-white",
    backButton:
      "w-12 h-12 rounded-full bg-black/30 justify-center items-center",

    permissionButton: "bg-secondary- py-3 px-6 rounded-lg mb-3",
    permissionButtonText: "text-white text-base font-semibold",
    backButtonSecondary: "bg-gray-500 py-3 px-6 rounded-lg",

    discardButton: "py-3 px-6 rounded-lg w-36 items-center",
    uploadButton: "py-3 px-6 rounded-lg w-36 items-center",

    headerText: "text-lg font-semibold mb-2",
    bodyText: "text-base text-center mb-5",
    buttonText: "text-white text-base font-semibold",

    bg: isDark ? "bg-background-dark" : "bg-background-light",
    bgPrimary: isDark ? "bg-primary-dark" : "bg-primary-light",
    bgSecondary: isDark ? "bg-secondary-dark" : "bg-secondary-light",
    border: isDark ? "border-primary-dark" : "border-primary-light",
    text: isDark ? "text-text-dark" : "text-text-light",
    header: isDark ? "text-primary-dark" : "text-primary-light",
  };

  useEffect(() => {
    if (!mediaPermission) {
      requestMediaPermission();
    }
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView className={`${styles.centeredContainer} ${styles.bg}`}>
        <Text className={`${styles.bodyText} ${styles.text}`}>
          We need camera permissions to capture images for this event.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className={`${styles.permissionButton} ${styles.bgSecondary}`}
        >
          <Text className={styles.permissionButtonText}>
            Grant Camera Permissions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={styles.backButtonSecondary}
          onPress={() => router.back()}
        >
          <Text className={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // uri is a string that points to the asset
        // @ts-ignore
        const { uri } = await cameraRef.current.takePictureAsync();
        //console.log("Hi");
        setCapturedImage(uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    } else {
      return;
    }
  }

  async function uploadAndSavePhoto() {
    if (!capturedImage) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.createAssetAsync(capturedImage);
      Alert.alert("Success", "Photo saved to Gallery");
    } else {
      Alert.alert("Error", "We need permission to save this photo!");
    }

    //add upload logic here, Kawai can help
  }

  async function discardPhoto() {
    setCapturedImage(null);
  }

  if (capturedImage) {
    return (
      <SafeAreaView className={`${styles.container} ${styles.bg}`}>
        <View className={styles.container}>
          <Image
            source={{ uri: capturedImage }}
            className="flex-1"
            resizeMode="contain"
          />
          <View className="px-4 py-3">
            <Text className="text-white text-xl font-semibold text-center">
              Are you happy with this photo?
            </Text>
          </View>
          <View className={styles.controlsBar}>
            <TouchableOpacity
              className={`${styles.discardButton} ${styles.bgPrimary}`}
              onPress={discardPhoto}
              disabled={isUploading}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              className={`${styles.uploadButton} ${styles.bgSecondary}`}
              onPress={uploadAndSavePhoto}
              disabled={isUploading}
            >
              <Ionicons name="checkmark" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`${styles.container} ${styles.bg}`}>
      <CameraView
        ref={cameraRef}
        style={{ alignSelf: "center", height: "85%", aspectRatio: 2 / 3 }}
        facing={facing}
      />
      <View className={`${styles.controlsBar} ${styles.bg}`}>
        <TouchableOpacity
          onPress={toggleCameraFacing}
          className={styles.flipButton}
        >
          <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`${styles.captureButton} ${styles.border}`}
          onPress={takePicture}
        >
          <View className={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity
          className={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     alignSelf: "center",
//     height: "85%",
//     borderRadius: 16,
//     aspectRatio: 1.3 / 2,
//   },
//   buttonContainer: {
//     backgroundColor: "transparent",
//     margin: 20,
//   },
//   button: {
//     alignSelf: "center",
//     alignItems: "center",
//     backgroundColor: "yellow",
//     opacity: 0.5,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "black",
//   },
// });

export default Camera;
