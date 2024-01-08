"use client";

import NewsService from "@/api/NewsService";
import Gallery from "@/components/ui/Gallery";
import Loader from "@/components/ui/Loader";
import { useFetching } from "@/hooks/useFetching";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// export const generateMetadata = async ({params}) => {
//   const response = await NewsService.getNewsById(params.id)
//   const newsInfo = response.data

//   return {
//     title: `${newsInfo.content?.title} - МФ МАДИ`
//   }
// }

// export const getNewsData = async (id) => {
//   const response = await NewsService.getNewsById(id);
//   const newsInfo = response.data;

//   return newsInfo;
// };

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <Loader />,
});

const NewsPage = ({ params }) => {
  const newsId = params.id;
  const [newsInfo, setNewsInfo] = useState(null);
  const [getNewsById, isNewsLoading, newsErr] = useFetching(async (id) => {
    const response = await NewsService.getNewsById(id);
    if (response.status == 200) {
      setNewsInfo(response.data);
      document.title = `${response.data.content?.title} - МФ МАДИ`;
    }
  });
  useEffect(() => {
    getNewsById(params.id);
  }, []);

  return (
    <>
      <Header />
      <section className="news-page">
        <div className="news-page__container container">
          {isNewsLoading ? (
            <Loader />
          ) : (
            <>
              <h1 className="news-page__title title">
                {newsInfo?.content.title}
              </h1>
              <Gallery
                images={newsInfo?.content.fileModels?.filter(
                  (f) => f.isDeleted == false
                )}
              />
              <div
                className="news-page__content"
                dangerouslySetInnerHTML={{
                  __html: newsInfo?.content.htmlContent,
                }}
              ></div>
            </>
          )}
          <div className="news-page__bottom">
            <a href="/" className="btn">
              На главную
            </a>
            <a href="/news" className="btn">
              Все новости
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NewsPage;
