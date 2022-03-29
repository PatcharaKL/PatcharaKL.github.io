import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import Button from "@restart/ui/esm/Button";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../firebase-config";

const ProductCard = ({ name, img, price, duration, pID, merchantID }) => {
  const [timerDays, setTimerDays] = useState('--');
  const [timerHours, setTimerHours] = useState('--');
  const [timerMins, setTimerMins] = useState('--');
  const [timerSecs, setTimerSecs] = useState('--');
  const location = useLocation();
  let interval = useRef();

  const deleteProduct = async () => {
    await deleteDoc(doc(db, "products", pID));
  };

  const startTimer = () => {
    const countdownDate = new Date(duration).getTime();
    interval = setInterval(async () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        await updateDoc(doc(db, "products", pID), { expired: true });
        clearInterval(interval);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMins(minutes);
        setTimerSecs(seconds);
      }
    },1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval);
    };
  });

  const checkIfNaN = () => {
    if (
      isNaN(timerDays) &&
      isNaN(timerHours) &&
      isNaN(timerMins) &&
      isNaN(timerSecs)
    ) {
      return true;
    } else {
      return false;
    }
  };
  console.log(checkIfNaN())
  return (
    <div>
      <CardGroup className="m-1">
        <Card style={{ width: "10rem" }}>
          <Link to={`/Product/${pID}`}>
            <Card.Img
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                marginBottom: "5px",
              }}
              variant="top"
              src={img}
            />
          </Link>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <hr></hr>
            {!checkIfNaN() ? (
              <Card.Text>
                {timerDays} Days {timerHours}:{timerMins}:{timerSecs}
              </Card.Text>
            ) : (
              <Card.Text style={{ color: "red" }}>Times expired..</Card.Text>
            )}
            <Card.Text>฿{price}</Card.Text>
            {location.pathname == "/Profile" && auth.currentUser.uid == merchantID && (
              <Button
                className="btn btn-danger float-end"
                onClick={() => deleteProduct()}
              >
                Delete
              </Button>
            )}
          </Card.Body>
        </Card>
      </CardGroup>
    </div>
  );
};

export default ProductCard;
