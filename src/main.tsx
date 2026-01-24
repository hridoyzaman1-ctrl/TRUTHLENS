import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ErrorFallback({ error }: { error: any }) {
    return (
        <div className="p-4 bg-red-50 text-red-900 h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="bg-white p-4 rounded shadow text-sm overflow-auto max-w-2xl">
                {error.message}
                {error.stack}
            </pre>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Try Again
            </button>
        </div>
    );
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
    </ErrorBoundary>
);
