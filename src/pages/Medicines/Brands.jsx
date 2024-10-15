import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Slider from "../../components/Slider";
import axiosConfig from "../../services/axiosConfig";
import { Link } from "react-router-dom";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};

function Brands() {
  const [popularBrands, setPopularBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // For current page
  const [brandsPerPage] = useState(10); // Brands per page
  const [hasMore, setHasMore] = useState(true); // Track if there are more brands

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await axiosConfig.get("/brands", {
          params: {
            page: page,
            limit: brandsPerPage, // Specify limit for brands per page
          },
        });

        const newBrands = response.data.data;
        setPopularBrands(newBrands);

        // Check if there are fewer brands than the limit, implying no more data
        if (newBrands.length < brandsPerPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [page]); // Re-fetch brands when page changes

  // Handle page changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="medicines" />

      <section className="py-0 py-50">
        <div className="container">
          <div className="row gy-lg-0 gy-4">
            <div className="col-lg-4 h-100">
              <div className="card-products position-relative card-products-medciane color-background">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Natural Ayurvedic</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/ayurveda-medi.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane color-background womenhealth">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell pinkcolor">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Women Health Products</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/womenhealthpro.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane color-background eyecare">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell blue">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Eye Care Solution</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/eyecarepro.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Brands</span>
                <h2 className="pb-0">Our Brands</h2>
              </div>
            </div>
          </div>
          <div className="row gy-lg-4 gy-4">
            {popularBrands.map((brand) => (
              <div className="col-lg-3 col-md-6 col-12 d-flex" key={brand.id}>
                <div className="d-flex flex-column card-products position-relative light-p card-products-medciane color-purple w-100">
                  <div className="row align-items-center flex-grow-1">
                    <div className="col-12 p-3">
                      <div className="product-text product-med">
                        <h3 className="h5 mb-0 pb-0">{brand.name}</h3>
                      </div>
                    </div>
                    <div className="col-6 d-flex justify-content-center align-items-center">
                      <div className="jarimg jarimgmed p-2">
                        <img
                          className="img-fluid"
                          src={brand.image_url}
                          alt={brand.name}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-6 d-flex justify-content-center align-items-center">
                      <Link
                        className="btn-prodcut btn-medi d-flex justify-content-center align-items-center mt-auto"
                        to={`/pharmacy/brand/${toSlug(brand.name)}`}
                        state={{ brandID: brand.id }}
                        style={{
                          whiteSpace: "nowrap", // Prevents text from wrapping
                          padding: "8px 16px", // Adds padding to fit the content
                          fontSize: "14px", // Ensures the text size is not too large
                        }}
                      >
                        Shop Now
                        <img
                          src="/img/arrow-black.svg"
                          alt="Shop Now"
                          className="ms-2"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination d-flex justify-content-center mt-4 mb-5">
            <button
              className="btn btn-outline-success"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-success ms-2"
              disabled={!hasMore} // Disable Next button if no more brands
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Brands;
