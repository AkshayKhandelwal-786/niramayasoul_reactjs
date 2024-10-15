import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import axiosConfig from "../services/axiosConfig";
import { Link, useLocation } from "react-router-dom";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
function Wellness() {
  const [loading, setLoading] = useState(true); // For loading state


  const [popularBrands, setPopularBrands] = useState([]);
  const [popularPicks, setPopularPicks] = useState([]);
  const [wellness_package, setWellnessPackage] = useState([]);

  useEffect(() => {
    // Prioritize loading Popular Picks first, then load the rest in parallel
    const fetchPopularPicks = async () => {
      try {
        const popularPicksResponse = await axiosConfig.get("/medicines/popular_picks");
        setPopularPicks(popularPicksResponse.data.data);
      } catch (error) {
        console.error("Error loading popular picks:", error);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        const [popularBrandsResponse, wellnessPackageResponse] = await Promise.all([
          axiosConfig.get("/brands/popular_brands"),
          axiosConfig.get("/packages/wellness_package"),
        ]);

        setPopularBrands(popularBrandsResponse.data.data);
        setWellnessPackage(wellnessPackageResponse.data.data);
      } catch (error) {
        console.error("Error loading additional data:", error);
      } finally {
        setLoading(false); // Ensure loading is false after all calls are done
      }
    };

    // First, load Popular Picks
    fetchPopularPicks().then(() => {
      // Once popular picks are fetched, start loading the rest in parallel
      fetchAdditionalData();
    });
  }, []); // Dependency array to run effect only once

  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="wellness" />
      <section className="pt-0 pb-90">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="card-fisrt card-width">
                <span>Expert Medical Advice</span>
                <h3>Consult with Top Doctors Anytime, Anywhere</h3>

                <Link className="btn-prodcut btn-medi" to={"/doctors"} reloadDocument>
                  Consult Now
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-fisrt card-width ultimate">
                <span>Convenient Medicine Shopping</span>
                <h3>Get Your Prescriptions Delivered to Your Doorstep</h3>

                <Link className="btn-prodcut btn-medi" to={'/pharmacy'}>
                  Shop Now
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-fisrt card-width chronic">
                <span>Reliable Lab Testing</span>
                <h3>Accurate Results from the Comfort of Your Home</h3>

                <Link className="btn-prodcut btn-medi" to={'/pathology'}>
                  Book Now
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="pt-0 pb-90">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="card-fisrt card-width trangender">
                <span>Beyond the Binary </span>
                <h3>Exploring Transgender Experiences</h3>

                <Link
                  className="btn-prodcut btn-medi"
                  to={`/wellness/exploring-transgender-experiences`} reloadDocument
                >
                  Read More
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-fisrt card-width trangender trangender2">
                <span>Uncover AIDS essentials </span>
                <h3>Understanding AIDS A Comprehensive Guide</h3>

                <Link
                  className="btn-prodcut btn-medi"
                  to={`/wellness/aids-compressive-guide`} reloadDocument
                > 
                  Read More
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
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
                          src="img/arrow-black.svg"
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
        </div>
      </section>
      <section className="pt-0">
        <div className="container">
          <div className="row mx-0">
            <div className="col-lg-12 bg-img1">
              <div className="row">
                <div className="col-lg-6">
                  <div className="book-consultant">
                    <h3>Book a Consultation with Our Doctors</h3>
                    <p>
                      we make it easy for you to access top-tier medical care by
                      allowing you to book appointments with our highly
                      qualified doctors.
                    </p>
                    <Link to={`/hiv-art`} reloadDocument>Book Now</Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="consultant-img">
                    <img className="img-fluid" src="img/doctor.png" alt="" />
                    <img
                      className="sign-doc img-fluid"
                      src="img/doc-sign.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="position-relative pt-0">
        <img className="dotleft" src="img/dots-left.svg" alt="" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Test & Packages</span>
                <h2 className="pb-0">Health Test & Packages</h2>
              </div>
            </div>
          </div>
          <div className="row gy-lg-4 gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
            {wellness_package &&
              wellness_package.map((wellness) => (
                <div className="col-lg-4 col-md-6 d-flex" key={wellness.id}>
                  <div className="test-main w-100">
                    <div className="d-flex mb-20">
                      <div className="img-group">
                        {/* Dynamically load image from API response or a fallback image */}
                        <img
                          src={"/img/checkup.png"}
                          alt={wellness.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="text-total">
                        {/* Dynamic Package Name */}
                        <h3>{wellness.name}</h3>
                        {/* Example Requirement or description - Update based on real data */}
                        <p>
                          {wellness.requirement || "Includes various tests"}
                        </p>
                        {/* Assuming report time is static; update as needed */}
                        <span>Reports in 24 hrs</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-16">
                      <div className="tot-price">
                        {/* Display "Top Deal" only if there's a discount */}
                        {wellness.actual_price !== wellness.selling_price && (
                          <span>Top Deal</span>
                        )}
                        <div className="price-amount">
                          <p className="mb-0">
                            {/* Dynamic Pricing: Show selling price and MRP if different */}
                            <span className="pricefix">
                              ₹{wellness.selling_price || wellness.actual_price}
                            </span>
                            {wellness.actual_price &&
                              wellness.selling_price &&
                              wellness.actual_price !== wellness.selling_price && (
                                <>
                                  <span className="price-delete">
                                    <del>(₹{wellness.actual_price})</del>
                                  </span>
                                  <span className="off">
                                  ({wellness.discount}% off)
                                    
                                  </span>
                                </>
                              )}
                          </p>
                        </div>
                      </div>
                      {/* Add button - implement logic as needed */}
                      <Link
                        className="add-btn"
                        to={`/pathology/packages/details/${toSlug(
                          wellness.name
                        )}`}
                        state={{ packageId: wellness.id }}
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="card-footers">
                      <div className="footer-img">
                        {/* Dynamic Lab Image */}
                        <img
                          src={
                            wellness.lab.image_url || "/img/round-health.png"
                          }
                          alt={wellness.lab.name}
                          className="img-fluid"
                        />
                      </div>
                      {/* Dynamic Lab Name */}
                      <span>By {wellness.lab.name || "Partnered Lab"}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <section className="pt-0 pb-90">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="card-fisrt card-width empower">
                <span>Empower your health </span>
                <h3>Empower Health: Join Our Medical Awareness Program</h3>

                <Link 
                  className="btn-prodcut btn-medi"
                  to={`/wellness/empower-health`} reloadDocument
                >
                  Get Details & Join Now
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-fisrt card-width empower empower2">
                <span>PrEP for HIV Prevention </span>
                <h3>Stay Protected with Pre-Exposure Prophylaxis</h3>

                <Link className="btn-prodcut btn-medi" to={`/prep-pep`} reloadDocument>
                  Know More About PrEP 
                  <img src="/img/arrow-black.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-60">
                <span className="text-uppercase">Medicines</span>
                <h2 className="p-0">Popular Picks For You</h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-5 g-4 mb-2">
            {popularPicks.map((pPicks) => (
              <div className="col" key={pPicks.id}>
                <div className="h-100 d-flex flex-column">
                  {" "}
                  {/* Ensure the card takes equal height */}
                  <Link
                    to={`/pharmacy/product/${toSlug(pPicks.medicine.name)}`}
                    state={{ piD: pPicks.medicine.id }}
                  >
                    <div className="prduct-card pharmacy-image">
                      <img
                        className="img-fluid w-100"
                        src={pPicks.medicine.images}
                        alt={pPicks.medicine.name} // Adding alt text for better accessibility
                      />
                    </div>
                  </Link>
                  <div className="product-dis flex-grow-1 d-flex flex-column">
                    <span>{pPicks.medicine.brand.name}</span>
                    <p>{pPicks.medicine.name}</p>
                    <div className="price mt-auto">
                    <p>
                        ₹{pPicks.medicine?.new_price || pPicks.medicine?.approx_mrp}
                        {pPicks.medicine?.new_price && (
                          <span>
                            <del> MRP ₹{pPicks.medicine?.approx_mrp}</del>
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      className="cart-btn mt-auto"
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
    </Layout>
  );
}

export default Wellness;
