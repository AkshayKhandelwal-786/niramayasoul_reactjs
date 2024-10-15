import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

function ProductSlider({ productDetails }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={false}
        thumbs={thumbsSwiper && { swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 gallery-top"
        onSwiper={setMainSwiper}
      >
        {productDetails.images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="slider-inner">
              <img className="img-fluid" src={image} alt={`Product image ${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper gallery-thumbs"
      >
        {productDetails.images.map((image, index) => (
          <SwiperSlide key={index} onClick={() => mainSwiper.slideTo(index)} >
            <div className="product-gallery">
              <img className="img-fluid" src={image} alt={`Thumbnail image ${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default ProductSlider;
