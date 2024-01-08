"use client"

import { useState, useContext, useEffect } from "react";
import PartnersService from "@/api/PartnersService";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import { FILES_URL } from "@/api/config";
import Popup from "@/components/ui/Popup";
import getLocalStorage from "@/storage";

const PartnersAdmin = () => {
  const { setCurrentPageName } = getLocalStorage()

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] = useState(false)

  const [partnerId, setPartnerId] = useState(null)
  const [partners, setPartners] = useState([])
  const [getPartners, isPartnersLoading, partnersErr] = useFetching(async () => {
      const response = await PartnersService.getPartners()
      if (response.status === 200) {
          setPartners(response.data)
      } else {
          console.log(partnersErr)
      }
  })

  const [deletePartner, isDeletePartnerLoading, deletePartnersErr] = useFetching(async (partnerId) => {
    const response = await PartnersService.deletePartner(partnerId)
    if (response.status == 200) {
      alert("Партнер успешно удален!");
      closeModalConfirmDelete()
      deletePartnersFromTable(partnerId)
    } else {
      console.log(deletePartnersErr);
    }
  });

  const closeModalConfirmDelete = () => {
    setPartnerId(null); 
    setModalConfirmDeleteActive(false)
  }

  const deletePartnersFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  useEffect(() => {
    document.title = "Партнеры - МФ МАДИ"
    setCurrentPageName("Партнеры")
    getPartners()
  }, [])

  return (
    <>
      <section>
        <h1 className="admin-title title">Партнеры</h1>
        <a href={"/admin/partners/create"} className="create btn">
          Создать
        </a>
        {isPartnersLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата создания</th>
                <th>Название</th>
                <th>Изображение</th>
                <th>Ссылка</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, idx) => (
                <tr data-id={partner.id} key={idx}>
                  <td>{formatTime(partner.createDate)}</td>
                  <td>{partner.name}</td>
                  <td>
                    <img src={`${FILES_URL}/${partner.imageFileName}`} alt="" />
                  </td>
                  <td>
                    <a href={partner.link}>{partner.link}</a>
                  </td>
                  <td className="actions">
                    <a
                      href={`/admin/partners/edit/${partner.id}`}
                      className="edit btn"
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setPartnerId(partner.id); setModalConfirmDeleteActive(true) }}>
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
      <h2 className="popup__title title">Вы действительно хотите удалить партнера?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deletePartner(partnerId)} className='confirm-button confirm-button_yes' disabled={isDeletePartnerLoading} >
            {
              isDeletePartnerLoading ? <Loader isOnlySpinner/>
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

export default PartnersAdmin;
