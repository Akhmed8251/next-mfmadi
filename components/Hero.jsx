"use client"

import React, { useEffect, useState } from "react";
import AdvertisingService from "../api/AdvertisingService";
import { Pagination, Navigation } from 'swiper/modules'
import { Swiper,  SwiperSlide,  } from 'swiper/react';
import { useFetching } from "../hooks/useFetching";
import Loader from "./ui/Loader";
import { FILES_URL } from "../api/config";


const Hero = () => {
  const [advertisings, setAdvertisings] = useState([])
  const [getAdvertisings, isAdvertisingsLoading, advertisingsErr] = useFetching(async () => {
    const response = await AdvertisingService.getAdvertisings();
    if (response.status == 200) {
      setAdvertisings(response.data);
    } else {
      console.log(advertisingsErr);
    }
  });

  useEffect(() => {
    getAdvertisings()
  }, [])
  return (
    <section className="hero">
      <div className="hero__container container">
        <div className="hero__slider-container">
          {
            isAdvertisingsLoading ? <Loader />
              :
              <Swiper 
              modules={[Navigation, Pagination]} 
              pagination
              navigation={{ prevEl: ".hero__slider-container .swiper-button-prev", nextEl: ".hero__slider-container .swiper-button-next", }}
              className="hero__slider"
              speed={1000} 
            >
              {
                advertisings.filter(a => a.mainSliderIsVisible == true).map((advertising, idx) => (
                  <SwiperSlide key={idx}>
                    <a 
                      href={advertising.buttonLink} 
                      className="hero-slide" 
                      style={{ background: `linear-gradient(359deg, rgba(0, 0, 0, 0.80) 0.87%, rgba(0, 0, 0, 0.30) 99.42%), url('${FILES_URL}/${advertising.avatarFileName}') no-repeat center / cover, lightgray 50% / cover no-repeat` }}>
                        <div className="hero-slide__content">
                          <h1 className="hero-slide__title title">{advertising.title}</h1>
                          <p className="hero-slide__desc">{advertising.mainText}</p>
                        </div>
                    </a>
                  </SwiperSlide>
                ))
              } 
            </Swiper>
          }
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
