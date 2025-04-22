import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import {Button, Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import * as MediaLibrary from 'expo-media-library'

const Camera = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null)
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [previewUri, setPreviewUri] = useState(null)
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        if (!mediaPermission) {
            requestMediaPermission();
        }
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View >
                <Text >We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }


    async function picPreview() {
        if (cameraRef.current) {
            await MediaLibrary.requestPermissionsAsync()
            // @ts-ignore
            const { uri } = await cameraRef.current.takePictureAsync()
            setPreviewUri(uri)
            setShowPreview(true)
            console.log(previewUri)
        }
    }

    const savePhoto = async () => {
        if (previewUri) {
            await MediaLibrary.createAssetAsync(previewUri)
            setShowPreview(false)
            setPreviewUri(null)
        }
    }

    const discardPhoto = () => {
        setShowPreview(false)
        setPreviewUri(null)
    }

    return (
        <View style={styles.container}>
            {showPreview && previewUri ? (
            <View>
                <Image
                    source={{ uri: previewUri }}
                    style={{ width: 300, height: 400, marginBottom: 20 }}
                />
                <Text>Save image?</Text>
                <TouchableOpacity onPress={savePhoto}>
                    <Text className={`text-3xl`}>
                        Yes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={discardPhoto}>
                    <Text className={`text-3xl`}>
                        No
                    </Text>
                </TouchableOpacity>
            </View>) : (
            <View>
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
                        <Text style={{fontSize: 20}}>
                            Flip Camera
                        </Text>
                    </TouchableOpacity>
                </CameraView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={picPreview}>
                        <Text style={styles.text}>Take Picture</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        alignSelf: 'center',
        height: '85%',
        borderRadius: 16,
        aspectRatio: 1.3/2,
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        margin: 20,
    },
    button: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
        opacity: 0.5
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});


export default Camera