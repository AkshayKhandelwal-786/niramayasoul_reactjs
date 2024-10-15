import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import { Link, useLocation } from "react-router-dom";
import axiosConfig from "../services/axiosConfig";
import { useParams } from "react-router-dom";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
function HivArt() {
  const [doctors, setDoctors] = useState([]);
  const { specialityId } = useParams();
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    getDoctors();
  }, []);
  const getDoctors = async () => {
    try {
      const response = await axiosConfig.get(`/specialities/fetch_speciality_doctors`, {
        params: {
          "speciality": {
            "name": "aids"
          }
        }
      });
      setDoctors(response.data.data.doctors); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };
  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="doctorListing" />
      <section className="py-0 py-50">
        <div className="container">
          <div className="row gy-lg-0 gy-4">
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane list-background">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <span className="label-color">Symptoms</span>
                        <h3 className="titlewidth title-cards">
                          Find Symptoms
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane list-background causes">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <span className="label-color label-green">Causes</span>
                        <h3 className="titlewidth title-cards">
                          Understand Causes
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane list-background consultation">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <span className="label-color label-blue">
                          Consultation
                        </span>
                        <h3 className="titlewidth title-cards">
                          Booking Consultation
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="heading text-left mb-4 position-relative headingcart">
                <h2 className="pb-0">Doctor Listings </h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-70">
            {doctors.map((doctor) => (
              <div className="col d-flex flex-column h-100" key={doctor.id}>
                {" "}
                {/* Ensure each column has equal height */}
                <div className="prduct-card card-radius image-product">
                  <img
                    className="img-fluid w-100"
                    src={doctor.image_url || "/img/default-doctor.png"}
                    alt={doctor.name || "Doctor Image"}
                    style={{ objectFit: "cover", height: "250px" }}
                  />
                </div>
                <div className="product-dis d-flex flex-column flex-grow-1">
                  {" "}
                  {/* Main content area */}
                  <div className="d-flex justify-content-between">
                    <span className="hair">
                      {doctor.specialities
                        .map((speciality) => speciality.name)
                        .join(", ")}
                    </span>
                    <label className="rating">
                      <img src="/img/rating.svg" alt="rating" />
                      {doctor.rating}
                    </label>
                  </div>
                  {/* These sections should grow to fill the space */}
                  <div className="flex-grow-1" style={{ height: "70px" }}>
                    <p className="name">{doctor.address.name}</p>
                    <div className="degignation">
                      <span>{doctor.education}</span>
                    </div>
                  </div>
                  <div className="location d-flex justify-content-between">
                    <span>
                      <img src="/img/map.svg" alt="location" />
                      {doctor.location}
                    </span>
                    <p className="doc-price d-flex p-0 m-0">
                      <span>₹</span>
                      {doctor.fee}
                    </p>
                  </div>
                  {/* Ensure buttons are aligned consistently at the bottom */}
                  <div className="mt-auto d-flex flex-column">
                    {" "}
                    {/* Updated to push buttons to the bottom */}
                    <Link
                      className="cart-btn mb-2"
                      to={`/doctors/profile/${toSlug(doctor.address.name)}`}
                      state={{ doctorId: doctor.id }}
                    >
                      <img src="/img/video.svg" alt="Online Consult" />
                      Online Consult
                    </Link>
                    <Link
                      className="cart-btn btn-clinic mb-0"
                      to={`/doctors/profile/${toSlug(doctor.address.name)}`}
                      state={{ doctorId: doctor.id }}
                    >
                      <img src="/img/clinic.svg" alt="Visit Clinic" />
                      Visit Clinic
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

export default HivArt;
