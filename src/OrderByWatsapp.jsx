import React from "react";
import { Link, useNavigate } from "react-router-dom";

import useConditionalCSS from "./utils/useConditionalCSS";

function OrderByWatsapp() {
  useConditionalCSS();
  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light shadow-none">
        <div className="container">
          <Link className="navbar-brand logo-image" to="/" reloadDocument>
            <img src="/img/logo.png" alt="NiramayaSoul Logo" />
          </Link>

          <button
            className="navbar-toggler p-0 border-0"
            type="button"
            data-toggle="offcanvas"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="navbar-collapse offcanvas-collapse"
            id="navbarsExampleDefault"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link reloadDocument className="nav-link page-scroll" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link reloadDocument className="nav-link page-scroll" to={"/pharmacy"}>
                  Shop
                </Link>
              </li>
              <li className="nav-item">
                <Link  reloadDocument className="nav-link page-scroll" to={"/about"}>
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link reloadDocument className="nav-link page-scroll" to={"/terms-of-use"}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header id="header" className="header">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-6">
              <div className="text-container" style={{ marginTop: "10px" }}>
                <h1 className="h1-large">NiramayaSoul Order on WhatsApp</h1>
                <a
                  className="btn-solid-lg w-auto"
                  href="https://wa.me/919907433098"
                >
                  WhatsApp us on 9907433098
                </a>
                <a
                  className="btn-solid-lg w-auto"
                  href="https://wa.me/919833873117"
                >
                  WhatsApp us on 9833873117
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="image-container">
                <img
                  className="img-fluid"
                  src="https://images.pexels.com/photos/46924/pexels-photo-46924.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="NiramayaSoul"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="basic-1">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-12">
              <p>
                For millions of people, niramayasoul.com is the trusted and
                familiar home where they know they’ll find a healing touch. It
                connects them with everything they need to take good...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="cards-1">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Guaranteed Delivery</h1>
                  <p>We Guarantee your Order Delivery in 24 Hrs.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Great Discounts</h1>
                  <p>Net discount of 18% on EVERY ORDER.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Authentic Medicines</h1>
                  <p>100 % Authentic Medicines are available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="basic-4">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-7">
              <div className="image-container">
                <img
                  className="img-fluid"
                  src="https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"
                  alt="alternative"
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="text-container">
                <h2>Follow 3 simple steps and get your medicine quickly.</h2>
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>

      <div className="ex-cards-1 pt-3 pb-3">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-12">
              <div className="card bg-none shadow-none">
                <ul className="list-unstyled">
                  <li className="medias">
                    <span className="fa-stack">
                      <span className="fas fa-circle fa-stack-2x"></span>
                      <span className="fa-stack-1x">1</span>
                    </span>
                    <div className="media-body">
                      <h5>Step 01</h5>
                      <p>UPLOAD YOUR PRESCRIPTION on WhatsApp</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card bg-none shadow-none">
                <ul className="list-unstyled">
                  <li className="medias">
                    <span className="fa-stack">
                      <span className="fas fa-circle fa-stack-2x"></span>
                      <span className="fa-stack-1x">2</span>
                    </span>
                    <div className="media-body">
                      <h5>Step 02</h5>
                      <p>Wait for us to VERIFY your Order.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card bg-none shadow-none">
                <ul className="list-unstyled">
                  <li className="medias">
                    <span className="fa-stack">
                      <span className="fas fa-circle fa-stack-2x"></span>
                      <span className="fa-stack-1x">3</span>
                    </span>
                    <div className="media-body">
                      <h5>Step 03</h5>
                      <p>RECEIVE your Order with pretty Discounts</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-new">
        <div className="container container-cus">
          <div className="row">
            <div className="col-lg-12">
              <div className="social-container">
                <span className="fa-stack">
                  <a href="https://m.facebook.com/niramayasoul/">
                    <i className="fas fa-circle fa-stack-2x"></i>
                    <i className="fab fa-facebook-f fa-stack-1x"></i>
                  </a>
                </span>
                <span className="fa-stack">
                  <a href="https://www.twitter.com/">
                    <i className="fas fa-circle fa-stack-2x"></i>
                    <i className="fab fa-twitter fa-stack-1x"></i>
                  </a>
                </span>
                <span className="fa-stack">
                  <a href="https://www.instagram.com/niramayasoul/?utm_medium=copy_link">
                    <i className="fas fa-circle fa-stack-2x"></i>
                    <i className="fab fa-instagram fa-stack-1x"></i>
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="row" style={{ justifyContent: "center" }}>
            <a
              className="btn-solid-lg w-auto"
              href="https://wa.me/919907433098"
            >
              WhatsApp us on 9907433098
            </a>
            &nbsp;&nbsp;
            <a
              className="btn-solid-lg w-auto mt-2 mt-sm-0"
              href="https://wa.me/919833873117"
            >
              WhatsApp us on 9833873117
            </a>
          </div>
        </div>
      </div>

      <div class="copyrights">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <ul className="list-unstyled li-space-lg p-small">
                <li>
                  <Link reloadDocument to="/about">About Us</Link>
                </li>

                <li>
                  <Link to="/terms-of-use" reloadDocument>
                    Terms &amp; Conditions
                  </Link>
                </li>

                <li>
                  <Link to={'/pharmacy'} reloadDocument>Shop</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-6">
              <p className="p-small statement">
                Copyright ©{" "}
                <Link reloadDocument to={'/'}>Niramayasoul</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderByWatsapp;
