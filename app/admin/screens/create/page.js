"use client"

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import ContentService from "@/api/ContentService";
import CKEditorUI from "@/components/ui/CKEditorUI";
import Popup from "@/components/ui/Popup";
import { useEffect, useState } from "react";
import { parsingCKEditorData } from "@/utils/accordion";
import faq from "@/assets/images/faq.svg";
import tabsIcon from "@/assets/images/tabs.svg";
import {v4} from 'uuid'
import FileModelService from "@/api/FileModelService";

const CreatePage = () => {
  const router = useRouter();

  const [modalAccordeon, setModalAccordeon] = useState(false);
  const [modalTabs, setModalTabs] = useState(false);

  const [createPage, isCreateLoading, createErr] = useFetching(
    async (content, files = null) => {
      const response = await ContentService.createContent(content);
      if (response.status == 200) {
        if (files != null) {
          const formData = new FormData()
          formData.append("contentId", response.data.id)
          Array.from(files).forEach(file => {
            formData.append("formFiles", file)
          })
          createFileModel(formData)
        } else {
          alert("Страница успешно создана!");
          router.push("/admin/screens");
        }
      } else {
        console.log(createErr);
      }
    }
  );

  const [createFileModel, isCreateFileModelLoading, createFileModelErr] = useFetching(async (creatingFileModel) => {
    const response = await FileModelService.createFileModel(creatingFileModel)
    if (response.status == 200) {
      alert("Страница успешно создана!")
      router.push('/admin/screens')
    }
  })

  const { control, handleSubmit } = useForm({
    mode: "onSubmit",
  });

  const { control: controlTabs, handleSubmit: handleSubmitTabs } = useForm({
    mode: "onSubmit",
    defaultValues: {
      tabs: [{ title: "", tabHtmlContent: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tabs",
    control: controlTabs,
  });

  const { control: controlAccordion, handleSubmit: handleSubmitAccordion } =
    useForm({
      mode: "onSubmit",
      defaultValues: {
        accordions: [{ title: "", accordionHtmlContent: "" }]
      }
    });

  const { fields: fieldsAccordion, append: appendAccordion, remove: removeAccordion } = useFieldArray({
    name: "accordions",
    control: controlAccordion,
  });

  const addAccordionToCkeditor = (data) => {
    let accordeonHTML = "<ul>";

    data.accordions.forEach(accEl => {
      const accItemHtml = `
        <li>
          <div class="accordeon__control">
            <p>${accEl.title}</p>
            <div class="accordeon__icon"></div>
          </div>
          <div class="accordeon__content">
            ${accEl.accordionHtmlContent}
          </div>
        </li>
      `;
      accordeonHTML += accItemHtml
    })

    accordeonHTML += "</ul>"

    const ckeditorData = window.CKEDITOR.instances['editor1'].getData()
    window.CKEDITOR.instances['editor1'].setData(ckeditorData + accordeonHTML)

    setModalAccordeon(false);
  };

  const addTabsToCkeditor = (data) => {   
    let tabsHtml = '<div class="tabs-wrapper"><div class="tabs">'

    let tabHtml = ''
    let tabContentHtml = ''
    data.tabs.forEach((tab, idx) => {
      const uid = v4()  
      tabHtml += `
        <a href="#tab-${uid}" class="tab ${idx == 0 ? " _active" : ""}">${tab.title}</a>
      `
      tabContentHtml += `
        <div id="tab-${uid}" class="tabs-content ${idx == 0 ? " _active" : ""}">
          ${tab.tabHtmlContent}
        </div>
      `
    })
    tabsHtml += tabHtml
    tabsHtml += '</div></div>'

    tabsHtml += '<div class="tabs-container">'
    tabsHtml += tabContentHtml
    tabsHtml += '</div>'

    const ckeditorData = window.CKEDITOR.instances['editor1'].getData()
    window.CKEDITOR.instances['editor1'].setData(ckeditorData + tabsHtml)

    setModalTabs(false);

  }

  const onCreate = (data) => {
    const pageContent = {
      title: data.title,
      htmlContent: parsingCKEditorData(data.htmlContent),
      contentType: 0,
      isDeleted: false,
      parentContentId: null,
      parentContent: null,
      newsId: null,
      advertisingId: null,
    };

    createPage(pageContent, data.fileModels);
  };

  useEffect(() => {
    document.title = "Создание страницы - МФ МАДИ"
  }, [])

  return (
    <>
      <section>
        <div className="container">
          <h1 className="admin-title title">Создание страницы</h1>
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
              <span className="form__text">Файлы (Документы) к странице</span>
              <Controller
                control={control}
                name="fileModels"
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <input
                    type="file"
                    multiple={true}
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue.target.files)}
                  />
                )}
              />
            </label>
            <label className="form__label">
              <span className="form__text">Контент</span>
              <Controller
                control={control}
                name="htmlContent"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div>
                    <button
                      title="Добавить FAQ"
                      type="button"
                      onClick={() => setModalAccordeon(true)}
                    >
                      <img
                        width={32}
                        style={{ padding: "4px" }}
                        height={32}
                        src={faq.src}
                        alt=""
                      />
                    </button>
                    <button
                      title="Добавить вкладки"
                      type="button"
                      onClick={() => setModalTabs(true)}
                    >
                      <img
                        width={32}
                        style={{ padding: "4px" }}
                        height={32}
                        src={tabsIcon.src}
                        alt=""
                      />
                    </button>
                    <div className={`${error ? "error" : ""}`}>
                      <CKEditorUI
                        onChange={(newValue) => {
                          onChange(newValue.editor.getData());
                        }}
                      />
                    </div>
                  </div>
                )}
              />
            </label>
            <button className={`form__btn btn`} disabled={isCreateLoading || isCreateFileModelLoading}>
              {isCreateLoading || isCreateFileModelLoading ? "Создание..." : "Создать"}
            </button>
          </form>
        </div>
      </section>
      <Popup active={modalAccordeon} setActive={setModalAccordeon}>
        <h2 className="popup__title title">Создание FAQ элемента</h2>
        <div className="accordion">
          <form
            className="form"
            onSubmit={handleSubmitAccordion(addAccordionToCkeditor)}
          >
            {fieldsAccordion.map((field, idx) => (
              <>
                <div className="form__item" data-key={idx}>
                  <label className="form__label">
                    <span className="form__text">Заголовок</span>
                    <Controller
                      control={controlAccordion}
                      name={`accordions.${idx}.title`}
                      rules={{
                        required: true,
                      }}
                      render={({
                        field: { onChange },
                        fieldState: { error },
                      }) => (
                        <input
                          type="text"
                          className={`form__input ${error ? " error" : ""}`}
                          onChange={(newValue) => onChange(newValue)}
                        />
                      )}
                    />
                  </label>
                  <label className="form__label">
                    <span className="form__text">Контент</span>
                    <Controller
                      control={controlAccordion}
                      name={`accordions.${idx}.accordionHtmlContent`}
                      rules={{
                        required: true,
                      }}
                      render={({
                        field: { onChange },
                        fieldState: { error },
                      }) => (
                        <div className={`${error ? "error" : ""}`}>
                          <CKEditorUI
                            name={`accordions.${idx}`}
                            onChange={(newValue) => {
                              onChange(newValue.editor.getData());
                            }}
                          />
                        </div>
                      )}
                    />
                  </label>
                  <div style={{ display: "flex", gap: "20px" }}>
                  {
                    idx > 0 && 
                      <button data-key={idx} className="btn delete" type="button" onClick={() => removeAccordion(idx)}>Удалить</button>
                  }
                  </div>
                </div>
                
              </>
            ))}
            <button className="btn" type="button" onClick={() => appendAccordion({ title: "", accordionHtmlContent: "" })}>Добавить</button>
            <button className="btn">Создать</button>
          </form>
        </div>
      </Popup>
      <Popup active={modalTabs} setActive={setModalTabs}>
        <h2 className="popup__title title">Создание вкладок</h2>
        <div className="accordion">
          <form
            className="form"
            onSubmit={handleSubmitTabs(addTabsToCkeditor)}
          >
            {fields.map((field, idx) => (
              <>
                <div className="form__item" key={idx}>
                  <label className="form__label">
                    <span className="form__text">Заголовок</span>
                    <Controller
                      control={controlTabs}
                      name={`tabs.${idx}.title`}
                      rules={{
                        required: true,
                      }}
                      render={({
                        field: { onChange },
                        fieldState: { error },
                      }) => (
                        <input
                          type="text"
                          className={`form__input ${error ? " error" : ""}`}
                          onChange={(newValue) => onChange(newValue)}
                        />
                      )}
                    />
                  </label>
                  <label className="form__label">
                    <span className="form__text">Контент</span>
                    <Controller
                      control={controlTabs}
                      name={`tabs.${idx}.tabHtmlContent`}
                      rules={{
                        required: true,
                      }}
                      render={({
                        field: { onChange },
                        fieldState: { error },
                      }) => (
                        <div className={`${error ? "error" : ""}`}>
                          <CKEditorUI
                            name={`tabs.${idx}`}
                            onChange={(newValue) => {
                              onChange(newValue.editor.getData());
                            }}
                          />
                        </div>
                      )}
                    />
                  </label>
                  <div style={{ display: "flex", gap: "20px" }}> 
               {idx > 0 && <button className="btn delete" type="button" onClick={() => remove(idx)}>Удалить</button>}
                  </div>
                </div>
                
              </>
            ))}
            <button className="btn" type="button" onClick={() => append({ title: "", tabHtmlContent: "" })}>Добавить</button>
            <button className="btn">Создать</button>
          </form>
        </div>
      </Popup>
    </>
  );
};

export default CreatePage;
