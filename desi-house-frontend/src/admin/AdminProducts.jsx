import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const { admin, token } = useAdminAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    imageFile: null,
    category: "",
    stock: "",
  });

  // 🔐 Protect route
  useEffect(() => {
    if (!admin || !token) {
      navigate("/admin/login");
    }
  }, [admin, token, navigate]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        setError("You do not have permission to manage products.");
        return;
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Failed to load products");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:5000/api/products/admin/update/${editId}`
      : "http://localhost:5000/api/products/admin/create";

    const method = editId ? "PUT" : "POST";

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("stock", Number(form.stock));

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      } else {
        formData.append("image", form.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 403) {
        alert("You are not allowed to manage products.");
        return;
      }

      alert(editId ? "Product updated successfully" : "Product created successfully");

      setShowForm(false);
      setEditId(null);
      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        imageFile: null,
        category: "",
        stock: "",
      });

      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      ...product,
      imageFile: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/admin/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 403) {
        alert("You are not allowed to delete products.");
        return;
      }

      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="bg-maroon text-white px-4 py-2 rounded mb-6"
      >
        + Add New Product
      </button>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />

          <input
            name="image"
            placeholder="Or Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editId ? "Update Product" : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t text-center">
                <td className="p-2">{p.name}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
