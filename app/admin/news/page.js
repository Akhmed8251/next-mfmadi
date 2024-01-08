"use client"

import { useEffect, useState } from "react";
import { useFetching } from "@/hooks/useFetching";
import NewsService from "@/api/NewsService";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import Popup from "@/components/ui/Popup"
import getLocalStorage from "@/storage";

const NewsAdmin = () => {
  const { setCurrentPageName } = getLocalStorage();

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] = useState(false)

  const [newsId, setNewsId] = useState(null)
  const [newsList, setNewsList] = useState([]);
  const [getListNews, isNewsLoading, newsErr] = useFetching(async () => {
    const response = await NewsService.getNews();
    if (response.status == 200) {
      setNewsList(response.data);
    } else {
      console.log(newsErr);
    }
  });

  const [deleteNews, isDeleteLoading, deleteErr] = useFetching(async (newsId) => {
    const response = await NewsService.deleteNews(newsId)
    if (response.status == 200) {
      alert("Новость успешно удалена!");
      closeModalConfirmDelete()
      deleteNewsFromTable(newsId)
    } else {
      console.log(newsErr);
    }
  });

  const closeModalConfirmDelete = () => {
    setNewsId(null); 
    setModalConfirmDeleteActive(false)
  }

  const deleteNewsFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  useEffect(() => {
    document.title = 'Новости - МФ МАДИ'
    setCurrentPageName("Новости");
    getListNews();
  }, []);


  return (
    <>
      <section>
        <h1 className="admin-title title">Новости</h1>
        <a href={"/admin/news/create"} className="create btn">
          Создать
        </a>
        {isNewsLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата создания</th>
                <th>Заголовок</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news, idx) => (
                <tr data-id={news.id} key={idx}>
                  <td>{formatTime(news.createDate)}</td>
                  <td>{news.content?.title}</td>
                  <td className="actions">
                    <a
                      href={`/admin/news/edit/${news.id}`}
                      className="edit btn"     
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setNewsId(news.id); setModalConfirmDeleteActive(true) }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <Popup active={modalConfirmDeleteActive} setActive={closeModalConfirmDelete}>
      <h2 className="popup__title title">Вы действительно хотите удалить новость?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deleteNews(newsId)} className='confirm-button confirm-button_yes' disabled={isDeleteLoading} >
            {
              isDeleteLoading ? <Loader isOnlySpinner/>
                :
                <span>Да</span>
            }
          </button>
          <button className="confirm-button confirm-button_no" onClick={closeModalConfirmDelete}>Нет</button>
        </div>
      </Popup>
    </>
  );
};

export default NewsAdmin;
