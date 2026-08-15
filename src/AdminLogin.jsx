import { useState } from "react";

function AdminLogin({ onLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const response = await fetch(
                "https://affilo-store-backend.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Invalid username or password"
                );

            }


            // Save JWT token
            localStorage.setItem(
                "adminToken",
                data.token
            );


            // Save login status
            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            // Open Admin Dashboard
            onLogin();


        } catch (error) {

            console.error("Login Error:", error);

            setError(
                error.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="admin-login-page">

            <div className="admin-login-box">


                <div className="admin-login-icon">
                    🔐
                </div>


                <div className="login-brand">

                    <span>AFFILO</span> STORE

                </div>


                <h1>
                    Admin Login
                </h1>


                <p className="login-subtitle">
                    Login to manage your products
                </p>


                <form
                    onSubmit={handleLogin}
                    className="admin-login-form"
                >


                    {/* USERNAME */}

                    <div className="login-field">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter username"
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "🔐 Login"
                        }

                    </button>


                </form>


                {/* ERROR */}

                {error && (

                    <p className="login-error">
                        ❌ {error}
                    </p>

                )}


            </div>

        </div>

    );

}

export default AdminLogin;