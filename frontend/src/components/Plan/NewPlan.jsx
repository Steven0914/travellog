import { useEffect, useState } from "react";
import ModalComponent from "../UI/ModalComponent";
import CreateMap from "./CreateMap";
import TravelList from "./TravelList";
import styles from "./NewPlan.module.css";
import PlanNavbar from "./PlanNavbar";
import { useNavigate } from "react-router-dom";

const NewPlan = () => {
  const [planName, setPlanName] = useState("Plan Name");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateDiff, setDateDiff] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [locationList, setLocationList] = useState([]);
  const [modalOpen, setModalOpen] = useState(true);

  const [newPlan, setNewPlan] = useState({
    id: 1,
    title: planName,
    start_date: startDate,
    end_date: endDate,
    plan_detail: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token : " + token);
    if (!token) {
      navigate("/Login");
    }

    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  useEffect(() => {
    setNewPlan(prevState => {
      return {...prevState, plan_detail: locationList};
    });
  }, [locationList]);

  useEffect(() => {
    console.log(newPlan);
  }, [newPlan]);

  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  return (
    <div className={styles.main}>
      <ModalComponent
        modalOpen={modalOpen}
        newPlan={newPlan}
        setModalOpen={setModalOpen}
        setPlanName={setPlanName}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setDateDiff={setDateDiff}
        setNewPlan={setNewPlan}
      />
      <PlanNavbar
        planName={planName}
        startDate={startDate}
        endDate={endDate}
        dateDiff={dateDiff}
        selectedDay={selectedDay}
        setModalOpen={setModalOpen}
        setSelectedDay={setSelectedDay}
      />
      <div className={styles.body}>
        <div>
          <TravelList
            selectedDay={selectedDay}
            locationList={locationList}
            setLocationList={setLocationList}
          />
        </div>
        <div>
          <CreateMap
            selectedDay={selectedDay}
            locationList={locationList}
            setLocationList={setLocationList}
            setNewPlan={setNewPlan}

          />
        </div>
      </div>
    </div>
  );
};

export default NewPlan;
