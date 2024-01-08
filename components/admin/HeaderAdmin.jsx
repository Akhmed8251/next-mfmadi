import getLocalStorage from '../../storage'
import { useRouter } from 'next/navigation'

const HeaderAdmin = () => {
  const { isOpenSidebar, setIsOpenSidebar, setIsAuth, removeEmployeeName, removeIsOpenSidebar, employeeName, removeCurrentPageName } = getLocalStorage()
  const router = useRouter()
  
  const logout = () => {
    setIsAuth(false)
    removeEmployeeName()
    removeIsOpenSidebar()
    removeCurrentPageName()
    router.push('/login')
  }

  return (
    <header className="admin-header">
        <div className="admin-header__container container">
            <div className="admin-header__content">
                <a href="/admin" onClick={() => removeCurrentPageName()} className="admin-header__logo logo">
                    MfMadi<span>Admin</span>
                </a>
                <button className={`admin-header__sidebar-btn ${isOpenSidebar ? "_close" : ""}`} onClick={() => setIsOpenSidebar(prev => !prev)}></button>
                <a href={'/'} className='admin-name'>{employeeName}</a>
                <button type='button' className='btn logout-btn' onClick={() => logout()}>Выйти</button>
            </div>
        </div>
    </header>
  )
}

export default HeaderAdmin