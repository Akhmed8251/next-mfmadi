"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FILES_URL } from '../api/config'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useFetching } from '../hooks/useFetching';
import PartnersService from '../api/PartnersService'
import Loader from './ui/Loader'

const Partners = () => {
    const [partners, setPartners] = useState([])
    const [getPartners, isPartnersLoading, partnersErr] = useFetching(async () => {
        const response = await PartnersService.getPartners()
        if (response.status === 200) {
            setPartners(response.data)
        } else {
            console.log(partnersErr)
        }
    })

    useEffect(() => {
        getPartners()
    }, [])

    return (
        <section className="partners">
            <h2 className="partners__title title">ПАРТНЕРЫ</h2>
            <div className="partners__wrapper">
                <div className="partners__container container">
                    {
                        isPartnersLoading
                            ?
                                <Loader />
                            :
                            <Swiper
                                modules={[Pagination]}
                                pagination
                                navigation={{ prevEl: ".partners__wrapper .swiper-button-prev", nextEl: ".partners__wrapper .swiper-button-next", }}
                                className="partners__slider"
                                spaceBetween={25}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.5
                                    },
                                    426: {
                                        slidesPerView: 2
                                    },
                                    769: {
                                        slidesPerView: 3
                                    },
                                    1025: {
                                        slidesPerView: 4
                                    }
                                }}
                            >
                                {
                                    partners.map((partner, idx) => (
                                        <SwiperSlide key={idx}>
                                            <a href={partner.link} className="partners-slide">
                                                <img src={`${FILES_URL}/${partner.imageFileName}`} alt={partner.name} />
                                            </a>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                    }
                    <div className="swiper-pagination"></div>
                </div>
            </div>
        </section>
    )
}

export default Partners