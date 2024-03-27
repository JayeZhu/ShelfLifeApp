import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import ImagePicker, { Image as PickedImage } from 'react-native-image-crop-picker';
import { Circle } from 'react-native-progress';
import { convertToNumber } from './number';
import { getAccessToken, getAccurateOCR, getGeneralOCR } from './service';
import { getProductionDayByResult, getShelfDays, getShelfDaysByResult } from './utils';
import SelectImg from '../../components/SelectImg';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
  includeBase64: true,
};

type SelectImgTypes = 'openPicker' | 'openCamera';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgShelf, setImgShelf] = useState(null)
  const [imgProduction, setImgProduction] = useState(null);
  const [token, setToken] = useState('');
  const [shelfDays, setShelfDays] = useState('');
  const [productionDay, setProductionDay] = useState('');

  const getShelfDaysFromImg = async (imgData: string) => {
    setIsLoading(true);
    try {
      const res = await getAccurateOCR(imgData, token);
      const curshelfDays = getShelfDaysByResult(res);
      setShelfDays(curshelfDays?.toString());
    } catch (err) {
      console.error(err);
      setShelfDays('');
    }
    setIsLoading(false);
  };

  const getProductDayFromImg = async (imgData: string) => {
    setIsLoading(true);
    try {
      const res = await getGeneralOCR(imgData, token);
      const curProductionDay = getProductionDayByResult(res);
      setProductionDay(curProductionDay);
    } catch (err) {
      console.error(err);
      setShelfDays('');
    }
    setIsLoading(false);
    setProgress(0);
  };

  const initAccessToken = async () => {
    try {
      const res = await getAccessToken();
      if (res) {
        setToken(res.data.access_token)
      } else {
        setToken('');
        console.log('has not token')
      }
    } catch (e) {
      setToken('');
      console.error(`get token error: ${e}`)
    }
  }

  const onSelectProductionImg = async (image: PickedImage) => {
    image?.data && getProductDayFromImg(image?.data)
  }

  const onSelectShelfImg = async (image: PickedImage) => {
    image?.data && getShelfDaysFromImg(image?.data)
  }

  useEffect(() => {
    initAccessToken();
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ display: "flex" }}>
        <Text>生产日期</Text>
        <TextInput value={productionDay} />
        <SelectImg onChange={onSelectProductionImg} />
      </View>
      <View style={{ display: "flex" }}>
        <Text>保质期</Text>
        <TextInput value={shelfDays} />
        <SelectImg onChange={onSelectShelfImg} />
      </View>

      {/* <Text style={styles.instructions}>保质期:</Text>
      <View style={styles.options}>
        <View style={styles.button}>
          <Button
            disabled={isLoading}
            title="Camera"
            onPress={() => {
              selectImg(defaultPickerOptions, 'openCamera', setImgProduction, getGeneralOCR);
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            disabled={isLoading}
            title="Picker"
            onPress={() => {
              recognizeFromPicker();
            }}
          />
        </View>
      </View>
      {imgSrc && (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={imgSrc} />
          {isLoading ? (
            <Circle showsText progress={progress} />
          ) : (
            <Text>{shelfDays}天</Text>
          )}
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Home;