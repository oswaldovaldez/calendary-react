import React, { useState } from "react";
import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cartStore";

function AddProduct() {
  const token = useAuthStore((state) => state.token);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>({
    id: 0,
    name: "",
    price: 0,
    quantity: 1,
  });
  const { addItem } = useCartStore();
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  };
  const handleSearch = () => {
    Api.readProducts({
      _token: `${token}`,
      query: {
        search: search,
      },
    })
      .then((res) => {
        setProducts(res.data);
        console.log(res);
        setSearch("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col justify-around">
      <div className="flex flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border border-gray-300 rounded-md p-2 flex-grow"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <button className="btn btn-info" onClick={handleSearch}>
          Buscar
        </button>
      </div>
      <div className="mt-4">
        {products.map((prod: any) => (
          <div className="flex flex-row">
            <div className="flex-grow">
              <h3 className="font-bold">{prod.name}</h3>
              <p>
                Precio:{" "}
                <input
                  type="text"
                  value={prod.pice}
                  onChange={(e) => {
                    setProduct({
                      id: prod.id,
                      name: prod.name,
                      quantity: product.quantity,
                      price: parseFloat(e.target.value),
                    });
                  }}
                />
              </p>
              <p>
                Cantidad:{" "}
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => {
                    setProduct({
                      id: prod.id,
                      name: prod.name,
                      price: product.price,
                      quantity: parseInt(e.target.value),
                    });
                  }}
                />
              </p>
            </div>
            <div className="flex items-center">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddProduct;
