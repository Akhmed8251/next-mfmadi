"use client";

import logo from "../assets/images/logo.svg";
import MainMenuService from "../api/MainMenuService";
import specialVision from "../assets/images/special-vision.svg";
import ContactsService from "../api/ContactsService";
import { useState, useEffect } from "react";
import { useFetching } from "../hooks/useFetching";
import Loader from "./ui/Loader";
import getLocalStorage from "../storage";
import Script from "next/script";

const Header = () => {
  const {
    isAuth,
    setIsAuth,
    employeeName,
    setEmployeeName,
    removeCurrentPageName
  } = getLocalStorage();
  const [mainMenu, setMainMenu] = useState([]);
  const [getMainMenu, isMenuLoading, menuErr] = useFetching(async () => {
    const response = await MainMenuService.getMainMenu();
    if (response.status === 200) {
      setMainMenu(response.data);
    } else {
      console.log(menuErr);
    }
  });

  const [contacts, setContacts] = useState([]);
  const [getContacts, isContactsLoading, contactsErr] = useFetching(
    async () => {
      const response = await ContactsService.getContactsForLineOnMainPage();
      if (response.status === 200) {
        setContacts(
          response.data
        );
      } else {
        console.log(contactsErr);
      }
    }
  );

  useEffect(() => {
    getMainMenu();
    getContacts();
  }, []);

  const logout = () => {
    setIsAuth(false);
    setEmployeeName(null);
  };

  const toggleSideMenu = () => {
    setIsOpenSideMenu((prev) => !prev);
    document.body.classList.toggle("no-scroll");
  };

  const openSubMenu = (menuWithSubmenu) => {
    menuWithSubmenu.classList.toggle("_open");

    const submenu = menuWithSubmenu.querySelector(".submenu");
    if (menuWithSubmenu.classList.contains("_open")) {
      submenu.style.maxHeight = submenu.scrollHeight + "px";
    } else {
      submenu.style.maxHeight = null;
    }
  };

  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);

  return (
    <>
      <Script src="https://lidrekon.ru/slep/js/jquery.js" />
      <Script src="https://lidrekon.ru/slep/js/uhpv-full.min.js" />
      <header className="header">
        <div className="header__top header-top">
          <div className="header-top__container container">
            <span className="header-top__name">
              ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ
              ВЫСШЕГО ОБРАЗОВАНИЯ
            </span>
            <div className="header-top__wrapper">
              {isContactsLoading ? (
                <Loader isOnlySpinner />
              ) : (
                contacts.map((contact, idx) => (
                  <span key={idx} className="header-top__wrapper-item">
                    {contact.value}
                  </span>
                ))
              )}
            </div>
            <div className="header-top__vision">
              <img
                src={specialVision.src}
                id="specialButton"
                className="header-top__vision-btn"
              />
            </div>
          </div>
        </div>
        <div className="header__admin">
          <div className="container">
            <div className="header__admin-content">
              {isAuth ? (
                <>
                  <a
                    href={"/admin"}
                    className="header__admin-name admin-name"
                    onClick={() => removeCurrentPageName()}
                  >
                    {employeeName}
                  </a>
                  <button
                    type="button"
                    className="btn logout-btn"
                    onClick={() => logout()}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <a href="/login" className="header__admin-btn btn">
                  Вход
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="header__main header-main">
          <div className="header-main__container container">
            <div className="header-main__logo-wrapper">
              <div className="header-main__logo logo">
                <a href="/" className="logo__img">
                  <img src={logo.src} alt="Логотип МАДИ" />
                </a>
                <div className="logo__text logo-text">
                  <div className="logo-text__wrapper">
                    <span className="logo-text__wrapper-item logo-text__wrapper-item_main">
                      МАДИ
                    </span>
                    <span className="logo-text__wrapper-item">
                      Махачкалинский филиал
                    </span>
                  </div>
                  <span
                    className="logo-text__item"
                    data-da=".header-main__logo-wrapper, 575, last"
                  >
                    Московский автомобильно-дорожный государственный технический
                    университет
                  </span>
                </div>
              </div>
            </div>
            <ul className="header-main__list">
              {isMenuLoading ? (
                <Loader />
              ) : (
                mainMenu
                  .filter((m) => m.topMainPageIsVisible === true)
                  .map((mainMenuItem, idx) => (
                    <li key={idx} className="header-main__item">
                      <a
                        href={mainMenuItem.link}
                        className="header-main__link"
                      >
                        {mainMenuItem.name}
                      </a>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
        <div className="header__bottom header-bottom">
          <div className="header-bottom__container container">
            <button
              onClick={() => toggleSideMenu()}
              type="button"
              className={`header-bottom__menu-btn ${
                isOpenSideMenu ? "_close" : ""
              }`}
              data-da=".header-top__container, 768, first"
            ></button>
            <div
              className={`header-bottom__menu header-menu ${
                isOpenSideMenu ? "_active" : ""
              }`}
            >
              <div
                className="header-menu__area"
                onClick={() => toggleSideMenu()}
              ></div>
              <div className="header-menu__body">
                <div className="header-menu__top">
                  <span className="header-menu__top-item header-menu__top-item_main">
                    МАДИ
                  </span>
                  <span className="header-menu__top-item">
                    Махачкалинский филиал
                  </span>
                </div>
                <ul className="header-menu__list">
                  {isMenuLoading ? (
                    <Loader />
                  ) : (
                    mainMenu
                      .filter((m) => m.sideMenuIsVisible === true)
                      .map((mainMenuItem, idx) =>
                        mainMenuItem.childMenu &&
                        mainMenuItem.childMenu.length > 0 ? (
                          <li
                            key={idx}
                            className="header-menu__item has-submenu"
                            onClick={(evt) =>
                              openSubMenu(evt.target.closest(".has-submenu"))
                            }
                          >
                            <div className="header-menu__submenu-wrapper submenu-wrapper">
                              <a
                                href={mainMenuItem.link}
                                className="submenu-wrapper__link"
                              >
                                {mainMenuItem.name}
                              </a>
                              <button className="submenu-wrapper__btn submenu-btn">
                                <div className="submenu-btn__icon">
                                  <svg
                                    width="18"
                                    height="11"
                                    viewBox="0 0 18 11"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1 1L9 9L17 1"
                                      stroke="#4a27c9"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                              </button>
                            </div>
                            <div className="submenu">
                              <ul className="submenu__list">
                                {mainMenuItem.childMenu.map(
                                  (childMenuItem, idx) => (
                                    <li key={idx} className="submenu__item">
                                      <a
                                        href={childMenuItem.link}
                                        className="submenu__link"
                                      >
                                        {childMenuItem.name}
                                      </a>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </li>
                        ) : (
                          <li key={idx} className="header-menu__item">
                            <a
                              href={mainMenuItem.link}
                              className="header-menu__link"
                            >
                              {mainMenuItem.name}
                            </a>
                          </li>
                        )
                      )
                  )}
                </ul>
              </div>
            </div>
            <ul className="header-bottom__list">
              {isMenuLoading ? (
                <Loader />
              ) : (
                mainMenu
                  .filter((m) => m.menuAboveAdvertisingIsVisible === true)
                  .map((mainMenuItem, idx) => (
                    <li
                      key={idx}
                      className={`header-bottom__item ${
                        idx % 2 != 0 ? "header-bottom__item_dark" : ""
                      }`}
                    >
                      <a
                        href={mainMenuItem.link}
                        className="header-bottom__link"
                        target="_blank"
                      >
                        {mainMenuItem.name}
                      </a>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
