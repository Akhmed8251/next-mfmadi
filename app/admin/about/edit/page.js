"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import AdvertisingService from "@/api/AdvertisingService";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";



const EditAbout = () => {
  const router = useRouter();

  const [addFileToAdvertising, isAddFileLoading, addFileErr] = useFetching(
    async (formData) => {
      const response = await AdvertisingService.addFileToAdvertising(formData);
      if (response.status == 200) {
        alert("Информация об МАДИ успешно обновлена!");
        router.push("/admin/about");
      }
    }
  );

  const [editAdvertising, isEditLoading, editErr] = useFetching(
    async (advertising, file = null) => {
      const response = await AdvertisingService.editAdvertising(advertising);
      if (response.status == 200) {
        if (file) {
          const formData = new FormData();
          formData.append("advertisingId", advertising.id);
          formData.append("formFile", file);

          addFileToAdvertising(formData);
        } else {
          alert("Информация об МАДИ успешно обновлена!");
          router.push("/admin/about");
        }
      } else {
        console.log(editErr);
      }
    }
  );

  const [editedAbout, setEditedAbout] = useState(null);
  const [getAbout, isAboutLoading, aboutErr] = useFetching(async () => {
    const response = await AdvertisingService.getMainPageDownAdvertising();
    if (response.status == 200) {
      setEditedAbout(response.data);
      reset({
        title: response.data.title || "",
        mainText: response.data.mainText || "",
        link: response.data.buttonLink,
        buttonText: response.data.buttonText,
      });
    }
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onSubmit",
  });

  const onEdit = (data) => {
    const newAdvertising = {
      id: editedAbout.id,
      mainText: data.mainText,
      title: data.title,
      buttonText: data.buttonText,
      buttonLink: data.link,
      avatarFileName: editedAbout.avatarFileName,
      createDate: editedAbout.createDate,
      mainSliderIsVisible: false,
      mainPageDownIsVisible: true,
      isDeleted: false,
      content: null,
    };

    editAdvertising(newAdvertising, data.fileModel);
  };

  useEffect(() => {
    document.title = "Изменение информации об МАДИ - МФ МАДИ";
    getAbout();
  }, []);

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Изменение информации об МАДИ</h1>
        {isAboutLoading ? (
          <Loader />
        ) : (
          <form
            action="#"
            className="admin-login__form form"
            onSubmit={handleSubmit(onEdit)}
            encType="multipart/form-data"
          >
            <label className="form__label">
              <span className="form__text">Заголовок</span>
              <Controller
                control={control}
                name="title"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    type="text"
                    value={value}
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue)}
                  />
                )}
              />
            </label>
            <label className="form__label">
              <span className="form__text">Главный текст</span>
              <Controller
                control={control}
                name="mainText"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    type="text"
                    value={value}
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue)}
                  />
                )}
              />
            </label>
            <label className="form__label">
              <span className="form__text">Текст кнопки</span>
              <Controller
                control={control}
                name="buttonText"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    type="text"
                    value={value}
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue)}
                  />
                )}
              />
            </label>
            <label className="form__label">
              <span className="form__text">Ссылка</span>
              <Controller
                control={control}
                name="link"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    type="text"
                    value={value}
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue)}
                  />
                )}
              />
            </label>
            <label className="form__label">
              <span className="form__text">Изображение</span>
              <Controller
                control={control}
                name="fileModel"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <input
                    type="file"
                    accept=".jpg, .jpeg,.png, .svg, .webp, .avif"
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue.target.files[0])}
                  />
                )}
              />
            </label>
            <button
              className={`form__btn btn`}
              disabled={isEditLoading || isAddFileLoading}
            >
              {isEditLoading || isAddFileLoading ? "Изменение..." : "Изменить"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EditAbout;
