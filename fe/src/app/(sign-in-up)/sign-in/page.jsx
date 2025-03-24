"use client"
export default function SigninPage() {
  return (
    <div className="row align-items-center justify-content-center">
      <div id="auth" className="col-lg-5 col-12">
        <div className="auth-left">
          <h1 className="auth-title">Log in.</h1>
          <p className="auth-subtitle mb-5">Log in with your data that you entered during registration.</p>

          <form action="index.html">
            <div className="form-group position-relative has-icon-left mb-4">
              <input type="text" className="form-control form-control-xl" placeholder="Username" />
              <div className="form-control-icon">
                <i className="bi bi-person"></i>
              </div>
            </div>
            <div className="form-group position-relative has-icon-left mb-4">
              <input type="password" className="form-control form-control-xl" placeholder="Password" />
              <div className="form-control-icon">
                <i className="bi bi-shield-lock"></i>
              </div>
            </div>
            <div className="form-check form-check-lg d-flex align-items-end">
              <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault" />
              <label className="form-check-label text-gray-600" htmlFor="flexCheckDefault">
                Keep me logged in
              </label>
            </div>
            <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
          </form>
          <div className="text-center mt-5 text-lg fs-4">
            <p className="text-gray-600">Don't have an account? <a href="/sign-up" className="font-bold">Sign
              up</a>.</p>
            <p><a className="font-bold" href="/forgot-password">Forgot password?</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};