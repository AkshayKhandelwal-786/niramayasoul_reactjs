import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

function TestimonialSlider() {
  return (
    <>
      <section className="pt-0">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Testimonial</span>
                <h2 className="pb-0">Our Client Feedbacks</h2>
              </div>
            </div>
          </div>
          <div className="position-relative">
          <Swiper
              slidesPerView={1}
              spaceBetween={10}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 28,
                },
              }}
              className="swiper mySwiper slidertestimonials position-relative pt-0"
            >
              <SwiperSlide>
                <div className="testimonials-card">
                  <img src="/img/left-quotes.svg" alt="" />
                  <div className="testi-profile">
                    <img src="/img/profile-testi.png" alt="" />
                  </div>
                  <div className="name">
                    <p className="m-0">Jane Cooper</p>
                    <span>Diabetes Patient</span>
                  </div>
                  <div className="disc">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eleifend tellus sit amet tristique accumsan.
                      Curabitur laoreet venenatis blandit.
                    </p>
                    <span>10 March 2022</span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="testimonials-card">
                  <img src="/img/left-quotes.svg" alt="" />
                  <div className="testi-profile">
                    <img src="/img/profile-test1.png" alt="" />
                  </div>
                  <div className="name">
                    <p className="m-0">Dorothy Joper</p>
                    <span>Heart Patient</span>
                  </div>
                  <div className="disc">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eleifend tellus sit amet tristique accumsan.
                      Curabitur laoreet venenatis blandit.
                    </p>
                    <span>10 March 2022</span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="testimonials-card">
                  <img src="/img/left-quotes.svg" alt="" />
                  <div className="testi-profile">
                    <img src="/img/profile-test2.png" alt="" />
                  </div>
                  <div className="name">
                    <p className="m-0">Amanda Hooper</p>
                    <span>Stomach Patient</span>
                  </div>
                  <div className="disc">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eleifend tellus sit amet tristique accumsan.
                      Curabitur laoreet venenatis blandit.
                    </p>
                    <span>10 March 2022</span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="testimonials-card">
                  <img src="/img/left-quotes.svg" alt="" />
                  <div className="testi-profile">
                    <img src="/img/profile-testi.png" alt="" />
                  </div>
                  <div className="name">
                    <p className="m-0">Jane Cooper</p>
                    <span>Diabetes Patient</span>
                  </div>
                  <div className="disc">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eleifend tellus sit amet tristique accumsan.
                      Curabitur laoreet venenatis blandit.
                    </p>
                    <span>10 March 2022</span>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <div className="position-relative arrow-bottom">
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
            <div className="shap-bottom"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TestimonialSlider;
