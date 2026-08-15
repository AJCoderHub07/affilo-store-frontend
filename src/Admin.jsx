import { useEffect, useState } from "react";

function Admin() {
    const handleUnauthorized = (response) => {

        if (response.status === 401) {

            localStorage.removeItem("adminToken");
            window.location.href = "./admin";
            return true;
        }
        return false;
    }

    const emptyForm = {
        name: "",
        image: "",
        price: "",
        discount: "",
        store: "Flipkart",
        category: "",
        affiliateLink: "",
    };

    const [formData, setFormData] = useState(emptyForm);
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [selectedStore, setSelectedStore] = useState("All");


    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch products"
                );
            }

            setProducts(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to load products"
            );

        }

    };


    useEffect(() => {

        fetchProducts();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =====================================================
    // ADD / UPDATE PRODUCT
    // JWT PROTECTED REQUEST
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage(
            editingId
                ? "Updating product..."
                : "Adding product..."
        );

        try {

            // Get JWT token
            const token =
                localStorage.getItem("adminToken");

            // Token missing
            if (!token) {

                throw new Error(
                    "Admin session expired. Please login again."
                );

            }


            const url = editingId
                ? `${import.meta.env.VITE_API_URL}/api/products/${editingId}`
                : `${import.meta.env.VITE_API_URL}/api/products`;

            const method =
                editingId ? "PUT" : "POST";


            const response = await fetch(url, {

                method,

                headers: {

                    "Content-Type": "application/json",

                    // JWT Authorization
                    Authorization: `Bearer ${token}`,

                },

                body: JSON.stringify({

                    ...formData,

                    price: Number(
                        formData.price
                    ),

                }),

            });


            const data =
                await response.json();


            // =================================================
            // TOKEN EXPIRED / INVALID
            // =================================================

            if (response.status === 401) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "adminLoggedIn"
                );

                window.location.href =
                    "/admin";

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Something went wrong"
                );

            }


            // =================================================
            // SUCCESS
            // =================================================

            setMessage(

                editingId

                    ? "✅ Product updated successfully!"

                    : "✅ Product added successfully!"

            );


            resetForm();

            fetchProducts();


        } catch (error) {

            console.error(
                "Product Save Error:",
                error
            );

            setMessage(
                "❌ " + error.message
            );

        }

    };

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = (product) => {

        setEditingId(product._id);

        setFormData({

            name: product.name || "",

            image: product.image || "",

            price: product.price || "",

            discount: product.discount || "",

            store: product.store || "Flipkart",

            category: product.category || "",

            affiliateLink:
                product.affiliateLink || "",

        });

        setMessage(
            "✏️ Editing product..."
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =====================================================
    // DELETE PRODUCT
    // JWT PROTECTED REQUEST
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            // Get JWT token
            const token =
                localStorage.getItem("adminToken");

            if (!token) {

                throw new Error(
                    "Admin session expired. Please login again."
                );

            }


            const response = await fetch(
                `https://affilo-store-backend.onrender.com/api/products/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            const data =
                await response.json();


            // =================================================
            // TOKEN EXPIRED / INVALID
            // =================================================

            if (response.status === 401) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "adminLoggedIn"
                );

                window.location.href =
                    "/admin";

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete product"
                );

            }


            setMessage(
                "🗑️ Product deleted successfully!"
            );

            fetchProducts();


        } catch (error) {

            console.error(
                "Delete Error:",
                error
            );

            setMessage(
                "❌ " + error.message
            );

        }

    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            ...emptyForm,
        });

        setEditingId(null);

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmLogout) {
            return;
        }


        // Remove login status
        localStorage.removeItem(
            "adminLoggedIn"
        );

        // Remove JWT token
        localStorage.removeItem(
            "adminToken"
        );


        window.location.href =
            "/admin";

    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalProducts =
        products.length;


    const flipkartCount =
        products.filter(
            (product) =>
                product.store === "Flipkart"
        ).length;


    const myntraCount =
        products.filter(
            (product) =>
                product.store === "Myntra"
        ).length;


    const meeshoCount =
        products.filter(
            (product) =>
                product.store === "Meesho"
        ).length;


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredProducts =
        products.filter((product) => {

            const searchText =
                search.toLowerCase();


            const matchesSearch =

                product.name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                product.category
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesStore =
                selectedStore === "All" ||
                product.store === selectedStore;


            return (
                matchesSearch &&
                matchesStore
            );

        });


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="admin-dashboard">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="admin-header">

                <div>

                    <h1>

                        <span className="admin-brand">
                            AFFILO STORE
                        </span>

                        <small>
                            Admin Dashboard
                        </small>

                    </h1>


                    <p>
                        Manage your affiliate products
                    </p>

                </div>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>



            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="admin-stats">


                <div className="stat-card">

                    <span className="stat-icon">
                        📦
                    </span>

                    <div>

                        <p>
                            Total Products
                        </p>

                        <h2>
                            {totalProducts}
                        </h2>

                    </div>

                </div>



                <div className="stat-card">

                    <span className="stat-icon">
                        🛒
                    </span>

                    <div>

                        <p>
                            Flipkart
                        </p>

                        <h2>
                            {flipkartCount}
                        </h2>

                    </div>

                </div>



                <div className="stat-card">

                    <span className="stat-icon">
                        👗
                    </span>

                    <div>

                        <p>
                            Myntra
                        </p>

                        <h2>
                            {myntraCount}
                        </h2>

                    </div>

                </div>



                <div className="stat-card">

                    <span className="stat-icon">
                        🛍️
                    </span>

                    <div>

                        <p>
                            Meesho
                        </p>

                        <h2>
                            {meeshoCount}
                        </h2>

                    </div>

                </div>


            </section>



            {/* =================================================
                ADD / EDIT PRODUCT
            ================================================= */}

            <section className="admin-form-section">


                <div className="section-heading">

                    <h2>

                        {editingId
                            ? "Edit Product"
                            : "Add New Product"}

                    </h2>


                    <p>

                        {editingId
                            ? "Update product information"
                            : "Add a new affiliate product"}

                    </p>

                </div>



                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >


                    {/* PRODUCT NAME */}

                    <label htmlFor="name">
                        Product Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />



                    {/* IMAGE */}

                    <label htmlFor="image">
                        Product Image URL
                    </label>

                    <input
                        id="image"
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Paste image URL"
                        required
                    />



                    {/* PRICE */}

                    <label htmlFor="price">
                        Price
                    </label>

                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                        required
                    />



                    {/* DISCOUNT */}

                    <label htmlFor="discount">
                        Discount
                    </label>

                    <select
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Discount
                        </option>

                        <option value="5% OFF">
                            5% OFF
                        </option>

                        <option value="10% OFF">
                            10% OFF
                        </option>

                        <option value="15% OFF">
                            15% OFF
                        </option>

                        <option value="20% OFF">
                            20% OFF
                        </option>

                        <option value="25% OFF">
                            25% OFF
                        </option>

                        <option value="30% OFF">
                            30% OFF
                        </option>

                        <option value="35% OFF">
                            35% OFF
                        </option>

                        <option value="40% OFF">
                            40% OFF
                        </option>

                        <option value="45% OFF">
                            45% OFF
                        </option>

                        <option value="50% OFF">
                            50% OFF
                        </option>

                        <option value="55% OFF">
                            55% OFF
                        </option>

                        <option value="60% OFF">
                            60% OFF
                        </option>

                        <option value="65% OFF">
                            65% OFF
                        </option>

                        <option value="70% OFF">
                            70% OFF
                        </option>

                        <option value="75% OFF">
                            75% OFF
                        </option>

                        <option value="80% OFF">
                            80% OFF
                        </option>

                        <option value="85% OFF">
                            85% OFF
                        </option>

                        <option value="90% OFF">
                            90% OFF
                        </option>

                        <option value="95% OFF">
                            95% OFF
                        </option>

                        <option value="100% OFF">
                            100% OFF
                        </option>

                    </select>



                    {/* STORE */}

                    <label htmlFor="store">
                        Store
                    </label>

                    <select
                        id="store"
                        name="store"
                        value={formData.store}
                        onChange={handleChange}
                    >

                        <option value="Flipkart">
                            Flipkart
                        </option>

                        <option value="Myntra">
                            Myntra
                        </option>

                        <option value="Meesho">
                            Meesho
                        </option>

                    </select>



                    {/* CATEGORY */}

                    <label htmlFor="category">
                        Category
                    </label>

                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Example: Mobiles"
                        required
                    />



                    {/* AFFILIATE LINK */}

                    <label htmlFor="affiliateLink">
                        Affiliate Link
                    </label>

                    <input
                        id="affiliateLink"
                        type="url"
                        name="affiliateLink"
                        value={formData.affiliateLink}
                        onChange={handleChange}
                        placeholder="Paste your affiliate link"
                        required
                    />



                    {/* SUBMIT */}

                    <div className="form-button-area">

                        <button
                            type="submit"
                            className="add-product-button"
                        >

                            {editingId
                                ? "Update Product"
                                : "Add Product"}

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {

                                    resetForm();
                                    setMessage("");

                                }}
                            >
                                Cancel Edit
                            </button>

                        )}

                    </div>


                </form>



                {message && (

                    <p className="admin-message">
                        {message}
                    </p>

                )}

            </section>



            {/* =================================================
                PRODUCT MANAGEMENT
            ================================================= */}

            <section className="product-management">

                <div className="section-heading">

                    <h2>
                        Product Management
                    </h2>

                    <p>
                        Search, filter and manage your products
                    </p>

                </div>


                {/* SEARCH + STORE FILTER */}

                <div className="admin-controls">

                    <input
                        type="text"
                        placeholder="🔍 Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={selectedStore}
                        onChange={(e) =>
                            setSelectedStore(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Stores
                        </option>

                        <option value="Flipkart">
                            Flipkart
                        </option>

                        <option value="Myntra">
                            Myntra
                        </option>

                        <option value="Meesho">
                            Meesho
                        </option>

                    </select>

                </div>


                {/* PRODUCTS LIST */}

                <div className="admin-products-list">

                    {filteredProducts.length === 0 ? (

                        <div className="no-products">

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Try another search or filter.
                            </p>

                        </div>

                    ) : (

                        filteredProducts.map(
                            (product) => (

                                <div
                                    className="admin-product-card"
                                    key={product._id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />


                                    {/* PRODUCT DETAILS */}

                                    <div className="admin-product-info">

                                        <span className="admin-store-badge">
                                            {product.store}
                                        </span>


                                        <h3>
                                            {product.name}
                                        </h3>


                                        <p className="admin-product-price">

                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>


                                        <p>
                                            Category:{" "}
                                            {product.category}
                                        </p>


                                        {/* DISCOUNT */}

                                        {product.discount && (

                                            <p className="admin-discount">
                                                {product.discount}
                                            </p>

                                        )}


                                        {/* ACTION BUTTONS */}

                                        <div className="admin-product-actions">

                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            </section>


        </div>

    );

}

export default Admin;