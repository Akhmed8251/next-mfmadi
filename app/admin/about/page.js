"use client"

import { useEffect, useState } from "react";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import AdvertisingService from "@/api/AdvertisingService";
import { FILES_URL } from "@/api/config";
import getLocalStorage from "@/storage";

const AdvertisingsAdmin = () => {
  const { setCurrentPageName } = getLocalStorage();

  const [advertising, setAdvertising] = useState([]);
  const [getMainPageDownAdvertising, isAdvertisingsLoading, advertisingsErr] =
    useFetching(async () => {
      const response = await AdvertisingService.getMainPageDownAdvertising();
      if (response.status == 200) {
        setAdvertising(response.data);
      } else {
        console.log(advertisingsErr);
      }
    });

  useEffect(() => {
    document.title = 'Об МАДИ - МФ МАДИ'
    setCurrentPageName("ОбМАДИ");
    getMainPageDownAdvertising();
  }, []);

  return (
    <>
      <section>
        <h1 className="admin-title title">Об МАДИ</h1>
        {isAdvertisingsLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Главный текст</th>
                <th>Изображение</th>
                <th>Текст кнопки</th>
                <th>Ссылка</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr data-id={advertising.id}>
                <td>{advertising.title}</td>
                <td>{advertising.mainText}</td>
                <td style={{ width: "300px" }}>
                  <img
                    src={`${FILES_URL}/${advertising.avatarFileName}`}
                    alt=""
                  />
                </td>
                <td>{advertising.buttonText}</td>
                <td>
                  <a href={advertising.buttonLink}>{advertising.buttonLink}</a>
                </td>
                <td className="actions">
                  <a
                    href={'/admin/about/edit/'}
                    className="edit btn"
                  >
                    Изменить
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </>
  );
};

export default AdvertisingsAdmin;
