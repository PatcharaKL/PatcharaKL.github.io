import React, { useState, useEffect } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import ProductCard from "./ProductCard";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Row,
  Image,
  Container,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";

const Store = () => {
  const [productPhoto, setProductPhoto] = useState(
    "https://via.placeholder.com/300x300.png"
  );
  const [productName, setProductName] = useState("");
  const [productDes, setProductDes] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [productDuration, setProductDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const productCollectionRef = query(
    collection(db, "products"),
    where("merchantID", "==", String(auth.currentUser.uid))
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    console.log(date);
    date.setDate(date.getDate() + days);
    console.log(days);
    console.log(date);
    return date;
  };

  let orDate = new Date();
  let upDate = orDate.addDays(parseInt(productDuration));
  let date = ("0" + upDate.getDate()).slice(-2);
  let month = monthNames[upDate.getMonth()];
  let year = upDate.getFullYear();
  let hours = upDate.getHours();
  let minutes = upDate.getMinutes();
  let seconds = upDate.getSeconds();

  useEffect(() => {
    onSnapshot(productCollectionRef, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProductPhoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadFiles = (file) => {
    const folderRef = ref(storage, `/Images/${file.name}`);
    if (!file) return;
    const uploadTask = uploadBytesResumable(folderRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
      }
    );
  };

  function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }
  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  return (
    <>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const file = e.target[0].files[0];
          uploadFiles(file);
          const urlPhoto = await getDownloadURL(
            ref(storage, `/Images/${file.name}`)
          );
          const id = create_UUID();
          var day = new Date();
          var dayStart =
            monthNames[day.getMonth()] +
            " " +
            day.getDate() +
            " " +
            day.getFullYear() +
            " " +
            day.getHours() +
            ":" +
            day.getMinutes() +
            ":" +
            day.getSeconds();
          const addCommaPrice = separator(productPrice);
          await setDoc(doc(db, "products", id), {
            name: productName,
            img: String(urlPhoto),
            pID: id,
            expired: false,
            merchantID: auth.currentUser.uid,
            merchantName: auth.currentUser.displayName,
            merchantIMG: auth.currentUser.photoURL,
            bider: [],
            highestBidID: "",
            highestBidName: "",
            description: productDes,
            currentPrice: addCommaPrice,
            lastPrice: "0",
            auctionStart: dayStart,
            auctionEnd:
              month +
              " " +
              date +
              " " +
              year +
              " " +
              hours +
              ":" +
              minutes +
              ":" +
              seconds,
          });
        }}
      >
        {/* <Modal.Header closeButton> */}
        <Modal.Title>Place your product</Modal.Title>
        {/* </Modal.Header> */}
        {/* <Modal.Body> */}
        <Container>
          <FormGroup controlId="editPhoto" style={{ padding: "20px 100px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <h4 style={{ marginBottom: "40px" }}>Product picture</h4>
              <Image
                alt="product picture"
                src={productPhoto}
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  marginBottom: "30px",
                }}
                rounded
              />
              <ProgressBar now={progress}></ProgressBar>
            </div>
            <FormControl
              type="file"
              placeholder="Name"
              onChange={onImageChange}
              accept=".jpeg,.png,.jpg"
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="formName">
            <Form.Label sm="2">Name :</Form.Label>
            <FormControl
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              className="mb-3"
              placeholder="Product name"
              required
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="formName">
            <Form.Label sm="2">Description :</Form.Label>
            <FormControl
              value={productDes}
              onChange={(e) => setProductDes(e.target.value)}
              as="textarea"
              className="mb-3"
              placeholder="Description"
              style={{ height: "100px" }}
            ></FormControl>
          </FormGroup>
          <Row>
            <Col>
              <FormGroup controlId="formPrice">
                <Form.Label sm="2">Starting price :</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="mb-3" id="inputGroupPrepend">
                    ฿
                  </InputGroup.Text>
                  <FormControl
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    aria-describedby="inputGroupPrepend"
                    type="number"
                    className="mb-3"
                    placeholder="0"
                    required
                  ></FormControl>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="col-4">
              <FormGroup as={Row} controlId="formDate">
                <Form.Label sm="2">Duration :</Form.Label>
                <Col>
                  <Form.Select
                    value={productDuration}
                    onChange={(e) => {
                      setProductDuration(e.target.value);
                    }}
                    as={Col}
                    aria-label="Day"
                  >
                    <option value={1}>1 Days</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={6}>6 Days</option>
                    <option value={7}>7 Days</option>
                  </Form.Select>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mb-3"></Row>
        </Container>
        <Button type="submit" variant="success">
          Start auction!
        </Button>
      </Form>
      {/* -------------------------------------------------------------------------------- */}
      <hr></hr>
      <Row className="mt-1">
        <Col>
          <h3>Your product</h3>
        </Col>
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr)",
        }}
        className="productList"
      >
        {products &&
          products.map((product) => {
            return (
              <div>
                <ProductCard
                  duration={product.auctionEnd}
                  name={product.name}
                  img={product.img}
                  price={product.currentPrice}
                  pID={product.pID}
                  merchantID={product.merchantID}
                ></ProductCard>
              </div>
            );
          })}
          {products === null && <p>Empty..</p>}
      </div>
    </>
  );
};

export default Store;
