import React, { useState, useEffect,useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

export const Timer = () => {

  const [timerDays, setTimerDays] = useState();
  const [timerHours, setTimerHours] = useState();
  const [timerMins, setTimerMins] = useState();
  const [timerSecs, setTimerSecs] = useState();

  let interval = useRef();
  const startTimer = () => {
    const countdownDate = new Date('Nov 31 00:00:0000').getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMins(minutes);
        setTimerSecs(seconds);
      }
    }, 500);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });
  return (
      <Container>
       <Row className="mt-3">
              <Col>
                <Row>
                  <Col className="mt-1">
                    <h1
                      style={{
                        width: "auto",
                        color: "#d0011b",
                        background: "#fafafa",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <span
                        style={{
                          color: "gray",
                          fontSize: "1rem",
                          textDecoration: "line-through",
                        }}
                      >
                        ฿730
                      </span>{" "}
                      {1200}⇪
                    </h1>
                  </Col>
                </Row>
                <div
                  style={{
                    marginRight: "auto",
                    marginLeft: "auto",
                    width: "350px",
                    padding: "0.1rem 1.6rem 0.1rem 1.6rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    textAlign: "center",
                    borderBottom: "1.5px solid #d0cccc",
                  }}
                >
                  <section>
                    <p style={{ fontSize: "2rem", marginBottom: "0" }}>
                      {timerDays}
                    </p>
                    <p>
                      <small>Days</small>
                    </p>
                  </section>
                  <span style={{ fontSize: "2rem", marginBottom: "0" }}>:</span>
                  <section>
                    <p style={{ fontSize: "2rem", marginBottom: "0" }}>
                      {timerHours}
                    </p>
                    <p>
                      <small>Hours</small>
                    </p>
                  </section>
                  <span style={{ fontSize: "2rem", marginBottom: "0" }}>:</span>
                  <section>
                    <p style={{ fontSize: "2rem", marginBottom: "0" }}>
                      {timerMins}
                    </p>
                    <p>
                      <small>Minutes</small>
                    </p>
                  </section>
                  <span style={{ fontSize: "2rem", marginBottom: "0" }}>:</span>
                  <section>
                    <p style={{ fontSize: "2rem", marginBottom: "0" }}>
                      {timerSecs}
                    </p>
                    <p>
                      <small>Seconds</small>
                    </p>
                  </section>
                </div>
              </Col>
            </Row>   
      </Container>
 )
      
};
