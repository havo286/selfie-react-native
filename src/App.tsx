/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Dispatch, SetStateAction, useState, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageSourcePropType
} from 'react-native';

import { launchImageLibrary, ImageLibraryOptions, launchCamera } from 'react-native-image-picker';
import { replaceBackground } from 'react-native-image-selfie-segmentation';

const screenWidth = Dimensions.get('window').width

const App = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | undefined>()
  const [inputImage, setInputImage] = useState<string | undefined>()
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>()
  const backgroundPlaceholder = require('./assets/images/background.jpeg')
  const selfiePlaceholder = require('./assets/images/selfie.jpeg')

  const getPlaceholderUri = (image: ImageSourcePropType) => {
    return Image.resolveAssetSource(image).uri
  }

  const userTakePhoto = async (setter: Dispatch<SetStateAction<string | undefined>>) => {
    const result = await launchCamera({ mediaType: 'photo' })
    if (!result.didCancel) {
      const { assets } = result
      if (assets && assets.length > 0) {
        const { uri } = assets[0]
        setter(uri)
      }
    }
  }

  const loadImageLibrary = async (setter: Dispatch<SetStateAction<string | undefined>>) => {
    let options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
    };
    const results = await launchImageLibrary(options);
    if (!results.didCancel) {
      const { assets } = results
      if (assets && assets.length > 0) {
        const { uri } = assets[0]
        setter(uri)
      }
    }
  }

  const onProcessImageHandler = async () => {
    if (inputImage && backgroundImage) {
      setLoading(true)
      await replaceBackground(
        inputImage,
        backgroundImage,
        Platform.OS === 'ios' ? 250 : 500
      )
        .then((response) => {
          setImage(response)
          setLoading(false)
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
      })
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputSection}>
            {
              inputImage ? (
                <Image style={styles.inputImage} resizeMode='contain' source={{ uri: inputImage }}
                />
              ) : (
                  <View style={styles.inputImage}>
                    <Text style={styles.inputImageText}>+</Text>
                  </View>
              )
            }
            <View>
              <TouchableOpacity style={styles.inputBtn} onPress={ () => userTakePhoto(setInputImage)}>
                <Text style={styles.inputBtnText}>Add Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtnAlt} onPress={ () => setInputImage(getPlaceholderUri(selfiePlaceholder))}>
                <Text style={styles.inputBtnTextAlt}>Use Placeholder</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            {
              backgroundImage ? (
                <Image style={styles.inputImage} resizeMode="contain" source={{ uri: backgroundImage }}
                />
              ) : (
                  <View style={styles.inputImage}>
                    <Text style={styles.inputImageText}>+</Text>
                  </View>
              )
            }
            <View>
              <TouchableOpacity style={styles.inputBtn} onPress={ () => loadImageLibrary(setBackgroundImage)}>
                <Text style={styles.inputBtnText}>Add Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputBtnAlt} onPress={ () => setBackgroundImage(getPlaceholderUri(backgroundPlaceholder))}>
                <Text style={styles.inputBtnTextAlt}>Use Placeholder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={inputImage && backgroundImage ? styles.inputBtn : [styles.inputBtn, styles.inputBtnDisable]} onPress={onProcessImageHandler}>
          <Text style={styles.inputBtnText}>{loading ? 'Processing' : 'Process Image'}</Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {image ? (
            <Image style={styles.image} resizeMode='contain' source={{uri: image}} />
          ) : (
              <View style={styles.image}>
                <Text style={styles.inputImageText}>{loading ? 'Loading' : 'Press Process Image'}</Text>
              </View>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  inputSection: {
    paddingHorizontal: 10
  },
  inputBtn: {
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  inputBtnAlt: {
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 10
  },
  inputBtnDisable: {
    backgroundColor: '#777777'
  },
  inputBtnText: {
    color: '#FFFFFF'
  },
  inputBtnTextAlt: {
    color: '#000000'
  },
  inputImage: {
    width: (screenWidth - 60) / 2,
    height: (screenWidth - 60) / 2,
    borderRadius: 25,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputImageText: {
    color: '#000000',
    fontSize: 16
  },
  imageContainer: {
    flex: 1,
    marginTop: 20
  },
  image: {
    width: screenWidth - 40,
    height: '100%',
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20
  }
});

export default App;
