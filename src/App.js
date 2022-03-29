import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Singin from "./components/Signin";
import Singup from "./components/Signup";
import Products from "./components/Products";
import ProductPage from "./components/Product";
import Profile from "./components/Profile";
import Navbar from "./components/NavbarComp";
import "firebase/firestore";
import "firebase/auth";
import AuthContextProvider, { useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container,} from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
        <Navbar></Navbar>
        <Container>
            <Routes>
              <Route path="/" element={<Products></Products>}></Route>
              <Route path="/Profile/" element={<Profile/>}></Route>
              <Route path="/Signin" element={<Singin/>}></Route>
              <Route path="/Signup" element={<Singup/>}></Route>
              <Route path="/Product/*" element={<ProductPage></ProductPage>}></Route>
            </Routes>
        </Container>
          </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
