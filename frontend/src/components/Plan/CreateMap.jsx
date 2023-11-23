import React, { useState, useEffect } from "react";
import styles from "./NewPlan.module.css";
import { Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";

const CreateMap = ({selectedDay, setLocationList, setNewPlan, locationList}) => {
  let lat, lng;
  let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  // map은 지도 객체를 저장, places는 검색 결과를 저장
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  // inputText는 입력 필드의 현재 값을 추적, searchPlace는 검색할 장소를 저장
  const [inputText, setInputText] = useState("");
  const [searchPlace, setSearchPlace] = useState("");


  // 입력 필드에서 발생하는 이벤트를 처리하는 함수
  const onChange = (event) => {
    setInputText(event.target.value);
  };

  // 검색 버튼을 클릭했을 때의 이벤트를 처리하는 함수
  const submitHandler2 = (event) => {
    event.preventDefault();
    setSearchPlace(inputText);
    setInputText("");
  };

  useEffect(() => {
    setSearchPlace(" ");
    if (!searchPlace) {
      return;
    }

    if (map) {
      for (let i = 0; i < map.markers.length; i++) {
        map.markers[i].setMap(null);
      }
      map.markers = [];
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successGeo, failGeo);

        function successGeo(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          console.log(lat, lng);
          const container = document.getElementById("myMap");
          const options = {
            center: new kakao.maps.LatLng(lat, lng),
            level: 3,
          };
          // 지도 객체를 생성하고 map 상태에 저장
          const newMap = new kakao.maps.Map(container, options);
          newMap.markers = [];
          setMap(newMap);
        }

        function failGeo(event) {
          console.log("Error Geolocation!");
          const container = document.getElementById("myMap");
          const options = {
            center: new kakao.maps.LatLng(33.4, 126.3),
            level: 3,
          };
          // 지도 객체를 생성하고 map 상태에 저장
          const newMap = new kakao.maps.Map(container, options);
          newMap.markers = [];
          setMap(newMap);
        }
      } else {
        console.log("Not Using Geo");
        const container = document.getElementById("myMap");
        const options = {
          center: new kakao.maps.LatLng(33.4, 126.3),
          level: 3,
        };
        // 지도 객체를 생성하고 map 상태에 저장
        const newMap = new kakao.maps.Map(container, options);
        newMap.markers = [];
        setMap(newMap);
      }
    }

    const ps = new kakao.maps.services.Places();

    // 키워드 검색을 수행하고, 결과를 placesSearchCB 콜백 함수에 전달

    ps.keywordSearch(searchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);

        // 검색 결과를 places 상태에 저장
        setPlaces(data);
      }
      // 검색 결과가 없을 경우 리스트 초기화해주고 중심좌표를 현재 위치로
      else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(successGeo, failGeo);
          function successGeo(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            map.setCenter(new kakao.maps.LatLng(lat, lng));
            map.setLevel(3, { anchor: new kakao.maps.LatLng(lat, lng) });
          }
          function failGeo(event) {
            console.log("Error Geolocation!");
            map.setCenter(new kakao.maps.LatLng(37.537183, 127.005454));
            map.setLevel(3, {
              anchor: new kakao.maps.LatLng(37.537183, 127.005454),
            });
          }
        } else {
          map.setCenter(new kakao.maps.LatLng(37.537183, 127.005454));
        }
        setPlaces([]);
      }
    }
  }, [searchPlace, map]);

  function displayMarker(place, i) {

    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
    });


    // 클릭 이벤트 리스너를 추가하여, 마커 클릭 시 정보 창을 표시
    kakao.maps.event.addListener(marker, "mouseover", function () {
      infowindow.setContent(
        '<div style="padding:5px; font-size:12px;">' +
          place.place_name +
          "</div>"
      );
      infowindow.open(map, marker);
    });

    kakao.maps.event.addListener(marker, "mouseout", function () {
      infowindow.close();
    });

    map.markers.push(marker);

  }

  function handleMouseOver(i) {
    map.infowindows[i].open(map, map.markers[i]);
  }

  function handleMouseOut(i) {
    map.infowindows[i].close();
  }

  const addLocationHandler = (place, day) => {
    // 이미 추가된 장소인지 확인
    const isPlaceAlreadyAdded = locationList.some(
      item => item.name === place.place_name && item.day === day
    );
    
    if(isPlaceAlreadyAdded) {
      alert("이미 추가된 장소입니다.");
      return ;
    }
    setLocationList(prevState => {
      const newLocationList = [...prevState];
      const newPlace = {
        day: day,
        lat: place.y,
        lng: place.x,
        seq: newLocationList.filter(item => item.day === day).length + 1,
        location: place.address_name,
        name: place.place_name,
      };
      newLocationList.push(newPlace);
      return newLocationList;

    });
    setNewPlan(prevState => {
      return {...prevState, plan_detail: locationList};
    })
  }

  // 검색 창과 결과 리스트, 지도를 표시하는 렌더링 부분
  return (
    <div className={styles.mapSection} style={{ display: "flex" }}>
      <div className={styles.searchSection} id="result-list">
        <form className={styles.inputForm} onSubmit={submitHandler2}>
          <input type="text" onChange={onChange} value={inputText} />
          <button type="submit">검색</button>
        </form>
        {places.map((item, i) => (
          <div
            className={styles.searchList}
            key={i}
          >
            <div className={styles.locationInfo}>
              <span>{i + 1}</span>
              <div>
                <h5>{item.place_name}</h5>
                {item.road_address_name ? (
                  <div>
                    <div>{item.road_address_name}</div>
                    <span>{item.address_name}</span>
                  </div>
                ) : (
                  <span>{item.address_name}</span>
                )}
                <span>{item.phone}</span>
              </div>
            </div>
            <button onClick={() => addLocationHandler(item, selectedDay)} className={styles.plusBtn}>+</button>
          </div>
        ))}
      </div>

      <div // 지도를 표시할 Container
        className={styles.kakaoMap}
        id="myMap"
        style={{
          width: "100%",
          height: "743px",
        }}
      ></div>
    </div>
  );
};

export default CreateMap;
