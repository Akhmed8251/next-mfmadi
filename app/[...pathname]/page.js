import Loader from "@/components/ui/Loader";
import ContentService from "@/api/ContentService";
import dynamic from "next/dynamic";
import Script from "next/script";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  const contentId = parseInt(params.pathname[params.pathname.length - 1]);

  if (isNaN(contentId)) {
  } else {
    const response = await ContentService.getContentById(contentId);
    const contentInfo = response.data;

    return {
      title: `${contentInfo.title} - МФ МАДИ`,
    };
  }
};

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
  loading: () => <Loader />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <Loader />,
});

const getPageContent = async (contentId) => {
  if (isNaN(contentId)) {
    return null
  }

  const response = await ContentService.getContentById(contentId);

  const contentLength = parseInt(response.headers.get("content-length"));
  if (contentLength == 0) {
    return null;
  }

  const contentInfo = response.data;
  return contentInfo;
};

const PageContent = async ({ params }) => {
  const contentId = parseInt(params.pathname[params.pathname.length - 1]);
  const contentInfo = await getPageContent(contentId);

  if (contentInfo == null) {
    notFound()
  }
  return (
    <>
      <Header />
      <section className="content-page">
        <div className="content-page__container container">
          <h1 className="content-page__title title">{contentInfo?.title}</h1>
          <div
            className="content-page__content"
            dangerouslySetInnerHTML={{
              __html: contentInfo?.htmlContent || "",
            }}
          ></div>
        </div>
      </section>
      <Footer />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          const actions = (evt) => {
            const elem = evt.target;
            if (elem.classList.contains("accordeon__control")) {
              evt.preventDefault();
              accordion(elem);
            } else if (elem.classList.contains("tab")) {
              evt.preventDefault();
              tabs(elem);
            }
          };
          
          const accordion = (controlElem) => {
            const itemAccordeon = controlElem.closest("li");
            itemAccordeon.classList.toggle("_active");
          
            let accordeonContent = itemAccordeon.querySelector(".accordeon__content");
            if (itemAccordeon.classList.contains("_active")) {
              accordeonContent.style.maxHeight = accordeonContent.scrollHeight + "px";
            } else {
              accordeonContent.style.maxHeight = null;
            }
          };
          
          const tabs = (tabElem) => {
            for (let sibling of tabElem.parentNode.children) {
              sibling.classList.remove("_active");
            }
            for (let sibling of tabElem.closest(".tabs-wrapper").parentNode.children) {
              if (sibling.classList.contains("tabs-container")) {
                sibling.querySelectorAll(".tabs-content").forEach((content) => {
                  content.classList.remove("_active");
                });
              }
            }
            tabElem.classList.add("_active");
            document.querySelector(tabElem.getAttribute("href")).classList.add("_active");
          };
          
          const contentContainer = document.querySelector(".content-page__content");
          if (contentContainer) {
            contentContainer.addEventListener("click", function(evt) {
              actions(evt)
            })
          }
          `,
        }}
      ></Script>
    </>
  );
};

export default PageContent;
