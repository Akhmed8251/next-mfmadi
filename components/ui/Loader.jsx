const Loader = ({ isOnlySpinner = false }) => {
  return isOnlySpinner ? (
    <span className="loader__spinner"></span>
  ) : (
    <div className="loader">
      <span className="loader__text">Загрузка</span>
      <span className="loader__spinner"></span>
    </div>
  );
};

export default Loader;
