"use client"

import { useState, useEffect } from "react";
import { FILES_URL } from "../api/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatTime } from "../utils/time";
import { useFetching } from "../hooks/useFetching";
import NewsService from "../api/NewsService";
import Loader from './ui/Loader'
import { Pagination } from "swiper/modules";

const NEWS_VISIBLE_COUNT = 3
const SKIP_NEWS = 0

const MainNews = () => {
  const [mainNews, setMainNews] = useState([])
  const [getMainNews, isMainNewsLoading, mainNewsErr] = useFetching(async () => {
    const response = await NewsService.getNews(SKIP_NEWS, NEWS_VISIBLE_COUNT)
    if (response.status === 200) {
      setMainNews(response.data)
    } else {
      console.log(mainNewsErr)
    }
  })

  useEffect(() => {
    getMainNews()
  }, [])

  return (
    <section className="news">
      <div className="news__container container">
        <h2 className="news__title title">НОВОСТИ</h2>
        {
          isMainNewsLoading
            ?
              <Loader />
            :
            <Swiper
              modules={[Pagination]}
              autoHeight
              spaceBetween={30}
              pagination
              breakpoints={{
                  320: {
                      slidesPerView: 1,
                  },
                  526: {
                      slidesPerView: 2
                  },
                  993: {
                      slidesPerView: 3
                  }
              }}
              className="news__slider"
            >
              {mainNews.map((news, idx) => (
                <SwiperSlide key={idx}>
                  <div className="news-item">
                    <a href={`/news/${news.id}`} className="news-item__link">
                      <div className="news-item__image">
                        <img src={`${FILES_URL}/${news.content?.fileModels[0]?.name}`} alt="" />
                      </div>
                      <h3 className="news-item__title">{news.content?.title}</h3>
                      <time className="news-item__date">{formatTime(news.createDate)}</time>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-pagination"></div>
            </Swiper>
        }
        <div className="news__more">
          <a href="/news" className="news__btn btn">
            Все новости
          </a>
        </div>
      </div>
    </section>
  );
};

export default MainNews;
