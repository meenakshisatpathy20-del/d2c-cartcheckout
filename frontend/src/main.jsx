import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { CheckoutProvider } from "./context/CheckoutContext.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "40px",
            background: "#fff7ed",
            fontFamily: "Arial, sans-serif"
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#dc2626",
                fontSize: "28px"
              }}
            >
              D2C Mall Runtime Error
            </h1>

            <p
              style={{
                color: "#475569",
                marginTop: "12px"
              }}
            >
              A component crashed while rendering the application.
            </p>

            <pre
              style={{
                marginTop: "24px",
                background: "#0f172a",
                color: "#f8fafc",
                padding: "20px",
                borderRadius: "14px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6
              }}
            >
              {this.state.error?.stack ||
                this.state.error?.message ||
                String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </CartProvider>
    </ErrorBoundary>
  </React.StrictMode>
);