import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Sidebar from './Sidebar'
import DashboardSubHeader from './DashboardSubHeader'

function Offers() {
  const [offers] = useState([
    {
      id: 1,
      title: 'App Exclusive Offer',
      description: '10% OFF on all medicines orders use code:',
      code: 'APP10OFF'
    },
    {
      id: 2,
      title: 'App Exclusive Offer',
      description: '10% OFF on all medicines orders use code:',
      code: 'APP10OFF'
    },
    {
      id: 3,
      title: 'App Exclusive Offer',
      description: '10% OFF on all medicines orders use code:',
      code: 'APP10OFF'
    }
  ])

  // Function to handle copying offer code to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    alert(`Code ${code} copied to clipboard!`)
  }

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
                <a href="#">Offers</a>
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
                  <h3>Offers</h3>
                  <span>Below are the offers</span>
                </div>

                {/* Offer List */}
                <div className="card-list">
                  {offers.map((offer) => (
                    <div className="card mb-3" key={offer.id}>
                      <div className="row g-0 align-items-center">
                        <div className="col-md-2">
                          <div className="offer-icon d-flex align-items-center justify-content-center">
                            <img src={`/img/offerIcon.png`} alt={offer.title} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card-body">
                            <h5 className="card-title">{offer.title}</h5>
                            <p className="card-text">{offer.description}</p>
                          </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-center justify-content-end">
                          <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={() => handleCopy(offer.code)}>
                              Code: {offer.code}
                            </button>
                            <button className="btn btn-outline-success" onClick={() => handleCopy(offer.code)}>
                              COPY
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* End of Offer List */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Offers
