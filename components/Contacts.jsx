"use client"

import { useState, useEffect } from "react";
import { useFetching } from "../hooks/useFetching";
import ContactsService from "../api/ContactsService";
import Loader from "./ui/Loader";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [getContacts, isContactsLoading, contactsErr] = useFetching(
    async () => {
      const response = await ContactsService.getContacts();
      if (response.status === 200) {
        setContacts(
          response.data.sort((a, b) => a.contactType - b.contactType)
        );
      } else {
        console.log(contactsErr);
      }
    }
  );

  useEffect(() => {
    getContacts();
  }, []);

  const contactTypes = {
    0: "Наш адрес",
    1: "Телефон",
    2: "График работы",
    3: "Приемная МФ МАДИ",
  };

  return (
    <section className="contacts">
      <div className="contacts__container container">
        <h2 className="contacts__title title">КОНТАКТЫ</h2>
        <ul className="contacts__list">
          <li className="contacts__item contacts-item">
            <h3 className="contacts-item__title">{contactTypes[0]}</h3>
            <div className="contacts-item__values">
              {isContactsLoading ? (
                <Loader />
              ) : (
                contacts
                  .filter((c) => c.contactType == 0)
                  .map((contact, idx) => (
                    <span
                      key={idx}
                      className={`contacts-item__value contacts-item__value_address`}
                    >
                      {contact.value}
                    </span>
                  ))
              )}
            </div>
          </li>
          <li className="contacts__item contacts-item">
            <h3 className="contacts-item__title">{contactTypes[1]}</h3>
            <div className="contacts-item__values">
              {isContactsLoading ? (
                <Loader />
              ) : (
                contacts
                  .filter((c) => c.contactType == 1)
                  .map((contact, idx) => (
                    <span
                      key={idx}
                      className={`contacts-item__value`}
                    >
                      {contact.value}
                    </span>
                  ))
              )}
            </div>
          </li>
          <li className="contacts__item contacts-item">
            <h3 className="contacts-item__title">{contactTypes[2]}</h3>
            <div className="contacts-item__values">
              {isContactsLoading ? (
                <Loader />
              ) : (
                contacts
                  .filter((c) => c.contactType == 2)
                  .map((contact, idx) => (
                    <span
                      key={idx}
                      className={`contacts-item__value contacts-item__value_worktime`}
                    >
                      {contact.value}
                    </span>
                  ))
              )}
            </div>
          </li>
          {isContactsLoading ? (
            <Loader />
          ) : (
            <li className="contacts__item contacts-item">
              <h3 className="contacts-item__title">{contactTypes[3]}</h3>
              <ul className="contacts-item__elements">
                {contacts
                  .filter((c) => c.contactType == 3)
                  .map((contactReceptionItem, idx) => (
                    <li key={idx} className="contacts-item__element">
                      <a
                        href={`mailto:${contactReceptionItem.value}`}
                        className="contacts-item__element-link"
                      >
                        {contactReceptionItem.value + " "}
                      </a>
                      <span className="contacts-item__element-text">
                        - {contactReceptionItem.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Contacts;
