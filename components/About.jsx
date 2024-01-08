"use client"

import React, { useEffect, useState } from 'react'
import { useFetching } from '../hooks/useFetching'
import AdvertisingService from '../api/AdvertisingService'
import { FILES_URL } from '../api/config'
import Loader from './ui/Loader'

const About = () => {
  const [aboutInfo, setAboutInfo] = useState(null)
  const [getAboutInfo, isAboutLoading, aboutErr] = useFetching(async () => {
    const response = await AdvertisingService.getMainPageDownAdvertising()
    if (response.status == 200) {
        setAboutInfo(response.data)
    }
  })

  useEffect(() => {
    getAboutInfo()
  }, [])

  return (
    <section className="about">
        <div className="about__container container">
            <div className="about__wrapper">
                {
                    isAboutLoading ? <Loader />
                      :
                      <>
                        <div className="about__content">
                            <h2 className="about__title title">{aboutInfo?.title}</h2>
                            <p className="about__desc">
                                {aboutInfo?.mainText}
                            </p>
                            <a href={aboutInfo?.buttonLink} className="about__btn btn btn_darker">{aboutInfo?.buttonText}</a>
                        </div>
                        <div className="about__image">
                            <img src={`${FILES_URL}/${aboutInfo?.avatarFileName}`} alt="" />
                        </div>
                      </>
                }
            </div>
        </div>
    </section>
  )
}

export default About