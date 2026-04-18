import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (typeof window !== 'undefined') window.location.reload()
  }

  handleHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: '#0f172a',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              textAlign: 'center',
              padding: 32,
              borderRadius: 24,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span style={{ color: '#ef4444', fontSize: 40, fontWeight: 700 }}>!</span>
            </div>

            <h1 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 700 }}>
              Something went wrong
            </h1>
            <p style={{ margin: '0 0 24px', color: '#94a3b8', lineHeight: 1.6 }}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {this.state.error && (
              <div
                style={{
                  textAlign: 'left',
                  marginBottom: 24,
                  padding: 16,
                  maxHeight: 160,
                  overflow: 'auto',
                  borderRadius: 16,
                  background: '#020617',
                  border: '1px solid rgba(239, 68, 68, 0.14)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: '#f87171',
                    fontSize: 12,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  }}
                >
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
              }}
            >
              <button
                onClick={this.handleRetry}
                style={{
                  minWidth: 140,
                  minHeight: 48,
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: 'none',
                  background: '#f59e0b',
                  color: '#0f172a',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleHome}
                style={{
                  minWidth: 140,
                  minHeight: 48,
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: '1px solid rgba(148, 163, 184, 0.28)',
                  background: 'transparent',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
