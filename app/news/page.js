"use client";

import { useState, useEffect } from "react";
import NewsService from "@/api/NewsService";
import { formatTime } from "@/utils/time";
import { FILES_URL } from "@/api/config";
import Link from "next/link";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";

const Header = dynamic(() => import('@/components/Header'), { ssr: false, loading: () => <Loader/> })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false, loading: () => <Loader/> })

const NEWS_VISIBLE_COUNT = 6;

const AllNews = () => {
  const [newsCount, setNewsCount] = useState(0);
  const [isMoreVisible, setIsMoreVisible] = useState(true);
  const [allNews, setAllNews] = useState([]);
  const [getNews, isNewsLoading, allNewsErr] = useFetching(
    async (skip, take) => {
      const response = await NewsService.getNews(skip, take);
      if (response.status === 200) {
        if (response.data.length != NEWS_VISIBLE_COUNT) {
          setIsMoreVisible(false);
        }

        setNewsCount((prev) => prev + response.data.length);
        setAllNews([...allNews, ...response.data]);
      } else {
        console.log(allNewsErr);
      }
    }
  );

  useEffect(() => {
    document.title = "Все новости - МФ МАДИ";
    getNews(newsCount, NEWS_VISIBLE_COUNT);
  }, []);

  return (
    <>
      <Header/>
      <section className="all-news">
        <div className="all-news__container container">
          <h2 className="all-news__title title">ВСЕ НОВОСТИ</h2>
          <ul className="all-news__list">
            {allNews.map((news, idx) => (
              <li key={idx} className="all-news__item news-item">
                <Link href={`/news/${news.id}`} className="news-item__link">
                  <div className="news-item__image">
                    <img
                      src={`${FILES_URL}/${news.content?.fileModels[0]?.name}`}
                      alt=""
                    />
                  </div>
                  <h3 className="news-item__title">{news.content?.title}</h3>
                  <time
                    datetime={formatTime(news.createDate)}
                    className="news-item__date"
                  >
                    {formatTime(news.createDate)}
                  </time>
                </Link>
              </li>
            ))}
            {newsCount == 0 && <Loader />}
          </ul>
          {isMoreVisible && (
            <button
              onClick={() => getNews(newsCount, NEWS_VISIBLE_COUNT)}
              disabled={isNewsLoading}
              className="all-news__more btn"
            >
              {isNewsLoading ? (
                <Loader isOnlySpinner />
              ) : (
                <span>Загрузить еще новости</span>
              )}
            </button>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AllNews;
