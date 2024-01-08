const Popup = ({ children, id, active, setActive }) => {
  return (
    <div id={id} className={`popup${active ? " _open" : ""}`}>
      <div className="popup__body">
        <div className="popup__content">
          <button
            type="button"
            className="popup__close"
            onClick={() => setActive(false)}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1L24.25 23.75M47 46.5L24.25 23.75M24.25 23.75L1.5 46.5L47 1"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
