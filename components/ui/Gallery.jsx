"use client"

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Thumbs } from "swiper/modules";
import { FILES_URL } from "@/api/config";

const Gallery = ({ images }) => {
  const [amountImages, setAmountImages] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isGalleryyActive, setIsGalleryActive] = useState(false);

  const toggleGallery = () => {
    setIsGalleryActive((prev) => !prev);
    document.body.classList.toggle("no-scroll");
  };

  useEffect(() => {
    setAmountImages(images?.length)
  }, [])


  return (
    <div className="gallery">
      <div className="gallery__images-block">
        <div className="gallery__images">
          <div className="gallery__images-slider-container">
            <Swiper
             modules={[Navigation, Pagination, Thumbs]} 
             speed={1000} 
             thumbs={{ swiper: thumbsSwiper }} 
             navigation={{ enabled: amountImages > 1, prevEl: ".gallery .slider-arrow_prev", nextEl: ".gallery .slider-arrow_next" }} 
             className="gallery__images-slider" 
             onClick={toggleGallery}
             pagination={{ el: ".gallery__images-slider-container .swiper-pagination" }}
             breakpoints={{
              769: {
                allowTouchMove: false
              }
             }}
            >
              {
                images?.map((fileModel, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="gallery__images-slide">
                      <img src={`${FILES_URL}/${fileModel.name}`} alt="" />
                    </div>
                  </SwiperSlide>
                ))}
              <div className="gallery__images-zoom">
                <svg viewBox="0 0 128 128" width="128pt" height="128pt">
                  <path
                    d=" M 71.981 47.981 L 63.98 47.981 L 63.98 39.98 C 63.98 35.562 60.398 31.98 55.979 31.98 C 51.561 31.98 47.979 35.562 47.979 39.98 L 47.979 47.981 L 39.978 47.981 C 35.559 47.981 31.977 51.563 31.977 55.982 C 31.977 60.401 35.559 63.983 39.978 63.983 L 47.979 63.983 L 47.979 71.984 C 47.979 76.403 51.561 79.985 55.979 79.985 C 60.398 79.985 63.98 76.403 63.98 71.984 L 63.98 63.983 L 71.981 63.983 C 76.4 63.983 79.982 60.401 79.982 55.982 C 79.982 51.563 76.4 47.981 71.981 47.981 Z  M 125.652 114.381 L 100.888 89.611 C 119.435 64.844 114.392 29.73 89.624 11.183 C 64.857 -7.363 29.743 -2.321 11.196 22.447 C -7.35 47.214 -2.307 82.328 22.46 100.875 C 42.359 115.775 69.697 115.782 89.603 100.89 L 114.378 125.665 C 117.491 128.778 122.539 128.778 125.652 125.665 C 128.765 122.552 128.765 117.504 125.652 114.391 L 125.652 114.381 Z  M 56.258 96.109 C 34.251 96.109 16.411 78.269 16.411 56.261 C 16.411 34.254 34.251 16.414 56.258 16.414 C 78.266 16.414 96.106 34.254 96.106 56.261 C 96.083 78.259 78.256 96.086 56.258 96.109 Z "
                    fillRule="evenodd"
                    fill="rgb(0,0,0)"
                  ></path>
                </svg>
              </div>
            </Swiper>
            {amountImages > 1 && (
                <div className="gallery__images-slider-bottom images-slider-bottom">
                <div className="images-slider-bottom__arrows slider-arrows">
                    <div className="slider-arrow slider-arrow_prev">
                        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7L10 12L15 17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </div>
                    <div className="slider-arrow slider-arrow_next">
                        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7L10 12L15 17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </div>
                </div>
                <div className="images-slider-bottom__amount slider-amount">
                    <div className="slider-amount__icon">
                        <svg viewBox="0 0 32 32" width="32px" height="32px"><path d=" M 28.152 7.333 L 23.525 7.333 L 23.525 6.858 C 23.525 4.734 21.802 3.011 19.678 3.011 L 12.321 3.011 C 10.197 3.011 8.474 4.734 8.474 6.858 L 8.474 7.333 L 3.847 7.333 C 1.722 7.333 0 9.055 0 11.18 L 0 25.142 C 0 27.266 1.722 28.989 3.847 28.989 L 28.153 28.989 C 30.278 28.989 32 27.266 32 25.142 L 32 11.18 C 31.998 9.054 30.276 7.333 28.152 7.333 Z  M 15.998 24.999 C 11.991 24.999 8.732 21.74 8.732 17.733 C 8.732 13.726 11.991 10.467 15.998 10.467 C 20.006 10.467 23.264 13.725 23.264 17.733 C 23.264 21.74 20.005 24.999 15.998 24.999 Z  M 19.845 17.733 C 19.845 19.852 18.118 21.58 15.998 21.58 C 13.878 21.58 12.152 19.852 12.152 17.733 C 12.152 15.613 13.878 13.886 15.998 13.886 C 18.118 13.886 19.845 15.613 19.845 17.733 Z " fill="rgb(255,255,255)"></path>
                        </svg>
                    </div>
                    <span className="slider-amount__count">{amountImages}</span>
                </div>
                </div>
            )}
            <div className="swiper-pagination"></div>
          </div>
          
        </div>
        <div
          className={`gallery__pictures ${isGalleryyActive ? "_active" : ""}`}
        >
          <div className="gallery__pictures-container">
            <div className="gallery__pictures-actions actions-pictures">
              <button
                type="button"
                className="actions-pictures__action actions-pictures__action_close"
                onClick={toggleGallery}
                title="Закрыть"
              >
                <svg viewBox="0 0 128 128" width="128pt" height="128pt">
                  <path
                    d=" M 75.312 64 L 125.656 13.661 C 128.782 10.536 128.782 5.469 125.656 2.344 C 122.531 -0.781 117.464 -0.781 114.34 2.344 L 114.34 2.344 L 64 52.689 L 13.661 2.344 C 10.536 -0.781 5.469 -0.781 2.344 2.344 C -0.781 5.469 -0.781 10.536 2.344 13.661 L 52.689 64 L 2.344 114.34 C -0.781 117.465 -0.781 122.532 2.344 125.656 C 5.469 128.781 10.536 128.782 13.661 125.656 L 64 75.312 L 114.339 125.656 C 117.464 128.782 122.531 128.782 125.656 125.656 C 128.781 122.531 128.781 117.464 125.656 114.34 L 75.312 64 Z "
                    fill="rgb(255,255,255)"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="gallery__slider-arrows">
              <span
                className="gallery__slider-arrow gallery__slider-arrow_prev"
                title="Предыдущее фото"
              >
                <svg viewBox="0 0 128 128" width="128pt" height="128pt">
                  <path d=" M 96 0 L 32 64 L 96 128" fill="none"></path>
                </svg>
              </span>
              <span
                className="gallery__slider-arrow gallery__slider-arrow_next"
                title="Следующее фото"
              >
                <svg viewBox="0 0 128 128" width="128pt" height="128pt">
                  <path d=" M 32 128 L 96 64 L 32 0" fill="none"></path>
                </svg>
              </span>
            </div>
            <Swiper
              modules={[Navigation, Pagination]}
              onSwiper={setThumbsSwiper}
              speed={700}
              pagination={{ type: "fraction" }}
              navigation={{
                prevEl: ".gallery__slider-arrows .gallery__slider-arrow_prev",
                nextEl: ".gallery__slider-arrows .gallery__slider-arrow_next",
              }}
              spaceBetween={20}
              className="gallery__slider"
            >
              {
                images?.map((fileModel, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="gallery-slide">
                      <img src={`${FILES_URL}/${fileModel.name}`} alt="" />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;