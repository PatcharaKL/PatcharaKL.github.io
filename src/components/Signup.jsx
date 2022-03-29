import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Col,
  Container,
  Row,
  Form,
  fieldset,
  Button,
  FloatingLabel,
  FormGroup,
  FormControl,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useMounted from "../Hooks/useMounted";
import { auth, db } from "../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser, register, signInWithGoogle } = useAuth();

  const navigate = useNavigate();
  const mounted = useMounted();
  return (
    <Row>
      <Col lg={{ span: 6, offset: 3 }}>
        <div className="p-5">
          <h3 className="mb-3" style={{ color: "#432f2f", fontWeight: "bold" }}>
            Register
          </h3>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              register(email, password)
                .then(async () => {
                  const Curenuser = auth.currentUser;
                  await setDoc(
                    doc(db, "data", `${Curenuser.uid}`),
                    {
                      name: name,
                      img: "https://media.istockphoto.com/vectors/male-profile-icon-white-on-the-blue-background-vector-id470100848?k=20&m=470100848&s=612x612&w=0&h=ZfWwz2F2E8ZyaYEhFjRdVExvLpcuZHUhrPG3jOEbUAk=",
                    },
                    { merge: true }
                  );
                })
                .then(() =>
                  updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL:
                      "https://media.istockphoto.com/vectors/male-profile-icon-white-on-the-blue-background-vector-id470100848?k=20&m=470100848&s=612x612&w=0&h=ZfWwz2F2E8ZyaYEhFjRdVExvLpcuZHUhrPG3jOEbUAk=",
                  })
                )
                // .then((response) => console.log(response))
                .then(() => navigate(-1))
                .catch((error) => alert(error))
                .finally(() => mounted.current && setIsSubmitting(false));
            }}
          >
            <FormGroup controlId="formName">
              <FormControl
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="mb-3"
                placeholder="Firstname and Lastname"
                required
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="formEmail">
              <FormControl
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mb-3"
                placeholder="Email"
                required
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="formPassword">
              <FormControl
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              ></FormControl>
            </FormGroup>
            {/* <FormGroup controlId="formPhoneNo">
        <FormControl type="text" placeholder="Phone"></FormControl>
      </FormGroup> */}
            <Button
              variant="primary"
              type="submit"
              className="mt-3 col-12"
              style={{ background: "#b14d4d", border: "0px" }}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                ></Spinner>
              )}
              Sign up
            </Button>
          </Form>

          <hr></hr>
          <Button
            onClick={() =>
              signInWithGoogle()
                // .then((user) => console.log(user))
                .then(async () => {
                  const Curenuser = auth.currentUser;
                  await setDoc(
                    doc(db, "data", `${Curenuser.uid}`),
                    {
                      name: Curenuser.displayName,
                      img: Curenuser.photoURL,
                    },
                    { merge: true }
                  );
                })
                .then(() => console.log(currentUser))
                .then(() => navigate("/"))
                .catch((error) => console.log(error))
            }
            variant="outline-danger"
            className="col-12 mt-3"
            style={{ fontWeight: "500" }}
          >
            <img
              style={{ width: "25px" }}
              src="https://icones.pro/wp-content/uploads/2021/02/google-icone-symbole-png-logo-rouge.png"
            />{" "}
            Sign in with Google
          </Button>
          <p className="mt-3">
            Already have an account? <Link to="/Signin">sign in</Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default Signup;
