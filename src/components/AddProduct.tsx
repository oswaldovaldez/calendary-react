import { useState } from "react";
import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cartStore";
import { FaCartPlus, FaSearch } from "react-icons/fa";

function AddProduct() {
  const token = useAuthStore((state) => state.token);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>({
    id: 0,
    name: "",
    price: 0,
    qty: 1,
  });
  const { addItem } = useCartStore();
  const handleAddToCart = (index: number) => {
    const _product = products[index];

    addItem({
      id: _product.id,
      name: _product.name,
      price: product.price == 0 ? _product.price : product.price,
      qty: product.quantity ?? 1,

      type: "",
    });
    setProduct({
      id: 0,
      name: "",
      price: 0,
      quantity: 1,
    });
  };
  const handleSearch = () => {
    // if (search.trim() === "") return;
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
          className="input input-sm"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <button className="btn btn-sm btn-info" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      <div className="mt-4">
        {products.map((prod: any, index: number) => (
          <div
            className="flex flex-row border-b border-gray-400 py-2 align-bottom"
            key={`prod-${index}`}
          >
            <div className="flex-grow gap-1">
              <h3 className="font-bold text-sm">{prod.name}</h3>
              <p>
                Precio:
                <input
                  type="text"
                  defaultValue={prod.price}
                  className="input input-sm"
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
                Cantidad:
                <input
                  type="number"
                  className="input input-sm"
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
            <div className="flex items-end ml-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleAddToCart(index)}
              >
                <FaCartPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddProduct;
