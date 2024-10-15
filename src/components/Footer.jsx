import React from 'react';
import { Link } from 'react-router-dom';

import ScrollToTopLink from '../utils/ScrollToTopLink';
function Footer() {
  return (
    <>
      <footer className="text-center text-lg-start bg-body-tertiary text-muted">
        <section className="footer">
          <div className="container text-start text-md-start">
            <div className="row mt-3 gy-3 gy-sm-4 g-lg-0">
              <div className="col-md-6 col-lg-4 col-xl-4 mx-lg-auto footer-dis">
                <a className="mb-28" href="#"><img src="/img/footer-logo.svg" alt=""/></a>
                <p>
                For millions of people, niramayasoul.com is the trusted and familiar home where they know they’ll find a healing touch. It connects them with everything they need to take good... 
                </p>

                <div className="d-flex">
                  <span>Follow Us</span>
                  <div className="social-media">
                    <ul className="list-unstyled d-flex gap-2 ms-2">
                      <li><a href="https://m.facebook.com/NiramayaSoul-106382361743015/" target="_blank" rel="noopener noreferrer"><img src="/img/facebook.svg" alt="Facebook"/></a></li>
                      <li><a href="https://instagram.com/niramayasoul?utm_medium=copy_link" target="_blank" rel="noopener noreferrer"><img src="/img/instagram.svg" alt="Instagram"/></a></li>
                      <li><a href="#"><img src="/img/twitter.svg" alt="Twitter"/></a></li>
                      <li><Link to={"/order-by-whatsapp"} target="_blank" rel="noopener noreferrer"><img src="/img/whatsapp.svg" alt="WhatsApp"/></Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-2 col-xl-2 mx-lg-auto list-text">
                <h6 className="text-capitalize fw-bold font-s mb-4">Quick Links</h6>
                <p><Link to="/" className="text-reset" reloadDocument>Home</Link></p>
                <p><Link to="/doctors" reloadDocument className="text-reset">Doctor</Link></p>
                <p><Link to="/wellness" reloadDocument className="text-reset">Wellness</Link></p>
                <p><Link to="/pharmacy" reloadDocument className="text-reset">Pharmacy</Link></p>
                <p><Link to="/pathology" reloadDocument className="text-reset">Pathology</Link></p>
                <p><Link to="/prep-pep" reloadDocument className="text-reset">PrEP-PEP</Link></p>
                <p><Link to="/hiv-art" reloadDocument className="text-reset">HIV-ART</Link></p>
              </div>

              <div className="col-md-6 col-lg-2 col-xl-2 mx-lg-auto list-text">
                <h6 className="text-capitalize fw-bold font-s mb-4">Help & Support</h6>
                <p><Link to="/cancellation-refund" reloadDocument className="text-reset">Cancellation & Refund</Link></p>
                <p><Link to="/policies" reloadDocument  className="text-reset">Policies</Link></p>
                <p><Link to="/terms-of-use" reloadDocument className="text-reset">Terms of Use</Link></p>
                <p><Link to="/shipping-policy" reloadDocument className="text-reset">Shipping Policy</Link></p>
                <p><Link to="/signup" reloadDocument className="text-reset">Become Consultant</Link></p>
                <p><Link to="https://niramayasoul.com//Form_MGT_7A_H27%20to%20upload.pdf" target="_blank" className="text-reset">Form MGT 7A H27</Link></p>
              </div>

              <div className="col-md-6 col-lg-3 col-xl-3 mx-lg-auto mb-md-0 list-text">
                <h6 className="text-capitalize fw-bold font-s mb-4">Contact Details</h6>
                <div className="d-flex align-items-start space-icons">
                  <img src="/img/email.svg" alt="Email"/>
                  <p><span className="mb-0">customer@niramayasoul.com</span></p>
                </div>
                
                <div className="d-flex align-items-start space-icons">
                  <img src="/img/call-footer.svg" alt="Call"/>
                  <p><span className="mb-0">+91 9907433098</span></p>
                </div>
                <div className="d-flex align-items-start space-icons">
                  <img src="/img/location.svg" alt="Location"/>
                  <p><span className="mb-0">D-402, Regal Complex, Vasai East, Vasai, Maharashtra 401208</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="copyright py-4">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="text-lg-start text-center">
                  <p>Copyright © 2024, Niramaya Soul</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="text-lg-end text-center text-end-color">
                  {/* <p>Todays Patient: 4398</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
