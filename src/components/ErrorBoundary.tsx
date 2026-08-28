import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in COG Bible App:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('cog_last_read_position_v2');
    } catch (e) {}
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F5EF] text-[#0E1B33] px-6 py-8 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-[#C9A227] flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-[#C9A227]" />
          </div>

          <h1 className="font-serif text-2xl font-bold mb-2">COG (T.J.R) Bible</h1>
          <p className="text-sm text-gray-600 max-w-sm mb-6">
            An unexpected error occurred. Tap below to reload the Holy Scriptures safely.
          </p>

          <button
            onClick={this.handleReload}
            className="px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-serif font-bold text-sm shadow-md hover:bg-[#10203D] active:scale-95 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Bible Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
