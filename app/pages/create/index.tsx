import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Image as PickedImage } from 'react-native-image-crop-picker';
import { getAccessToken, getAccurateOCR, getGeneralOCR } from './service';
import { getProductionDayByResult, getShelfDaysByResult } from './utils';
import SelectImg from '../../components/SelectImg';
import { Icon } from '@rneui/themed';
import dayjs, { ManipulateType } from 'dayjs';
// import { Icon } from '@rneui/base';

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
  const [shelfDays, setShelfDays] = useState<{ num: Number, unit: ManipulateType}>({ num: 0, unit: 'day'});
  const [productionDay, setProductionDay] = useState('');
  const [expiration, setExpiration] = useState('');

  const getShelfDaysFromImg = async (imgData: string) => {
    setIsLoading(true);
    console.log('imgData', imgData);
    try {
      const res = await getAccurateOCR(imgData, token);
      console.log('res', res);
      const { num, unit } = getShelfDaysByResult(res);
      setShelfDays({ num, unit });
    } catch (err) {
      console.error(err);
      setShelfDays({ num: 0, unit: 'day' });
    }
    setIsLoading(false);
  };

  const getProductDayFromImg = async (imgData: string) => {
    setIsLoading(true);
    try {
      console.log('imgData', imgData);
      const res = await getGeneralOCR(imgData, token);
      console.log('res', res);
      const curProductionDay = getProductionDayByResult(res);
      setProductionDay(curProductionDay);
    } catch (err) {
      console.error(err);
      setProductionDay('');
    }
    setIsLoading(false);
    setProgress(0);
  };

  const initAccessToken = async () => {
    try {
      const res = await getAccessToken();
      if (res) {
        console.log('initAccessToken', res);
        console.log('access_token', res.data.access_token);
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
    console.log('image', image);
    console.log('image?.data', image?.data);
    image?.data && getProductDayFromImg(image?.data)
  }

  const onSelectShelfImg = async (image: PickedImage) => {
    image?.data && getShelfDaysFromImg(image?.data)
  }

  useEffect(() => {
    initAccessToken();
  }, [])

  useEffect(() => {
    if (productionDay && shelfDays) {
      const target = dayjs(productionDay).add(Number(shelfDays?.num), shelfDays?.unit).format('YYYY-MM-DD');
      setExpiration(target);
    }
  }, [productionDay, shelfDays])

  return (
    <View>
      <Icon name='devices' type="material" />
      <View style={{ display: "flex" }}>
        <Text>生产日期</Text>
        <TextInput value={productionDay} />
        <SelectImg onChange={onSelectProductionImg} />
      </View>
      <View style={{ display: "flex" }}>
        <Text>保质期</Text>
        <TextInput value={shelfDays?.num + shelfDays?.unit} />
        <SelectImg onChange={onSelectShelfImg} />
      </View>
      <View>
        <Text>过期时间</Text>
        <TextInput value={expiration} />
      </View>
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