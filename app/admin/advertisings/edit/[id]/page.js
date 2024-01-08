"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import AdvertisingService from "@/api/AdvertisingService";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";


const EditAdvertising = ({ params }) => {
  const router = useRouter();


  const [addFileToAdvertising, isAddFileLoading, addFileErr] = useFetching(
    async (formData) => {
      const response = await AdvertisingService.addFileToAdvertising(formData);
      if (response.status == 200) {
        alert("Объявление успешно обновлено!");
        router.push("/admin/advertisings");
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
          alert("Объявление успешно обновлено!");
          router.push("/admin/advertisings");
        }
      } else {
        console.log(editErr);
      }
    }
  );

  const [watchDefault, setWatchDefault] = useState(false)
  const [editedAdvertising, setEditedAdvertising] = useState(null);
  const [getAdvertisingById, isAdvertisingsLoading, advertisingErr] =
    useFetching(async (advertisingId) => {
      const response = await AdvertisingService.getAdvertisingById(
        advertisingId
      );
      if (response.status == 200) {
        setEditedAdvertising(response.data);
        setWatchDefault(response.data.mainSliderIsVisible)
        reset({
          title: response.data.title,
          mainText: response.data.mainText,
          link: response.data.buttonLink,
          isInSlider: response.data.mainSliderIsVisible,
        });
        
      }
    });

  const { control, handleSubmit, formState: {defaultValues}, watch, reset } = useForm({
    mode: "onSubmit"
  });

  const onEdit = (data) => {
    const newAdvertising = {
      id: editedAdvertising.id,
      title: data.title,
      mainText: data.mainText,
      createDate: editedAdvertising.createDate,
      buttonLink: data.link,
      mainSliderIsVisible: data.isInSlider,
      avatarFileName: editedAdvertising.avatarFileName,
    };

    if (data.isInSlider) {
      newAdvertising.mainText = data.mainText;
      newAdvertising.title = data.title;
    }

    editAdvertising(newAdvertising, data.fileModel);
  };

  useEffect(() => {
    document.title = 'Изменение объявления - МФ МАДИ'
    getAdvertisingById(params.id);
  }, []);
  
  const watchIsInSlider = watch("isInSlider", watchDefault);

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Изменение объявления</h1>
        {isAdvertisingsLoading ? (
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
                  required: watchIsInSlider,
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
                  required: watchIsInSlider,
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
            <label className="form__label form__label_checkbox">
              <span className="form__text">
                В слайдере на главной странице?{" "}
              </span>
              <Controller
                control={control}
                name="isInSlider"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    checked={value}
                    type="checkbox"
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue.target.checked)}
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

export default EditAdvertising;
