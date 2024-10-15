import React from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";
import DashboardSubHeader from "./DashboardSubHeader";

function MyPaymentMethod() {
  const paymentMethods = [
    { bankName: "ICICI Bank Master Card", cardType: "Master Card", lastDigits: "2323", cardHolder: "David Smith" },
    { bankName: "Axix Bank Credit Card", cardType: "Credit Card", lastDigits: "2323", cardHolder: "David Smith" },
  ];

  return (
    <Layout>
      <nav
        data-mdb-navbar-init
        className="navbar navbar-expand-lg shadow-none bg-white detail-y"
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb gap-3">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li>/</li>
              <li className="breadcrumb-item">
                <a href="#">Payment Methods</a>
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      <section className="py-dashboard">
        <div className="container">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9">
              <DashboardSubHeader />
              <div className="p-info">
                <div className="personal-info mb-4">
                  <h3>Payment Methods</h3>
                  <span>SAVED CARDS</span>
                </div>

                {/* Payment methods list */}
                <div className="card-list">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="card-item p-3 mb-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-1 fw-bold">
                            {method.bankName} XXXX - {method.lastDigits}
                          </p>
                          <p className="mb-0">{method.cardHolder}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-secondary btn-sm">
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* End of payment methods list */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default MyPaymentMethod;
