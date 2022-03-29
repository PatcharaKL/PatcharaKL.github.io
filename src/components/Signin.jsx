import React, { useRef, useState, useEffect } from "react";
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
import { doc, setDoc } from "@firebase/firestore";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser,login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const mounted = useMounted();
  return (
    <Row>
      <Col lg={{ span: 6, offset: 3 }}>
        <div className="p-5">
          <h3 className="mb-3" style={{ color: "#232a41", fontWeight: "bold" }}>
            Sign in
          </h3>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              login(email, password)
                .then((response) => {
                  console.log(response);
                  navigate(-1);
                })
                .catch((error) => alert(error))
                .finally(()=> mounted.current && setIsSubmitting(false))
            }}
          >
            <FormGroup controlId="formEmail">
              <FormControl
                type="email"
                className="mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="formPassword">
              <FormControl
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              ></FormControl>
            </FormGroup>
            <Button
              variant="primary"
              type="submit"
              className="mt-3 col-12"
              style={{ background: "#31728e", border: "0px" }}
              disabled={isSubmitting}
            >
              { isSubmitting && <Spinner  as='span' animation='grow' size='sm' role='status' aria-hidden="true"></Spinner> }
              Sign in
            </Button>
          </Form>
          <hr></hr>
          <Button
            onClick={() =>
              signInWithGoogle()
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
            Don't have an account? <Link to="/Signup">sign up</Link>
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default Signin;
