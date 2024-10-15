import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

function Blogslider() {
  return (
    <>
      <section className="pt-0 position-relative pb-120 blog">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">Blogs</span>
                <h2 className="pb-0">Health Articles & Blogs</h2>
              </div>
            </div>
          </div>

          <Swiper
            navigation={true}
            modules={[Navigation]}
            slidesPerView={2}
            spaceBetween={10}
            loop={true}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
            className="swiper mySwiper mySwiperslider sldierw"
          >
            <SwiperSlide className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card-blog">
                  <div className="card-blog-img">
                    <img className="img-fluid" src="/img/blog1.jpg" alt="" />
                  </div>
                  <div className="card-blog-content">
                    <h3>Is Diabetes making your life bitter?</h3>
                    <p>
                      Diabetes mellitus is a group of metabolic disease
                      characterized by increase in the level of sugar in blood;
                      hyperglycemia, resulting from defects in insulin
                      secretion, insulin action or...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>6 April at 5:28PM</span>
                      <a href="#">
                        Read Full
                        <img src="/img/arrow-long.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card-blog">
                  <div className="card-blog-img">
                    <img className="img-fluid" src="/img/blog1.jpg" alt="" />
                  </div>
                  <div className="card-blog-content">
                    <h3>Is Diabetes making your life bitter?</h3>
                    <p>
                      Diabetes mellitus is a group of metabolic disease
                      characterized by increase in the level of sugar in blood;
                      hyperglycemia, resulting from defects in insulin
                      secretion, insulin action or...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>6 April at 5:28PM</span>
                      <a href="#">
                        Read Full
                        <img src="/img/arrow-long.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card-blog">
                  <div className="card-blog-img">
                    <img className="img-fluid" src="/img/blog1.jpg" alt="" />
                  </div>
                  <div className="card-blog-content">
                    <h3>Is Diabetes making your life bitter?</h3>
                    <p>
                      Diabetes mellitus is a group of metabolic disease
                      characterized by increase in the level of sugar in blood;
                      hyperglycemia, resulting from defects in insulin
                      secretion, insulin action or...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>6 April at 5:28PM</span>
                      <a href="#">
                        Read Full
                        <img src="/img/arrow-long.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card-blog">
                  <div className="card-blog-img">
                    <img className="img-fluid" src="/img/blog1.jpg" alt="" />
                  </div>
                  <div className="card-blog-content">
                    <h3>Is Diabetes making your life bitter?</h3>
                    <p>
                      Diabetes mellitus is a group of metabolic disease
                      characterized by increase in the level of sugar in blood;
                      hyperglycemia, resulting from defects in insulin
                      secretion, insulin action or...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>6 April at 5:28PM</span>
                      <a href="#">
                        Read Full
                        <img src="/img/arrow-long.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="card-blog">
                  <div className="card-blog-img">
                    <img className="img-fluid" src="/img/blog1.jpg" alt="" />
                  </div>
                  <div className="card-blog-content">
                    <h3>Is Diabetes making your life bitter?</h3>
                    <p>
                      Diabetes mellitus is a group of metabolic disease
                      characterized by increase in the level of sugar in blood;
                      hyperglycemia, resulting from defects in insulin
                      secretion, insulin action or...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>6 April at 5:28PM</span>
                      <a href="#">
                        Read Full
                        <img src="/img/arrow-long.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="swiper-pagination"></div>
      </section>
    </>
  );
}

export default Blogslider;
