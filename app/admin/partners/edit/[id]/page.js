"use client"

import { Controller, useForm } from "react-hook-form";
import PartnersService from "@/api/PartnersService";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

const EditPartner = ({ params }) => {
  const router = useRouter();

  const [editPartner, isEditLoading, createErr] = useFetching(
    async (formData) => {
      const response = await PartnersService.editPartner(formData);
      if (response.status == 200) {
        alert("Партнер успешно обновлен!");
        router.push("/admin/partners");
      } else {
        console.log(createErr);
      }
    }
  );

  const [editedPartner, setEditedPartner] = useState(null);
  const [getPartner, isPartnerLoading, partnerErr] = useFetching(async (id) => {
    const response = await PartnersService.getPartnerById(id);
    if (response.status == 200) {
      setEditedPartner(response.data);
      reset({
        name: response.data.name,
        link: response.data.link,
      });
    }
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onSubmit",
  });

  const onEdit = (data) => {
    const formData = new FormData();
    formData.append("partnerId", editedPartner.id);
    formData.append("name", data.name);
    formData.append("link", data.link);

    if (data.fileModel) {
      formData.append("formFile", data.fileModel[0]);
    }

    editPartner(formData);
  };

  useEffect(() => {
    document.title = "Изменение партнера - МФ МАДИ"
    getPartner(params.id);
  }, []);

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Изменение партнера</h1>
        {isPartnerLoading ? (
          <Loader />
        ) : (
          <form
            action="#"
            className="admin-login__form form"
            onSubmit={handleSubmit(onEdit)}
            encType="multipart/form-data"
          >
            <label className="form__label">
              <span className="form__text">Название</span>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    value={value}
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
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    value={value}
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
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <input
                    type="file"
                    accept=".jpg, .jpeg,.png, .svg, .webp, .avif"
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue.target.files)}
                  />
                )}
              />
            </label>
            <button className={`form__btn btn`} disabled={isEditLoading}>
              {isEditLoading ? "Изменение..." : "Изменить"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EditPartner;
