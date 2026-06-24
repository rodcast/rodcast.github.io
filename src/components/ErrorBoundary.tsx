import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/** Error boundary */
class ErrorBoundary extends Component<Props, State> {
  /** Initialize error boundary */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /** Update state when error occurs */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /** Handle caught errors */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  /** Render error UI or children */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="my-4 rounded-[4px] border border-[#f87171] bg-[#fef2f2] p-4 text-[#991b1b] dark:border-[#dc2626] dark:bg-[#2d1b1b] dark:text-[#fca5a5]"
        >
          <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
          <p className="m-0 text-sm leading-[1.5]">
            We&apos;re sorry, but there was an error loading this content.
            Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2 text-sm">
              <summary className="mb-2 cursor-pointer font-semibold hover:underline">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded-[4px] bg-[#f3f4f6] p-2 text-[12px] leading-[1.4] whitespace-pre-wrap break-words [font-family:'Courier_New',monospace] dark:bg-[#374151] dark:text-[#d1d5db]">
                {this.state.error.message}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
