import React, { useState } from "react";
import Layout from "../components/Layout";
import Prep from "./PrepPep/Prep";
import Pep from "./PrepPep/Pep";

function PrepPep() {
  // State to manage the selection
  const [selection, setSelection] = useState("Prep"); // default to "Prep"

  // Handler for dropdown selection change
  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <Layout>
      <div
        className="wellness-banner d-flex align-items-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 99.88%), url('/img/empowerBanner.png')",
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center text-slider text-para">
                <h1>Prep/PEP</h1>
                <p>Stay Protected with Pre-Exposure Prophylaxis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bainary-top">
        <div className="container">
          <div className="row gy-lg-0 gy-4 mb-5">
            <div className="col-lg-12 mx-auto align-items-right">
              <div className="d-lg-flex align-items-center position-relative">



               <div className="d-flex justify-content-between w-100 align-items-center flex-wrap">
               <span className="sortby">
                  <img src="/img/sortby.svg" alt="" />
                  Prep/PEP
                </span>
                <div className="position-relative w-100 w-17">
                  <img
                    className="dropdown-search"
                    src="/img/arrowdown.svg"
                    alt="icon"
                  />
                  <select
                    className="form-control form-cus"
                    value={selection}
                    onChange={handleSelectionChange} // handle selection change
                  >
                    <option value="Prep">Prep</option>
                    <option value="Pep">Pep</option>
                  </select>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditionally render components based on selection */}
          {selection === "Prep" && <Prep />}
          {selection === "Pep" && <Pep />}
        </div>
      </section>
    </Layout>
  );
}

export default PrepPep;
