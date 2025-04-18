import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library'

const Camera = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null)
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

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
            <View >
                <Text >We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current) {
            const {status} = await MediaLibrary.requestPermissionsAsync();
            // uri is a string that points to the asset
            // @ts-ignore
            const { uri } = await cameraRef.current.takePictureAsync()
            console.log('Hi')
            if (status === 'granted') {
                await MediaLibrary.createAssetAsync(uri)
                console.log('saved to gallery')
            } else {
                alert('Need permission!')
            }
        }
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
                    <Text style={{fontSize: 20}}>
                        Flip Camera
                    </Text>
                </TouchableOpacity>
            </CameraView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={takePicture}>
                    <Text style={styles.text}>Take Picture</Text>
                </TouchableOpacity>
            </View>
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