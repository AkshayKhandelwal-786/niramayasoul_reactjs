import React from 'react';

function Investors() {
  return (
    <section className="pt-0 position-relative" style={{ paddingTop: '10px' }}>
      <img className="right-tile-card" src="/img/dots.svg" alt="Decorative dots" />
      <div className="container" style={{ paddingTop: '0' }}>
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="heading text-center mb-30"> {/* Reduced margin-bottom */}
              <h2 className="pb-0">Our Investor</h2>
            </div>
          </div>
        </div>
        <div className="row gy-lg-auto gy-4 align-items-center d-flex justify-content-center">
          <div className="col-lg-3">
            <div className="card-inveters mx-auto" style={{ marginTop: '10%', paddingTop: '10%' }}>
              <div className="profile">
                <img className="img-fluid w-100" src="/img/investor/StofferAnkoNorder.png" alt="Stoffer Anko Norden" />
              </div>
              <div className="card-in-footer text-center">
                <h3>Stoffer Anko Norden</h3>
                <span>Ex-CEO Booking.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Investors;
