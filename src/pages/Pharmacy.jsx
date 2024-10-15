import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import axiosConfig from "../services/axiosConfig";
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

function Pharmacy() {
  const [categories, setCategories] = useState([]);
  const [popularPicks, setPopularPicks] = useState([]);
  const [popularBrands, setPopularBrands] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    // Fetch all data in parallel
    const fetchData = async () => {
      try {
        const [
          categoriesResponse,
          popularPicksResponse,
          popularBrandsResponse,
        ] = await Promise.all([
          axiosConfig.get("/medicine_categories"),
          axiosConfig.get("/medicines/popular_picks"),
          axiosConfig.get("/brands/popular_brands"),
        ]);

        setCategories(categoriesResponse.data.data.slice(0, 25));
        setPopularPicks(popularPicksResponse.data.data);
        setPopularBrands(popularBrandsResponse.data.data);
      } catch (error) {
        console.error(error);
        // Optionally, add user notification for errors here
      } finally {
        setLoading(false); // Set loading to false after all API calls are done
      }
    };

    fetchData();
  }, []); // Dependency array to run effect only once

  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="pharmacy" />

      <section className="position-relative">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-60">
                <span className="text-uppercase">Medicines</span>
                <h2 className="pb-0">Popular Picks For You</h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-4 mb-2">
            {popularPicks.map((pPicks) => (
              <div className="col" key={pPicks.id}>
                <div className="h-100 d-flex flex-column">
                  {" "}
                  {/* Ensure the card takes equal height */}
                  <Link
                    to={`/pharmacy/product/${toSlug(pPicks.medicine.name)}`}
                    state={{ piD: pPicks.medicine.id }}
                    className=""
                  >
                    <div className="prduct-card pharmacy-image">
                      <img
                        className="img-fluid w-100"
                        src={pPicks.medicine.images}
                      />
                    </div>
                  </Link>
                  <div className="product-dis flex-grow-1 d-flex flex-column">
                    <span>{pPicks.medicine.brand.name}</span>
                    <p>{pPicks.medicine.name}</p>
                    <div className="price mt-auto">
                      <p>
                        ₹
                        {pPicks.medicine?.new_price ||
                          pPicks.medicine?.approx_mrp}
                        {pPicks.medicine?.new_price && (
                          <span>
                            <del> MRP ₹{pPicks.medicine?.approx_mrp}</del>
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      className="cart-btn  mt-auto"
                      to={`/pharmacy/product/${toSlug(pPicks.medicine.name)}`}
                      state={{ piD: pPicks.medicine.id }}
                    >
                      <img src="/img/btnc.svg" alt="Add to cart" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="row">
            <div className="col-lg-12 text-center">
              <a className="btn-more btn-load-more" href="#">
                Load More
              </a>
            </div>
          </div> */}
        </div>
      </section>

      <section className="pt-0">
        <img className="dotleft" src="img/dots-left.svg" alt="" />

        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Shop</span>
                <h2 className="pb-0">Shop by category</h2>
              </div>
            </div>
          </div>
          <div className="row gy-lg-5 gy-4 row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-8">
            {categories.map((category) => (
              <div className="col w-100" key={category.id}>
                <div className="card-with-img h-100">
                  <div className="card-img-product position-relative card-medi h-100">
                    <div className="medi-card position-relative">
                      <img
                        className="img-fluid w-100" // Ensure the image fills the card width
                        src={category.image_url}
                        alt={category.name}
                      />
                    </div>
                    <span>
                      <strong>{category.name}</strong>{" "}
                      {/* Display category name */}
                    </span>
                    <Link
                      to={`/pharmacy/category/${toSlug(category.name)}`}
                      state={{ catID: category.id }}
                      className="stretched-link"
                    ></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Brands</span>
                <h2 className="pb-0">Our Popular Brands</h2>
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
                          style={{ width: "16px", height: "16px" }} // Adjust icon size
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 text-center">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Link className="btn-more btn-load-more" to={'/pharmacy/brands'}>
                  View All Brands
                  <img src="/img/view-arrow.svg" alt="View All" className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </Layout>
  );
}

export default Pharmacy;
