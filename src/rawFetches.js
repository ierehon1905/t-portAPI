const t = require("./tokens.js")
const fetch = require("node-fetch")

const smartFetch = (url, options) => fetch(new URL(url), options)

const querify = obj => {
  return Object.entries(obj)
    .map(pair => pair[0] + "=" + pair[1])
    .join("&")
}

module.exports = {
  /**
   * @param {String} query Addres to search
   */
  geocode: async query => {
    let options = querify({
      apikey: t.geocodeToken,
      geocode: query,
      format: "json"
    })
    let result = await smartFetch(`https://geocode-maps.yandex.ru/1.x/?${options}`)
    result = await result.json()
    return result
  },

  settlement: async (lat, lng) => {
    let options = querify({
      apikey: t.raspToken,
      format: "json",
      lat,
      lng,
      distance: 7
    })
    let result = await smartFetch(
      `https://api.rasp.yandex.net/v3.0/nearest_settlement/?${options}`
    )
    result = await result.json()
    return result
  },
  /**
   * @param {String | Number} lat latitude
   * @param {String | Number} lng longitude
   * @param {String | String[]} stationTypes
   * @param {String | String[]} transportTypes
   */
  nearestStation: async (
    lat,
    lng,
    stationTypes = null,
    transportTypes = null
  ) => {
    let options = querify({
      apikey: t.raspToken,
      format: "json",
      lat,
      lng,
      distance: 10,
      limit: 1,
      station_types: stationTypes,
      transport_types: transportTypes
    })
    let result = await smartFetch(
      `https://api.rasp.yandex.net/v3.0/nearest_stations/?${options}`
    )
    result = await result.json()
    return result
  },
  /**
   * @param {String} fromCode Code of departure point in Yandex system
   * @param {String} toCode Code of arrival point in Yandex system
   * @param {Date | String=} date Date of departure in dd-mm-yyyy ISO format
   * @param {String | String[]=} transportTypes transport types provided by Yandex
   * @param {Boolean | String=} transfers whether to include routes with transfers
   */
  search: async (
    fromCode,
    toCode,
    date = new Date().toISOString().split("T")[0],
    transportTypes = [],
    transfers = false
  ) => {
    if (typeof date == "object") {
      date = date.toISOString().split("T")[0]
    }
    let options = querify({
      apikey: t.raspToken,
      format: "json",
      from: fromCode,
      to: toCode,
      date,
      distance: 10,
      transport_types: transportTypes,
      limit: 1,
      transfers
    })

    let result = await smartFetch(
      `https://api.rasp.yandex.net/v3.0/search/?${options}`
    )
    result = await result.json()
    return result
  }
}
