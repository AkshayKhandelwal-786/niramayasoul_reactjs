import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import axiosConfig from "../services/axiosConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim() 
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
function Doctors() {
  const navigate = useNavigate();

  const [specialities, setSpecialities] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    getCategories();
    getSymptoms();
  });
  const getCategories = async () => {
    try {
      const response = await axiosConfig.get("/specialities");
      setSpecialities(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };
  const getSymptoms = async () => {
    try {
      const response = await axiosConfig.get("/symptoms");
      setSymptoms(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };


  const [doctors, setDoctors] = useState([]);
  // const { specialityId } = useParams();

  useEffect(() => {
    getDoctors();
  }, []);
  const getDoctors = async () => {
    try {
      const response = await axiosConfig.get(`/doctors`);
      setDoctors(response.data.data); // Set the doctors state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };


  return (
    <Layout>
      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Slider page="doctors" />

      <section className="py-0 mt-2">
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


      <section className="pt-0 py-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="heading text-left mb-4 position-relative headingcart">
                <h2 className="pb-0">Doctors </h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
            {doctors.map((doctor) => (
              <div className="col d-flex flex-column h-100" key={doctor.id}>
                {" "}
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
                  <div className="d-flex justify-content-between align-items-center">
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
                  <div className="flex-grow-1" style={{ height: "80px" }}>
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
                  <div className="mt-auto d-flex flex-column">
                    {" "}
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
        </div>
      </section>
      
      {/* <div className="doctor-service py-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-38">
                <span className="text-uppercase">Services</span>
                <h2 className="pb-0">Top Specialties</h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {loading && <div>Loading...</div>}

            {specialities.map((speciality) => (
              <div className="col" key={speciality.id}>
                <div className="card-service">
                  <div className="position-relative">
                    <img
                      className="img-fluid w-100"
                      src={speciality.image_url}
                      alt=""
                    />
                  </div>
                  <div className="service-disc d-flex justify-content-between align-items-center">
                    <span>{speciality.name}</span>

                    <Link
                      to={{
                        pathname: `/doctors/${toSlug(speciality.name)}`}} state={
                           { specialityId: speciality.id }
                          }
                    >
                      <img src="/img/arrow-btn.svg" alt="arrow button" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <section className="pt-0">
        <div className="container">
          <div className="bg-img1">
            <div className="row">
              <div className="col-lg-6">
                <div className="book-consultant">
                  <h3>Book a Consultation with Our Doctors</h3>
                  <p>
                    we make it easy for you to access top-tier medical care by
                    allowing you to book appointments with our highly qualified
                    doctors.
                  </p>
                  <a href="#">Book Now</a>
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
      </section>
      {/* <section className="position-relative pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Symptoms</span>
                <h2 className="pb-0">Common Symptoms</h2>
              </div>
            </div>
          </div>
          <div className="row gy-lg-5 gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
            {symptoms.map((symptom) => (
              <div className="col" key={symptom.id}>
                <div className="card-with-img h-100">
                  <div className="card-img-product card-links h-100">
                    <div className="h-100">
                      <img
                        className="img-fluid w-100 h-100"
                        src={symptom.image_url}
                        alt=""
                      />
                    </div>
                    <span>{symptom.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </Layout>
  );
}

export default Doctors;
