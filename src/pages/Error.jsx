import React from 'react';
import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-4">
        <div className="border border-3 border-danger"></div>
        <div className="card bg-white shadow p-5">
          <div className="mb-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75"
                 fill="currentColor" className="bi bi-x-circle text-danger" viewBox="0 0 16 16" style={{ color: "red" }}>
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <div className="text-center">
            <h1> Oops! </h1>
            <p>Something went wrong. Please try again later.</p>
            <Link to={'/'} className="btn btn-outline-danger">Back Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
