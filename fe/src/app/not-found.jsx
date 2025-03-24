import "./assets/error.css"
import "./assets/app.css"
export default function Custom404() {
    return (
        <div id="error">
            <div className="error-page container">
                <div className="col-md-8 col-12 offset-md-2">
                    <div className="text-center">
                        <img className="img-error" src="./../../error-404.svg" alt="Not Found"/>
                            <h1 className="error-title">NOT FOUND</h1>
                            <p className='fs-5 text-gray-600'>The page you are looking not found.</p>
                            <a href="/" className="btn btn-lg btn-outline-primary mt-3">Go Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
}