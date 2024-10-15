import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axiosConfig from "../services/axiosConfig";
import { Link } from "react-router-dom";

function Slider({ page }) {
  return (
    <>
      {/* check page if home */}
      {page === "home" && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="swiper mySwiper slidermain"
        >
          <div className="swiper-wrapper">
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_1.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                      <h1>
                        We Provide Comprehensive Solutions in Global Health and
                        Medicine
                      </h1>
                      <p>
                        Our team of experts offers a holistic approach to
                        health, combining the latest in medical advancements
                        with personalized care.
                      </p>
                      <Link className="btn-slider" to={'/pharmacy'}>
                        Start Your Journey
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_2.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                    <h1>Exceptional Wellness Services Tailored for Your Optimal Health</h1>
                    <p>Our services include personalized wellness plans, stress management, nutritional guidance, and holistic therapies.</p>
                      <Link className="btn-slider" to={`/wellness`}>
                        Start Your Journey
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_3.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                    <h1>Expert Medical Services by Qualified Doctors</h1>
                    <p>Our state-of-the-art facilities and highly trained technicians ensure that each test is conducted with the utmost precision and care.</p>
                      <Link className="btn-slider" to={`/doctors`}>
                        Start Your Journey
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_4.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                      <h1>
                        We Provide Comprehensive Solutions in Global Health and
                        Medicine
                      </h1>
                      <p>
                        Our team of experts offers a holistic approach to
                        health, combining the latest in medical advancements
                        with personalized care.
                      </p>
                      <Link className="btn-slider" to={'/pathology'}>
                        Start Your Journey
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      )}

      {/* check for page pharmacy */}
      {page === "pharmacy" && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="swiper mySwiper slidermain"
        >
          <div className="swiper-wrapper">
          <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_1.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                      <h1>
                        We Provide Comprehensive Solutions in Global Health and
                        Medicine
                      </h1>
                      <p>
                        Our team of experts offers a holistic approach to
                        health, combining the latest in medical advancements
                        with personalized care.
                      </p>
                      <Link className="btn-slider" to={'/enquiry'}>
                      Enquire Now
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
           
          </div>
        </Swiper>
      )}

      {/* check for doctors */}
      {page === "doctors" && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="swiper mySwiper slidermain mb-50"
        >
          <div className="swiper-wrapper">
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_3.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                    <h1>Expert Medical Advice Online</h1>
                    <p>Our team of experienced and compassionate physicians is here to ensure you receive the best possible care tailored to your individual needs.
                    </p>
                      <Link className="btn-slider" to={'/enquiry'}>
                      Enquire Now
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      )}

      {/* check for pathology */}
      {page === "pathology" && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="swiper mySwiper slidermain mb-50"
        >
          <div className="swiper-wrapper">
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(21, 137, 66, 0.7) 0%, rgba(21, 137, 66, 0.35) 48.5%, rgba(21, 137, 66, 0.7) 99.88%), url(/img/banner/lab-slider.jpg)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                      <h1>
                        Book lab tests easily and get quick, accurate results
                      </h1>
                      <p>
                        Experience hassle-free lab test bookings with our
                        user-friendly platform, ensuring you receive fast and
                        precise results from the comfort of your home.
                      </p>
                      <Link className="btn-slider" to={'/enquiry'}>
                      Enquire Now
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      )}

      {/* check for Wellness */}
      {page === "wellness" && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="swiper mySwiper slidermain mb-50"
        >
          <div className="swiper-wrapper">
            <SwiperSlide
              className="swiper-slide slider1"
              style={{
                backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.42) 0%, rgba(0, 0, 0, 0.14) 99.88%), url(/img/banner/banner_2.png)`,
              }}
            >
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="text-center text-slider">
                      <h1>
                      Integrative Approaches to Health and Wellness
                      </h1>
                      <p>
                      Our team of experienced professionals is committed to providing personalized care tailored to your unique needs. Whether you're seeking preventive care, treatment for chronic conditions, or suppor
                      </p>
                      <Link className="btn-slider" to={'/enquiry'}>
                      Enquire Now
                        <span>
                          <img src="/img/arrow-top.svg" alt="arrow" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      )}

      {/* check for Wellness */}
      {page === "medicines" && (
         <div className="container mt-32">
         <Swiper
           navigation={true}
           modules={[Navigation]}
           className="swiper mySwiper slidermain slidermainnew"
         >
           <SwiperSlide
             className="swiper-slide slider1-min min-height d-flex align-items-center"
             style={{
               backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0.41) 0%, rgba(0, 0, 0, 0.73) 99.88%), url(/img/banner/slider1.jpg)`,
               minHeight: "315px",
               borderRadius: "1.25rem",
             }}
           >
             <div className="">
               <div className="row justify-content-center">
                 <div className="col-lg-7 col-10">
                   <div className="text-center text-slider text-slider-list">
                     <h1>Flat 20% off on Medicine</h1>
                     <a className="btn-slider btn-list" href="#">
                       Place your First Order
                     </a>
                     <p>
                       Our team of experienced professionals is committed to
                       providing personalized care tailored to your unique needs.
                       Whether you're seeking preventive care, treatment for
                       chronic conditions, or support.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </SwiperSlide>
           
        
         </Swiper>
       </div>
      )}
      {page === "doctorListing" && (
         <div className="container mt-32">
         <Swiper
           navigation={true}
           modules={[Navigation]}
           className="swiper mySwiper slidermain slidermainnew"
         >
           <SwiperSlide
             className="swiper-slide slider1-min min-height d-flex align-items-center"
             style={{
               backgroundImage: `linear-gradient(-90deg, rgba(6, 6, 6, 0) 0%, rgba(0, 0, 0, 0) 99.88%), url(/img/banner/listing-slider.jpg)`,
               minHeight: "315px",
               borderRadius: "1.25rem",
             }}
           >
             <div className="">
               <div className="row justify-content-center">
                 <div className="col-lg-7 col-10">
                   <div className="text-center text-slider text-slider-list">
                     <h1>Choose Your Doctor</h1>
                     <a className="btn-slider btn-list" href="#">
                     Consult Now
                     </a>
                     <p>
                       Our team of experienced professionals is committed to
                       providing personalized care tailored to your unique needs.
                       Whether you're seeking preventive care, treatment for
                       chronic conditions, or support.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </SwiperSlide>
          
        
         </Swiper>
       </div>
      )}
    </>
  );
}

export default Slider;
