"use client"

import { useState, useEffect } from "react";
import logo from "../assets/images/logo.svg";
import Loader from "./ui/Loader";
import { useFetching } from "@/hooks/useFetching";
import MainMenuService from "@/api/MainMenuService";

const Footer = () => {
  const [mainMenu, setMainMenu] = useState([])
  const [getMainMenu, isMenuLoading, menuErr] = useFetching(async () => {
    const response = await MainMenuService.getMainMenu()
    if (response.status === 200) {
      setMainMenu(response.data)
    } else {
      console.log(menuErr)
    }
  });

  useEffect(() => {
    getMainMenu()
  }, [])

  return (
    <footer className="footer">
      <div className="footer__top footer-top">
        <div className="footer-top__container container">
          <div className="footer-top__logo-wrapper">
            <div className="footer-top__logo logo">
              <a href={"/"} className="logo__img">
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
                  data-da=".footer-top__logo-wrapper, 575, 1"
                >
                  Московский автомобильно-дорожный государственный технический
                  университет
                </span>
              </div>
            </div>
            <span className="logo__name">
              ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ
              ВЫСШЕГО ОБРАЗОВАНИЯ
            </span>
          </div>
          <ul className="footer-top__list">
            {isMenuLoading ? <Loader/>
              :
              mainMenu.filter((m) => m.topMainPageIsVisible === true).map((mainMenuItem, idx) => (
                <li key={idx} className="footer-top__item">
                  <a href={mainMenuItem.link} className="footer-top__link">
                    {mainMenuItem.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <ul className="footer__menu-list">
        {isMenuLoading ? <Loader/>
              :
          mainMenu
          .filter((m) => m.menuAboveAdvertisingIsVisible === true)
          .map((mainMenuItem, idx) => (
            <li
              key={idx}
              className={`footer__menu-item ${
                idx % 2 != 0 ? "footer__menu-item_dark" : ""
              }`}
            >
              <a
                href={mainMenuItem.link}
                className="footer__menu-link"
                target="_blank"
              >
                {mainMenuItem.name}
              </a>
            </li>
          ))}
      </ul>
      <div className="footer__bottom footer-bottom">
        <div className="footer-bottom__container container">
          <ul className="footer-bottom__list">
            {isMenuLoading ? <Loader/>
              :
            mainMenu.filter(m =>
                  m.topMainPageIsVisible === false &&
                  m.sideMenuIsVisible === false &&
                  m.menuAboveAdvertisingIsVisible === false &&
                  m.childMenu &&
                  m.childMenu.length > 0
              ).map((mainMenuItem, idx) => (
                <li key={idx} className="footer-bottom__item footer-item">
                  <a href={mainMenuItem.link} className="footer-item__title">
                    {mainMenuItem.name}
                  </a>
                  <ul className="footer-item__elements">
                    {mainMenuItem.childMenu?.map((childMenuItem, idx) => (
                      <li key={idx} className="footer-item__element">
                        <a
                          href={childMenuItem.link}
                          className="footer-item__link"
                        >
                          {childMenuItem.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
          <div className="footer-bottom__links">
            {
              isMenuLoading ? <Loader/>
              :
              mainMenu.filter(
                (m) =>
                  m.topMainPageIsVisible === false &&
                  m.sideMenuIsVisible === false &&
                  m.menuAboveAdvertisingIsVisible === false &&
                  m.childMenu.length == 0
              )
              .map((mainMenuItem, idx) => (
                <a
                  key={idx}
                  href={mainMenuItem.link}
                  className="footer-bottom__link"
                >
                  {mainMenuItem.name}
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
