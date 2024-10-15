import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Slider from "../components/Slider";
import Blogslider from "../components/Blogslider";
import TestimonialSlider from "../components/TestimonialSlider";
import Faqs from "../components/Faqs";

import axiosConfig from "../services/axiosConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Team from "../components/Team";
import Investors from "../components/Investors";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
const Home = () => {
  const [loading, setLoading] = useState(true); // For loading state

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories();
  });
  const getCategories = async () => {
    try {
      const response = await axiosConfig.get("/medicine_categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is done
    }
  };

  return (
    <Layout>
      <Slider page="home" />
      <section className="position-relative overflow-visible">
        <img
          className="rounded-right-l"
          src="/img/round-dark-pink.svg"
          alt=""
        />
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="card-fisrt card-img">
                <h3 className="text-nowrap">
                  Convenient and Reliable <br /> Pharmacy Care
                </h3>
                <p>Medicines, health kit & many more</p>
                <Link to="/pharmacy">
                  <img src="/img/arrow-top-sec.svg" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-fisrt">
                <h3>Transform Your Life with Wellness</h3>
                <p>PrEP-PEP, HIV-ART, HRT and many more</p>
                <Link to="/prep-pep">
                  <img src="/img/icon-btn.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* our Services */}

      <section className="pt-0 position-relative">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-93">
                <span className="text-uppercase">Services</span>
                <h2>Explore Our Key Services</h2>
                <p className="pb-0">
                  Whether youre seeking preventive care, treatment for chronic
                  conditions, or support for a healthier lifestyle, we are here
                  to guide you every step of the way. With a focus on quality,
                  compassion, and innovation.
                </p>
              </div>
            </div>
          </div>
          <div className="row gy-lg-auto gy-5">
            <div className="col-lg-3">
              <div className="main-card">
                <div className="card-head position-relative">
                  <img className="bg-img" src="/img/bg-img.svg" alt="" />
                  <img className="upper-img" src="/img/upper.png" alt="" />
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div className="text-disc">
                    <h3>Pharmacy</h3>
                    <p>Instant meds solutions</p>
                  </div>
                  <Link to="/pharmacy">
                    <img src="/img/arrow-upper.svg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="main-card">
                <div className="card-head position-relative light-g">
                  <img className="bg-img" src="/img/bg-img2.svg" alt="" />
                  <img className="upper-img" src="/img/lab.png" alt="" />
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div className="text-disc">
                    <h3>Lab Tests</h3>
                    <p>Explore all type lab tests</p>
                  </div>
                  <Link to="/pathology">
                    <img src="/img/arrow-upper.svg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="main-card">
                <div className="card-head position-relative light-y">
                  <img className="bg-img" src="/img/bg-img3.svg" alt="" />
                  <img className="upper-img" src="/img/dr.png" alt="" />
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div className="text-disc">
                    <h3>Dr. Consultation</h3>
                    <p>Consult with top doctors</p>
                  </div>
                  <Link to="/doctors">
                    <img src="/img/arrow-upper.svg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="main-card">
                <div className="card-head position-relative light-pink">
                  <img className="bg-img" src="/img/bg-img4.svg" alt="" />
                  <img className="upper-img" src="/img/yoga.png" alt="" />
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div className="text-disc">
                    <h3>Wellness</h3>
                    <p>Explore physical, mental health</p>
                  </div>
                  <Link to="/wellness">
                    <img src="/img/arrow-upper.svg" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-lg-12 text-center">
              <a className="btn-more" href="#">
                View all Services
                <img src="/img/arrow-tops.svg" alt="" />
              </a>
            </div>
          </div> */}
        </div>
        <img className="rounded-right-b" src="/img/round-pink.svg" alt="" />
      </section>

      <section className="pt-0">
        <div className="container ">
         

          <div className="row bg-light-green position-relative m-0">
          <img className="left-tile" src="/img/squire-tiles.svg" alt="" />
          <img className="right-tile" src="/img/squire-tiles.svg" alt="" />
            <div className="col-lg-12">
            <div className="row justify-content-between mb-48 gy-lg-auto gy-4">
            <div className="col-lg-6">
              <div className="membership">
                <h3>Become a Premium member and get amazing benefits!</h3>
              </div>
            </div>
            <div className="col-lg-5 text-center position-relative">
              <img
                className="position-relative zindex img-fluid"
                src="/img/membership.png"
                alt=""
              />

              <div className="dots">
                <img src="/img/dotbg.svg" alt="" />
              </div>
            </div>
          </div>

            </div>
            <div className="row">
            <div className="col-lg-12">
              <div className="border mb-40"></div>
            </div>
            <div className="col-lg-6"></div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="heading text-center mb-32">
                <span className="text-uppercase pb-0">BENEFITS</span>
                <img src="/img/border-bottom.svg" alt="" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-dic">
                <p>Up to 10% discount on Doctor consultations.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>
                  Up to 30% discount on General medicines with 24-hour delivery.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Up to 40% discount on ART/PrEP/PEP.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Up to 30% discount on HRT.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Up to 25% discount on Pathology Services.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Medicine reminders & refill prescriptions.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Various health packages available.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-dic">
                <p>Many more...</p>
              </div>
            </div>
          </div>
          </div>

         
          
        </div>
      </section>

      {/* <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-60">
                <span className="text-uppercase">Services</span>
                <h2>Our Best Selling Products</h2>
              </div>
            </div>
          </div>
          <div className="row gy-lg-auto gy-4">
            <div className="col-lg-4">
              <div className="card-products position-relative light-p">
                <img
                  className="end-card"
                  src="/img/round-cricle.svg"
                  alt="round-cricle"
                />
                <div className="row">
                  <div className="col-lg-6 col-6">
                    <div className="product-text">
                      <h3>Vitamins</h3>
                      <ul className="list-unstyled">
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Analgesics
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Antimalarial Drugs
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Antipyretics
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Antibiotics
                        </li>
                      </ul>

                      <a className="btn-prodcut" href="">
                        View all
                        <img src="/img/arrow-right.svg" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img className="img-fluid" src="/img/jar.png" alt="jar" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative light-y">
                <img
                  className="end-card"
                  src="/img/cricle-yellow.svg"
                  alt="round-cricle"
                />
                <div className="row">
                  <div className="col-lg-6 col-6">
                    <div className="product-text">
                      <h3>Baby Accessories</h3>
                      <ul className="list-unstyled">
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Meal Replacements
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Protein powder
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Muscle building
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Low Calorie Snacks
                        </li>
                      </ul>

                      <a className="btn-prodcut" href="">
                        View all
                        <img src="/img/arrow-right.svg" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img
                        className="img-fluid"
                        src="/img/acce.png"
                        alt="jar"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative light-pink">
                <img
                  className="end-card"
                  src="/img/cricle-pink.svg"
                  alt="round-cricle"
                />
                <div className="row">
                  <div className="col-lg-6 col-6">
                    <div className="product-text">
                      <h3>Vitamins</h3>
                      <ul className="list-unstyled">
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Herbs
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Gluten Free
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Sun Care
                        </li>
                        <li>
                          <img src="/img/arrow-list.svg" alt="" />
                          Sugar Free
                        </li>
                      </ul>

                      <a className="btn-prodcut" href="">
                        View all
                        <img src="/img/arrow-right.svg" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img
                        className="img-fluid"
                        src="/img/herbs.png"
                        alt="jar"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="pt-0 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="about-img position-relative">
                  <div className="img-overlay position-relative">
                    <img className="w-100" src="/img/about.png" alt="" />
                  </div>
                  <div className="text-img d-flex align-items-start">
                    <img className="iconw" src="/img/quality.svg" />
                    <div className="text-card">
                      <span>Quality over Quantity</span>
                      <div className="d-flex">
                        <img src="/img/star.svg" alt="" />
                        <img src="/img/star.svg" alt="" />
                        <img src="/img/star.svg" alt="" />
                        <img src="/img/star.svg" alt="" />
                        <img src="/img/star.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shap"></div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="about">
                <span className="text-uppercase">ABOUT US</span>
                <h3>Discover Holistic Wellness with Niramaya Soul</h3>
                <p>
                  Niramaya Soul is a holistic healthcare platform offering
                  pharmacy, pathology, doctor consultation, and wellness
                  services at an affordable rate within 24 hours in selected
                  tier 1 and tier 2, 3, 4 cities in Jharkhand and West Bengal.
                  With Niramaya Soul, you can get your medicine delivered at
                  your doorstep. You can also do seamless doctor booking, easy
                  diagnostic services, and privacy-assured wellness services.
                </p>

                <p>
                  <strong>Our Philosophy</strong>
                </p>

                <p>
                  At Niramaya Soul, we believe in the power of holistic
                  wellness. We understand that true health goes beyond the
                  physical—it includes mental clarity and spiritual peace. Our
                  approach integrates these elements to help you achieve a
                  balanced and fulfilling life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-0">
        <div className="container">
          <div className="row gy-lg-auto gy-4">
            <div className="col-lg-6 d-flex">
              <div className="light-g spacing h-100 position-relative">
                <img className="pos" src="/img/grid-v.svg" alt="" />
                <div className="d-flex justify-content-between mb-24">
                  <h3>Our Mission</h3>
                  <img src="/img/target.svg" alt="" />
                </div>
                <p>
                To become the trusted provider of healthcare services in tier 2 and 3 cities. At Niramaya Soul, our mission is to empower individuals on their journey to holistic wellness by providing comprehensive resources, expert guidance, and a supportive community. We strive to integrate the physical, mental, and spiritual aspects of health, ensuring that everyone can achieve a balanced and fulfilling life.
                </p>
              </div>
            </div>
            <div className="col-lg-6 d-flex">
              <div className="light-pink spacing h-100 position-relative">
                <img className="pos" src="/img/grid-p.svg" alt="" />
                <div className="d-flex justify-content-between mb-24">
                  <h3>Our Vision</h3>
                  <img src="/img/rocket.svg" alt="" />
                </div>
                <p>
                  To ensure accessible healthcare for everyone.Our vision is to
                  become the leading global platform for holistic wellness,
                  known for our commitment to quality, authenticity, and
                  compassionate care. We aim to inspire millions to embrace a
                  lifestyle of holistic health, creating a world where wellness
                  is accessible, valued, and nurtured for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="position-relative">
        <img className="dotleft" src="/img/dots-left.svg" alt="" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Category</span>
                <h2 className="pb-0">Shop By Cateogry</h2>
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
                        className="img-fluid w-100"
                        src={category.image_url}
                        alt={category.name}
                      />
                    </div>
                    <span><strong>{category.name}</strong></span>
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
      <Team />
      <Investors />
      {/* <TestimonialSlider />
      <Blogslider /> */}

      <Faqs />
      <section className="pt-0">
        <div className="container bg-img1">
          <div className="row">
            <div className="col-lg-6">
              <div className="book-consultant">
                <h3>Book a Consultation with Our Doctors</h3>
                <p>
                  we make it easy for you to access top-tier medical care by
                  allowing you to book appointments with our highly qualified
                  doctors.
                </p>
                <Link to={'/doctors'}>Book Now</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="consultant-img">
                <img className="img-fluid" src="/img/doctor.png" alt="" />
                <img
                  className="sign-doc img-fluid"
                  src="/img/doc-sign.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-0">
        <div className="container light-g m-90">
          <div className="row">
            <div className="col-lg-5">
              <div className="downlaod">
                <h3>
                  Download the <span>App</span>
                </h3>
                <p>Bringing health solutions closer to you.</p>

                {/* <div className="get">
                  <p>Get the link to download app</p>
                  <div className="input-group flex-nowrap">
                    <div className="round mb-lg-0 mb-2">
                      <span className="input-group-text" id="addon-wrapping">
                        +91
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter mobile number"
                        aria-label="Username"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                    <button className="send">Send SMS</button>
                  </div>
                </div> */}

                <div className="store">
                  <p>Store links:</p>

                  <div className="d-flex">
                  <Link to={'https://apps.apple.com/in/app/niramaya-soul/id6529532848'} target="_blank">
                      <img
                        className="img-fluid"
                        src="/img/appstore.png"
                        alt=""
                      />
                    </Link>
                    <Link to={'https://play.google.com/store/search?q=niramayasoul&c=apps&hl=en'} target="_blank">
                      <img className="img-fluid" src="/img/play.png" alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 text-end">
              <img className="img-fluid" src="/img/mobile.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
