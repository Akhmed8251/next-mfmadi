import { useLocalStorageValue } from "@react-hookz/web";

export default function getLocalStorage() {
    const {value: isAuth, set: setIsAuth} = useLocalStorageValue("isAuth", {
        defaultValue: false
    });
    const {value: employeeName, set: setEmployeeName, remove: removeEmployeeName} = useLocalStorageValue("employeeName", {
        defaultValue: null
    });
    const {value: isOpenSidebar, set: setIsOpenSidebar, remove: removeIsOpenSidebar} = useLocalStorageValue("isOpenSidebar", {
        defaultValue: true
    });
    const {value: currentPageName, set: setCurrentPageName, remove: removeCurrentPageName} = useLocalStorageValue("currentPageName", {
        defaultValue: null
    });

    return { isAuth, isOpenSidebar, setIsOpenSidebar, removeIsOpenSidebar, setIsAuth, employeeName, setEmployeeName, removeEmployeeName, currentPageName, setCurrentPageName, removeCurrentPageName }
}

