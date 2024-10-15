import React from "react";
import { Link } from "react-router-dom";

function DashboardSubHeader() {
  return (
    <div className="per-info">
      <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-4 g-3">
       
        <Link to="/dashboard/medicines-orders">
        <div className="col">
          <div className="paycard d-flex align-items-center">
            <img src="/img/medic.svg" alt="" />
            <p className="col-lg-4 m-0">Medicine Orders</p>
          </div>
        </div>
        </Link>
        <Link to="/dashboard/doctor-consults">
        <div className="col">
          <div className="paycard d-flex align-items-center">
            <img src="/img/d-consult.svg" alt="" />
            <p className="col-lg-4 m-0">Doctor Consults</p>
          </div>
        </div>
        </Link>
        <Link to="/dashboard/lab-tests">
        <div className="col">
          <div className="paycard d-flex align-items-center">
            <img src="/img/lab-test.svg" alt="" />
            <p className="col-lg-4 m-0">Booked Lab Tests</p>
          </div>
        </div>
        </Link>
        <Link to="/dashboard/package-tests">
        <div className="col">
          <div className="paycard d-flex align-items-center">
            <img src="/img/payment.svg" alt="" />
            <p className="col-lg-6 m-0">Booked Package Tests</p>
          </div>
        </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardSubHeader;
