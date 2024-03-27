import axios from "axios"

export const BAIDU_OCR_URl = 'https://aip.baidubce.com/rest/2.0/ocr/v1'

export const getAccurateOCR = (imgData: string, token: string) => {
  return axios(`${BAIDU_OCR_URl}/accurate_basic?access_token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      'detect_direction': 'false',
      'paragraph': 'false',
      'probability': 'false',
      image: imgData
    }
  })
}

export const getGeneralOCR = (imgData: string, token: string) => {
  return axios(`${BAIDU_OCR_URl}/general_basic?access_token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      'detect_direction': 'false',
      'paragraph': 'false',
      'probability': 'false',
      image: imgData
    }
  })
}

/**
* 使用 AK，SK 生成鉴权签名（Access Token）
* @return string 鉴权签名信息（Access Token）
*/
export const getAccessToken = () => {
  const AK = '2fjHvO7lAJgsSnV9lNWRUpKH';
  const SK = 'KzgB11N5c3PyB8P67WjkYM0Hni2qZ5Iq';
  let options = {
    'method': 'POST',
    'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return axios({
    url: options.url,
    method: options.method,
  })
}