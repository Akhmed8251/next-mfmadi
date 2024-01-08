const Map = () => {
  return (
    <section className="map">
      <div className="map__container container">
        <div id="map">
            <iframe width={'100%'} height={'100%'} src="https://yandex.ru/map-widget/v1/-/CDehEJyj"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Map;
