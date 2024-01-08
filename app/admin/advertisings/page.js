"use client"

import { useEffect, useState } from "react";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import Popup from "@/components/ui/Popup"
import AdvertisingService from "@/api/AdvertisingService";
import { FILES_URL } from "@/api/config";
import getLocalStorage from "@/storage";

const AdvertisingsAdmin = () => {
  const { setCurrentPageName } = getLocalStorage();

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] = useState(false)

  const [advertisingId, setAdvertisingId] = useState(null)
  const [advertisings, setAdvertisings] = useState([]);
  const [getAdvertisings, isAdvertisingsLoading, advertisingsErr] = useFetching(async () => {
    const response = await AdvertisingService.getAdvertisings();
    if (response.status == 200) {
      setAdvertisings(response.data);
    } else {
      console.log(advertisingsErr);
    }
  });

  const [deleteAdvertising, isDeleteLoading, deleteErr] = useFetching(async (advertisingId) => {
    const response = await AdvertisingService.deleteAdvertising(advertisingId)
    if (response.status == 200) {
      alert("Реклама успешно удалена!");
      closeModalConfirmDelete()
      deleteAdvertisingFromTable(advertisingId)
    } else {
      console.log(deleteErr);
    }
  });

  const closeModalConfirmDelete = () => {
    setAdvertisingId(null); 
    setModalConfirmDeleteActive(false)
  }

  const deleteAdvertisingFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  useEffect(() => {
    document.title = 'Объявления - МФ МАДИ'
    setCurrentPageName("Объявления");
    getAdvertisings();
  }, []);


  return (
    <>
      <section>
        <h1 className="admin-title title">Объявления</h1>
        <a href={"/admin/advertisings/create"} className="create btn">
          Создать
        </a>
        {isAdvertisingsLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата создания</th>
                <th>Заголовок</th>
                <th>Главный текст</th>
                <th>Изображение</th>
                <th>Ссылка</th>
                <th>В слайдере на главной странице</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {advertisings.map((advertising, idx) => (
                <tr data-id={advertising.id} key={idx}>
                  <td>{formatTime(advertising.createDate)}</td>
                  <td>{advertising.title}</td>
                  <td>{advertising.mainText}</td>
                  <td style={{ width: '400px' }}>
                    <img src={`${FILES_URL}/${advertising.avatarFileName}`} alt="" />
                  </td>
                  <td>
                    <a href={advertising.buttonLink}>{advertising.buttonLink}</a>
                  </td>
                  <td>{advertising.mainSliderIsVisible ? "Да" : "Нет"}</td>
                  <td className="actions">
                    <a
                      href={`/admin/advertisings/edit/${advertising.id}`}
                      className="edit btn"
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setAdvertisingId(advertising.id); setModalConfirmDeleteActive(true) }}>
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
      <h2 className="popup__title title">Вы действительно хотите удалить объявление?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deleteAdvertising(advertisingId)} className='confirm-button confirm-button_yes' disabled={isDeleteLoading} >
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

export default AdvertisingsAdmin;
