import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
  const {
    VITE_APP_KAKAO_API_KEY,
  } = import.meta.env
  useKakaoLoaderOrigin({
    /** 
     * ※주의※ appkey의 경우 본인의 appkey를 사용하셔야 합니다.
     * 해당 키는 docs를 위해 발급된 키 이므로, 임의로 사용하셔서는 안됩니다.
     * 
     * @참고 https://apis.map.kakao.com/web/guide/
     */
    appkey: `3ceaceb9c57122b3eb5daf8d7fd268e7`,
    libraries: ["clusterer", "drawing", "services"],
  })
}