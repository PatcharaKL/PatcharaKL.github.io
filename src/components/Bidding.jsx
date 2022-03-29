import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { auth, db } from "../firebase-config";
import ProductCard from "./ProductCard";

const Bidding = () => {
  const [products, setProducts] = useState();
  const productCollectionRef = query(
    collection(db, "products"),
    where("bider", "array-contains", String(auth.currentUser.uid))
  );
  useEffect(() => {
    onSnapshot(productCollectionRef, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);
  console.log(products);
  return (
    <div>
      <h3 className="mt-5">Bidding</h3>
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
                ></ProductCard>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Bidding;
