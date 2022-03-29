import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Col,
  Container,
  Row,
  Button,
  Image,
  FormGroup,
  Form,
  Modal,
} from "react-bootstrap";
import "./Form.css";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  arrayUnion,
} from "@firebase/firestore";
import { auth, db } from "../firebase-config";
import { useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Product = () => {
  const { currentUser } = useAuth();
  const [productName, setProductName] = useState();
  const [productCurrentPrice, setProductCurrentPrice] = useState();
  const [productPreviousPrice, setProductPreviousPrice] = useState();
  const [productDuration, setProductDuration] = useState();
  const [productImg, setProductImg] = useState();
  const [productDes, setProductDes] = useState();
  const [merchantName, setMerchantName] = useState();
  const [highestBidID, sethighestBidID] = useState();
  const [merchantID, setMerchantID] = useState();
  const [highestBidName, sethighestBidName] = useState();
  const [merchantImg, setMerchantImg] = useState();
  const [timerDays, setTimerDays] = useState("--");
  const [timerHours, setTimerHours] = useState("--");
  const [timerMins, setTimerMins] = useState("--");
  const [timerSecs, setTimerSecs] = useState("--");
  const [inputPrice, setInputPrice] = useState();
  const [showBidInput, setShowBidInput] = useState();
  const handleClose = () => setShowBidInput(false);
  const handleShow = () => setShowBidInput(true);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  let interval = useRef();
  const startTimer = () => {
    const countdownDate = new Date(productDuration).getTime();
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
        clearInterval(interval);
      } else {
        setTimerSecs(seconds);
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMins(minutes);
      }
    }, 1000);
  };
  
  useEffect(() => {
    onSnapshot(doc(db, "products", id), (snapshot) => {
      setProductName(snapshot.data().name);
      setProductCurrentPrice(snapshot.data().currentPrice);
      setProductPreviousPrice(snapshot.data().lastPrice);
      setProductDuration(snapshot.data().auctionEnd);
      setProductImg(snapshot.data().img);
      setProductDes(snapshot.data().description);
      setMerchantName(snapshot.data().merchantName);
      setMerchantImg(snapshot.data().merchantIMG);
      sethighestBidID(snapshot.data().highestBidID);
      sethighestBidName(snapshot.data().highestBidName);
      setMerchantID(snapshot.data().merchantID);
    });
    startTimer();
    return () => {
      clearInterval(interval);
    };
  });

  function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

  const bidHandler = async () => {
    const docRef = doc(db, "products", id);
    const addCommaPrice = separator(inputPrice);
    const newField = {
      currentPrice: addCommaPrice,
      highestBidID: auth.currentUser.uid,
      highestBidName: auth.currentUser.displayName,
      lastPrice: productCurrentPrice,
      bider: arrayUnion(auth.currentUser.uid),
    };
    if (parseInt(inputPrice) > parseInt(productCurrentPrice)) {
      console.log(productCurrentPrice);
      console.log(inputPrice);
      await updateDoc(docRef, newField);
    } else {
      alert("your bid must higher than current bid");
    }
  };
  const checkIfNaN = () => {
    if (isNaN(timerDays) &&
      isNaN(timerHours) &&
      isNaN(timerMins) &&
      isNaN(timerSecs)) {
      return true;
    } else {
      return false;
    }
  };
  console.log(timerDays)
  return (
    <div>
      <Container>
        <Row
          style={{ background: "white", borderRadius: "5px", padding: "1rem" }}
          className="mt-3"
        >
          <span style={{ fontSize: "2rem", fontWeight: "500" }}>
            {productName}
          </span>
          <hr></hr>
          <Col style={{ background: "", textAlign: "center" }}>
            <div>
              <Image
                style={{
                  width: "80%",
                  height: "480px",
                  objectFit: "cover",
                  marginBottom: "5px",
                }}
                fluid
                thumbnail
                src={productImg}
              ></Image>
            </div>
          </Col>
          <Col>
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
                        {productPreviousPrice}
                      </span>{" "}
                      ฿{productCurrentPrice}⇪{""}
                      <span
                        style={{
                          color: "gray",
                          fontSize: "1rem",
                        }}
                      >
                        {!checkIfNaN() &&
                          highestBidID !== "" && (
                            <span style={{ color: "green" }}>
                              {highestBidName} is highest bid
                            </span>
                          )}
                      </span>
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
                  className="mt-4"
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
            {checkIfNaN() && (
              <h3
                className="mt-3"
                style={{ textAlign: "center", color: "red" }}
              >
                Auction is over..
              </h3>
            )}
            {merchantID !== auth.currentUser.uid && !checkIfNaN() && (
              <Row style={{ textAlign: "center" }} className="mt-5">
                <Col></Col>
                <Col>
                  <Button
                    onClick={handleShow}
                    style={{ height: "45px", width: "200px"}}
                  >
                    ประมูลตอนนี้
                  </Button>
                </Col>
                <Col></Col>
              </Row>
            )}
            {merchantID !== auth.currentUser.uid &&
              checkIfNaN() &&
              highestBidID !== "" && (
                <h3
                  className="mt-3"
                  style={{ textAlign: "center", color: "green" }}
                >
                  {highestBidName} has the highest bid!
                </h3>
              )}
            <Row>
              <Modal show={showBidInput} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>ประมูลตอนนี้</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group
                      as={Row}
                      className="mb-3 mt-4"
                      controlId="formName"
                    >
                      <Form.Label column sm="2">
                        Price :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="number"
                          className="mb-3"
                          placeholder="price"
                          value={inputPrice}
                          onChange={(e) => setInputPrice(e.target.value)}
                          required
                        />
                      </Col>
                    </Form.Group>
                    <div className="float-end">
                      <Button
                        className="me-1"
                        variant="secondary"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          bidHandler();
                          handleClose();
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </Row>
          </Col>
        </Row>
        <Row
          className="mt-5 align-items-center p-3"
          style={{ background: "#fafafa", wordWrap: "break-word" }}
        >
          <Col lg={1}>
            <Image
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
              src={merchantImg}
              alt="merchant image"
              className="ms-4"
              roundedCircle
            ></Image>
          </Col>
          <Col>
            <h5>{merchantName}</h5>
          </Col>
        </Row>
        <Row
          className="mt-5"
          style={{ background: "#fafafa", wordWrap: "break-word" }}
        >
          <h4>Description: </h4>
          <p>{productDes}</p>
        </Row>
      </Container>
    </div>
  );
};

export default Product;
