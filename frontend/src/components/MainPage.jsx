import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Navbar from "./UI/Navbar";
import Footer from "./UI/Footer";
import mainImage from "../assets/image/mainPageImage.png";
import styles from "./MainPage.module.css";

const MainPage = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 메인페이지 접속시 토큰을 로그로 출력
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn}/>
      <div className={styles.container}>
        <div>
          <img className={styles.mainImage} src={mainImage} />  
        </div>
        <div className={styles.mainBody}>
          <div className={styles.body1}>
            <div className={styles.typewriter1}>
              <span>Great </span>
              <span className={styles.Plan}>Plan </span>
              <span>is</span>
            </div>
            <div className={styles.typewriter2}>
              <span>made by </span>
              <span className={styles.Review}>Review</span>
            </div>

          </div>
          <div className={styles.body2}>
            <p>최고의 여행은 그 계획의 후기를 통해 만들어집니다.</p>
            <p>Travel Log와 함께 여행계획을 세우고 후기를 리뷰해보세요!</p>
          </div>

          {isLoggedIn ? (
              <Link to="/NewPlan" style={{ textDecoration: "none"}}><button className={styles.startButton}>지금 바로 계획하기!</button></Link>
          ) : (
              <Link to="/Login" style={{ textDecoration: "none"}}><button className={styles.startButton}>지금 바로 가입하기!</button></Link>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
