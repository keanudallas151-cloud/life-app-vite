import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl p-8 max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-3 text-white">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-6">
              We encountered an unexpected error. Don't worry, your data is
              safe.
            </p>

            {this.state.error && (
              <div className="text-left mb-6 p-4 rounded-xl bg-slate-950 overflow-auto max-h-40">
                <p className="text-xs text-red-400 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-all"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleHome}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component } from "react";
import { C } from "../systems/theme";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[Life.] Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: C.skin,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia,serif",
            padding: 32,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "20%",
                background: `linear-gradient(145deg,${C.green},#2d6e42)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 4px 16px rgba(74,140,92,0.3)",
              }}
            >
              <span style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
                l.
              </span>
            </div>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 22,
                fontWeight: 700,
                color: C.ink,
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: C.green,
                border: "none",
                borderRadius: 12,
                padding: "14px 32px",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Georgia,serif",
                boxShadow: "0 3px 14px rgba(74,140,92,0.32)",
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
