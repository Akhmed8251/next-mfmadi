"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import AdvertisingService from "@/api/AdvertisingService";
import { useEffect } from "react";

const CreateAdvertising = () => {
  const router = useRouter()

  const [addFileToAdvertising, isAddFileLoading, addFileErr] =
    useFetching(async (formData) => {
      const response = await AdvertisingService.addFileToAdvertising(
        formData
      );
      if (response.status == 200) {
        alert("Объявление успешно создано!");
        router.push("/admin/advertisings");
      }
    });

  const [createAdvertising, isCreateLoading, createErr] = useFetching(async (advertising, file) => {
    const response = await AdvertisingService.createAdvertising(advertising)
    if (response.status == 200) {
      const formData = new FormData()
      formData.append("advertisingId", response.data.id)
      formData.append("formFile", file)

      addFileToAdvertising(formData)
    } else {
      console.log(createErr)
    }
  })

  
  const {control, handleSubmit, watch } = useForm({
    mode: "onSubmit",
    defaultValues: {
      isInSlider: false
    }
  })

  const watchIsInSlider = watch("isInSlider", false)

  const onCreate = (data) => {
    const newAdvertising = {
      buttonLink: data.link,
      mainSliderIsVisible: data.isInSlider
    }

    if (data.isInSlider) {
      newAdvertising.mainText = data.mainText
      newAdvertising.title = data.title
    }

    createAdvertising(newAdvertising, data.fileModel)
  }

  useEffect(() => {
    document.title = 'Создание объявления - МФ МАДИ'
  }, [])

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Создание объявления</h1>
        <form
          action="#"
          className="admin-login__form form"
          onSubmit={handleSubmit(onCreate)}
          encType="multipart/form-data"
        >
          <label className="form__label">
            <span className="form__text">Заголовок</span>
            <Controller
              control={control}
              name="title"
              rules={{
                required: watchIsInSlider,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="text"
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
                required: watchIsInSlider,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="text"
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
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="text"
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
              rules={{
                required: true,
              }}
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
          <label className="form__label form__label_checkbox">
            <span className="form__text">В слайдере на главной странице? </span>
            <Controller
              control={control}
              name="isInSlider"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.checked)}
                />
              )}
            />
          </label>
          <button
            className={`form__btn btn`}
            disabled={isCreateLoading || isAddFileLoading}
          >
            {isCreateLoading || isAddFileLoading  ? "Создание..." : "Создать"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateAdvertising;
