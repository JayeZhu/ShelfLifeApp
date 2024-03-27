import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { View, Button, Modal, Pressable, SafeAreaView, Text, StyleSheet } from "react-native";
import { ImageOrVideo, openCamera, openPicker } from "react-native-image-crop-picker";

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
  includeBase64: true,
};

interface IProps {
  onChange: (imageOrVideo: ImageOrVideo) => void;
  options?: Object;
}

const SelectImg = (props: IProps) => {
  const { onChange, options } = props;
  const [visible, setVisible] = useState(false);
  const realOptions = {...defaultPickerOptions, ...options};
  const closeModal = () => {

  }

  const chooseImage = async () => {
    try {
      const image = await openPicker(realOptions);
      onChange(image);
    } catch (err: any) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const takeImage = async () => {
    try {
      const image = await openCamera(realOptions);
      onChange(image);
    } catch (err: any) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  }

  return <View>
    <Icon name="aperture-outline" type="ionicon" onPress={() => setVisible(true)} />
    <Modal
      visible={visible}
      onPointerCancel={closeModal}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <SafeAreaView style={styles.options}>
        <Pressable style={styles.option} onPress={chooseImage}>
          <Icon name="image-outline" type="ionicon" />
          <Text>Library </Text>
        </Pressable>
        <Pressable style={styles.option} onPress={takeImage}>
          <Icon name="camera-outline" type="ionicon" />
          <Text>Camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
  avatar: {
    paddingTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
    padding: 20,
  },

  options: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectImg;