import "./assets/error.css"
import "./assets/app.css"
export default function Custom404() {
    return (
        <div id="error" className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-xl text-center">
                <img
                    src="/error-404.svg"
                    alt="Not Found"
                    className="mx-auto w-64 mb-8"
                />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">NOT FOUND</h1>
                <p className="text-gray-600 text-lg mb-6">
                    The page you are looking for was not found.
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}