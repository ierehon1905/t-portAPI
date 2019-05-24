module.exports = {
  /** Returns the string representing tomorrow in ISO format
   */
  tomorrow: () =>
    new Date(new Date().getTime() + 1000 * 3600 * 24)
      .toISOString()
      .split("T")[0],
  /**
   * @param {} Yaobj  Yandex geocode responce
   * @returns {String[]}  an array with LONGITUDE and LATITUDE
   */
  extractCoords: Yaobj =>
    Yaobj.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
      " "
    ),
  /**
   * @param {} Yaobj - Yandex geocode responce
   */
  extractCity: Yaobj =>
    Yaobj.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(
      el => el.kind == "locality"
    ).name,
  /**
   * @param {} Yaobj - Yandex geocode responce
   */
  extactFullAddress: Yaobj =>
    Yaobj.response.GeoObjectCollection.featureMember[0].GeoObject
      .metaDataProperty.GeocoderMetaData.Address.formatted,
  /** MODIFIES the given array
   * @param {Array} arr
   * @param {Number} index
   * @returns {void}
   */
  insert: (arr, item, index = -1) => void arr.splice(index, 0, item)
}
