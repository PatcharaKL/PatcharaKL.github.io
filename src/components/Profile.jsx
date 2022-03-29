import React, { useState, useEffect } from "react";
import "./Form.css";
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  Image,
  Nav,
  Row,
  Tab,
  Button,
  Spinner,
} from "react-bootstrap";
import Products from "./Products";
import { useAuth } from "../contexts/AuthContext";
import { auth, db, storage } from "../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import Product from "./Product";
import { updateProfile } from "@firebase/auth";
import useMounted from "../Hooks/useMounted";
import Store from "./Store";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Bidding from "./Bidding";

const _currentUser = auth.currentUser;
// console.log(`${_currentUser.photoURL}`)
const Profile = () => {
  const [userName, setUserName] = useState();
  const [userPhoto, setUserPhoto] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(auth.currentUser.displayName);
  const [photo, setPhoto] = useState(auth.currentUser.photoURL);
  const { currentUser } = useAuth();
  const mounted = useMounted();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(URL.createObjectURL(event.target.files[0]));
      console.log(event.target.files[0]);
    }
  };
  const uploadFiles = (file) => {
    const folderRef = ref(storage, `/profile_pic/${file.name}`);
    if (!file) return;
    const uploadTask = uploadBytesResumable(folderRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
      }
    );
  };
  useEffect(() => {
    const getUserProfile = () => {
      setUserName(auth.currentUser.displayName);
      setUserPhoto(auth.currentUser.photoURL);
      setUserEmail(auth.currentUser.email);
    };
    getUserProfile();
  }, []);

  return (
    <div>
      {/* ---------- Tab panel ------------ */}
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <div style={{ textAlign: "center" }}>
              <Image
                src={userPhoto}
                style={{
                  width: "130px",
                  height: "130px",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
                className="mt-5"
                roundedCircle
              />
              <h3>{userName}</h3>
              <p>{userEmail}</p>
            </div>
            <hr></hr>
            <Nav variant="pills" bg='dark' className="flex-column">
              <h5>Profile</h5>
              <Nav.Item>
                <Nav.Link eventKey="first">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Bidding</Nav.Link>
              </Nav.Item>
              <hr></hr>
              <h5>Store</h5>
              <Nav.Item>
                <Nav.Link eventKey="third">Store</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {/* ------- Tab 1 ---------- */}
              <Tab.Pane eventKey="first">
                <Row>
                  <Col
                    style={{ backgroundColor: "white" }}
                    className="p-5 mt-5 col-10 offset-1"
                  >
                    <h3>Edit Profile</h3>
                    <hr></hr>
                    <Form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const file = e.target[1].files[0];
                        uploadFiles(file);
                        const urlPhoto = await getDownloadURL(
                          ref(storage, `/profile_pic/${file.name}`)
                        );
                        updateProfile(auth.currentUser, {
                          displayName: name,
                          photoURL: urlPhoto,
                        })
                          .then(async () => {
                            const userRef = doc(
                              db,
                              "data",
                              auth.currentUser.uid
                            );
                            await updateDoc(userRef, {
                              name: name,
                              img: urlPhoto,
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                          })
                          .then(() => {
                            setUserName(auth.currentUser.displayName);
                            setUserPhoto(auth.currentUser.photoURL);
                          })
                          .finally(
                            () => mounted.current && setIsSubmitting(false)
                          );
                        setIsSubmitting(true);
                      }}
                    >
                      <Form.Group
                        as={Row}
                        className="mb-3 mt-4"
                        controlId="formName"
                      >
                        <Form.Label column sm="2">
                          Name :
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            type="text"
                            className="mb-3"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Col>
                      </Form.Group>
                      <FormGroup
                        controlId="editPhoto"
                        style={{ padding: "20px 100px" }}
                      >
                        <div
                          style={{ textAlign: "center", marginBottom: "10px" }}
                        >
                          <h4 style={{ marginBottom: "40px" }}>
                            Change profile picture
                          </h4>
                          <Image
                            src={photo}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              marginBottom: "30px",
                            }}
                            roundedCircle
                          />
                        </div>
                        <FormControl
                          type="file"
                          placeholder="Name"
                          onChange={onImageChange}
                          accept=".jpeg,.png,.jpg"
                        ></FormControl>
                      </FormGroup>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="col-3 mt-3"
                      >
                        Done
                        {isSubmitting && (
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          ></Spinner>
                        )}
                      </Button>
                    </Form>
                    <hr></hr>
                  </Col>
                </Row>
              </Tab.Pane>
              {/* ------- Tab 2 ---------- */}
              <Tab.Pane eventKey="second">
                <Bidding></Bidding>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <Store></Store>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Profile;
