import { useEffect, useState } from "react";
import "./App.css";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

function App() {

  const isAdminPage =
    window.location.pathname === "/admin";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("All");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {

    if (isAdminPage) {
      return;
    }

    fetch('{import.meta.env.VITE_API_URL}/api/products')

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();

      })

      .then((data) => {

        setProducts(data);

      })

      .catch((error) => {

        console.error("Error:", error);

      });

  }, [isAdminPage]);


  // =====================================================
  // ADMIN PAGE
  // =====================================================

  if (isAdminPage) {

    const token = localStorage.getItem("adminToken");

    if (!token) {

      return (
        <AdminLogin
          onLogin={() => {
            window.location.reload();
          }}
        />
      );

    }

    return <Admin />;

  }


  // =====================================================
  // SEARCH + STORE FILTER
  // =====================================================

  const filteredProducts = products.filter((product) => {

    const productName =
      product.name?.toLowerCase() || "";

    const productCategory =
      product.category?.toLowerCase() || "";

    const searchText =
      search.toLowerCase();

    const matchesSearch =
      productName.includes(searchText) ||
      productCategory.includes(searchText);

    const matchesStore =
      selectedStore === "All" ||
      product.store === selectedStore;

    return matchesSearch && matchesStore;

  });


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="app">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <div className="logo">

          <span>AFFILO</span>{" "}

          <strong>STORE</strong>

        </div>


        <nav>

          <a href="/">
            Home
          </a>

          <a href="#deals">
            Latest Deals
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            ✨ Best Deals • Best Prices • Best Stores
          </span>


          <h1>

            Find The{" "}

            <span>
              Best Deals
            </span>

          </h1>


          <p>
            Discover amazing products from
            Flipkart, Myntra & Meesho
          </p>


          <div className="search-box">

            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <button>
              Search
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          STORE FILTERS
      ================================================= */}

      <section
        className="stores"
        id="categories"
      >

        <button
          className={
            selectedStore === "All"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedStore("All")
          }
        >
          🛍️ All Products
        </button>


        <button
          className={
            selectedStore === "Flipkart"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedStore("Flipkart")
          }
        >
          🛒 Flipkart
        </button>


        <button
          className={
            selectedStore === "Myntra"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedStore("Myntra")
          }
        >
          👗 Myntra
        </button>


        <button
          className={
            selectedStore === "Meesho"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedStore("Meesho")
          }
        >
          🛍️ Meesho
        </button>

      </section>


      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section
        className="products-section"
        id="deals"
      >

        <div className="products-heading">

          <div>

            <span className="section-label">
              TODAY'S PICKS
            </span>

            <h2>
              🔥 Latest Deals
            </h2>

          </div>


          <span className="product-count">

            {filteredProducts.length} Products

          </span>

        </div>


        {filteredProducts.length === 0 ? (

          <div className="empty-products">

            <div className="empty-icon">
              🔍
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try another search or select a
              different store.
            </p>

          </div>

        ) : (

          <div className="product-grid">

            {filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product._id}
              >

                <div className="product-image-wrapper">

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />


                  {product.discount && (

                    <span className="discount">
                      {product.discount}
                    </span>

                  )}

                </div>


                <div className="product-info">

                  <span className="category-badge">
                    {product.category}
                  </span>


                  <h3>
                    {product.name}
                  </h3>


                  <p className="price">

                    ₹
                    {Number(product.price || 0)
                      .toLocaleString("en-IN")}

                  </p>


                  <p className="store">

                    Available on{" "}

                    <strong>
                      {product.store}
                    </strong>

                  </p>


                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-button"
                  >

                    Buy Now

                    <span>
                      →
                    </span>

                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* =================================================
          CONTACT US
      ================================================= */}

      <section
        id="contact"
        className="contact-section"
      >

        <div className="contact-container">

          <span className="contact-badge">
            💜 STAY CONNECTED
          </span>


          <h2>

            Contact{" "}

            <span>
              Us
            </span>

          </h2>


          <p>
            Follow Affilo Store and stay updated
            with the latest deals and offers!
          </p>


          <div className="contact-buttons">


            {/* FACEBOOK */}

            <a
              href="https://www.facebook.com/share/1EjnTdMbvr/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact facebook-btn"
            >

              <svg
                className="social-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  fill="currentColor"
                  d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.686 4.533-4.686 1.312 0 2.686.235 2.686.235v2.973h-1.514c-1.491 0-1.956.93-1.956 1.885v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                />

              </svg>


              Facebook

            </a>


            {/* INSTAGRAM */}

            <a
              href="#"
              className="btn-contact instagram-btn"
              onClick={(e) =>
                e.preventDefault()
              }
            >

              <svg
                className="social-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  fill="currentColor"
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"
                />

              </svg>


              Instagram

            </a>


            {/* YOUTUBE */}

            <a
              href="https://youtube.com/@being_ishita-official?si=UvsrgiojGXfG854_"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact youtube-btn"
            >

              <svg
                className="social-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  fill="currentColor"
                  d="M23.498 6.186a3.01 3.01 0 0 0-2.117-2.13C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.381.556A3.01 3.01 0 0 0 .502 6.186C0 8.073 0 12 0 12s0 3.927.502 5.814a3.01 3.01 0 0 0 2.117 2.13C4.495 20.5 12 20.5 12 20.5s7.505 0 9.381-.556a3.01 3.01 0 0 0 2.117-2.13C24 15.927 24 12 24 12s0-3.927-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />

              </svg>


              YouTube

            </a>

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <div className="footer-brand">

          <span>
            AFFILO
          </span>{" "}

          STORE

        </div>


        <p>
          © 2026 Affilo Store. All Rights Reserved.
        </p>


        <p className="footer-small">
          Discover • Compare • Shop
        </p>

      </footer>


    </div>

  );

}

export default App;