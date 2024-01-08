"use client"

import { useEffect, useState } from "react";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import Popup from "@/components/ui/Popup"
import ContentService from "@/api/ContentService";
import getLocalStorage from "@/storage";

const PagesAdmin = () => {
  const { setCurrentPageName } = getLocalStorage();

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] = useState(false)

  const [pageId, setPageId] = useState(null)
  const [pages, setPages] = useState([]);
  const [getPages, isPagesLoading, pagesErr] = useFetching(async () => {
    const response = await ContentService.getContents();
    if (response.status == 200) {
      setPages(response.data);
    } else {
      console.log(pagesErr);
    }
  });

  const [deletePage, isDeleteLoading, deleteErr] = useFetching(async (contentId) => {
    const response = await ContentService.deleteContent(contentId)
    if (response.status == 200) {
      alert("Страница успешно удалена!");
      closeModalConfirmDelete()
      deletePageFromTable(contentId)
    } else {
      console.log(deleteErr);
    }
  });

  const closeModalConfirmDelete = () => {
    setPageId(null); 
    setModalConfirmDeleteActive(false)
  }

  const deletePageFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  useEffect(() => {
    document.title = "Страницы - МФ МАДИ"
    setCurrentPageName("Страницы");
    getPages();
  }, []);


  return (
    <>
      <section>
        <h1 className="admin-title title">Страницы</h1>
        <a href={"/admin/pages/create"} className="create btn">
          Создать
        </a>
        {isPagesLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Дата создания</th>
                <th>Заголовок</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {pages.filter(p => p.newsId == null).map((page, idx) => (
                <tr data-id={page.id} key={idx}>
                  <td>{page.id}</td>
                  <td>{formatTime(page.createDate)}</td>
                  <td>{page.title}</td>
                  <td className="actions">
                    <a
                      href={`/admin/pages/edit/${page.id}`}
                      className="edit btn"
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setPageId(page.id); setModalConfirmDeleteActive(true) }}>
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
      <h2 className="popup__title title">Вы действительно хотите удалить страницу?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deletePage(pageId)} className='confirm-button confirm-button_yes' disabled={isDeleteLoading} >
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

export default PagesAdmin;
