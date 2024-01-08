"use client"

import { useState, useEffect } from 'react'
import AdvertisingService from '../api/AdvertisingService'
import { FILES_URL } from '../api/config'
import { useFetching } from '../hooks/useFetching'
import Loader from './ui/Loader'

const Advertising = () => {
    const [advertisings, setAdvertisings] = useState([])
    const [getAdvertisings, isAdvertisingLoading, advertisingErr] = useFetching(async () => {
        const response = await AdvertisingService.getLastAdvertisings()
        if (response.status === 200) {
            setAdvertisings(response.data)
        } else {
            console.log(advertisingErr)
        }
    })

    useEffect(() => {
        getAdvertisings()
    }, [])

    return (
        <section className="advertising">
            <div className="advertising__container container">
                <div className="advertising__content">
                    {
                        isAdvertisingLoading
                            ?
                            <Loader />
                            :
                            advertisings.filter(a => a.mainSliderIsVisible == false).map((advertisingItem, idx)=> (
                                <a key={idx} href={advertisingItem.buttonLink} className="advertising__block advertising-block">
                                    <img src={`${FILES_URL}/${advertisingItem.avatarFileName}`} alt='' />
                                </a>
                            ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Advertising