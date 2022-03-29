import React, { Fragment, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, } from "react-bootstrap";
import "./Form.css";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import ProductCard from "./ProductCard";

const Products = () => {

  const [products, setProducts] = useState(null);
  const q = query(collection(db, "products"),where('expired', '==', false))
  useEffect( async () => {
      onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
     });
  }, []);
  console.log(products);
  return (
    <Fragment>
      <Carousel className="mb-3 mt-2">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/thTH/Images/originals-fw21-sean_wotherspoon-superstar_black-hp-mh-d_tcm329-793660.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/thTH/Images/atmos-mh-d_tcm329-804692.jpeg"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_1920,w_1920/thTH/Images/H23105-Originals-FW21-adidasmarimekko-educate-clp-mh-large-d_tcm329-725810.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <h3>Product</h3>
      <hr></hr>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr)",
        }}
        className="productList"
      >
        {products &&
          products.map((prod) => {
            return (
              <ProductCard key={prod.pID}
                name={prod.name}
                img={prod.img}
                price={prod.currentPrice}
                duration={prod.auctionEnd}
                pID = {prod.pID}
              ></ProductCard>
            );
          })}
      </div>
    </Fragment>
  );
};
export default Products;
