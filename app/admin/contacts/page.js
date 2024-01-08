"use client"

import { useEffect, useState } from "react";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import Popup from "@/components/ui/Popup"
import ContactsService from "@/api/ContactsService";
import getLocalStorage from "@/storage";

const ContactsAdmin = () => {
  const { setCurrentPageName } = getLocalStorage()

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] = useState(false)

  const [contactId, setContactId] = useState(null)
  const [contacts, setContacts] = useState([]);
  const [getContacts, isContactsLoading, contactsErr] = useFetching(async () => {
    const response = await ContactsService.getContacts();
    if (response.status == 200) {
      setContacts(response.data);
    } else {
      console.log(contactsErr);
    }
  });

  const [deleteContact, isDeleteLoading, deleteErr] = useFetching(async (contactId) => {
    const response = await ContactsService.deleteContact(contactId)
    if (response.status == 200) {
      alert("Контакт успешно удален!");
      closeModalConfirmDelete()
      deleteContactFromTable(contactId)
    } else {
      console.log(deleteErr);
    }
  });

  const closeModalConfirmDelete = () => {
    setContactId(null); 
    setModalConfirmDeleteActive(false)
  }

  const deleteContactFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  useEffect(() => {
    document.title = "Контакты - МФ МАДИ"
    setCurrentPageName("Контакты");
    getContacts();
  }, []);

  const contactTypes = {
    0: "Наш адрес",
    1: "Телефон",
    2: "График работы",
    3: "Приемная МФ МАДИ"
  }


  return (
    <>
      <section>
        <h1 className="admin-title title">Контакты</h1>
        <a href={"/admin/contacts/create"} className="create btn">
          Создать
        </a>
        {isContactsLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата создания</th>
                <th>Тип контакта</th>
                <th>Название</th>
                <th>Значение</th>
                <th>Отображается в верху страницы</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, idx) => (
                <tr data-id={contact.id} key={idx}>
                  <td>{formatTime(contact.createDate)}</td>
                  <td>{contactTypes[contact.contactType]}</td>
                  <td>{contact.name}</td>
                  <td>{contact.value}</td>
                  <td>{contact.isTopMainPageVisible ? "Да": "Нет"}</td>
                  <td className="actions">
                    <a
                      href={`/admin/contacts/edit/${contact.id}`}
                      className="edit btn"
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setContactId(contact.id); setModalConfirmDeleteActive(true) }}>
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
      <h2 className="popup__title title">Вы действительно хотите удалить контакт?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deleteContact(contactId)} className='confirm-button confirm-button_yes' disabled={isDeleteLoading} >
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

export default ContactsAdmin;
