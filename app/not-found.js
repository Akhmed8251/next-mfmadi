"use client"

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";
import notFoundGif from "@/assets/images/404.gif"
import { useRouter } from "next/navigation";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: true,
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <Loader />,
});

const NotFound = () => {
  const router = useRouter()
  document.title = 'Ошибка 404 - МФ МАДИ'

  return (
    <>
      <Header />
        <section className="not-found">
            <div className="container">
                <div className="not-found__content">
                    <h1 className="not-found__title title">Ошибка 404</h1>
                    <div className="not-found__desc">
                        <p>Страница не найдена</p>
                        <p>Рекомендуем проверить правильность написания URL</p>
                    </div>
                    <img src={notFoundGif.src} alt="" />
                    <div className="not-found__btns">
                        <a href="#" className="not-found__btn btn not-found__btn_back" onClick={() => router.back()}>Назад</a>
                        <a href="/" className="btn">Вернуться на главную</a>
                    </div>
                </div>
            </div>
        </section>
      <Footer />
    </>
  );
};

export default NotFound;
