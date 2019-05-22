const express = require("express")
const app = express()
const port = 3000
const f = require("./rawFetches.js")
const sets = require("./sets")
const structures = require("./stuctures")
const Place = structures.Place

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get("/getcord/:addr", async (req, res) => {
  try {
    let query = req.params.addr.replace(" ", "+")

    let result = await f.geocode(query)
    let coords =
      result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos

    let [lng, lat] = coords.split(" ")
    result = await f.station(lat, lng)

    // res.append("Access-Control-Allow-Origin", "*")
    res.json({ pos: coords, result: result })
  } catch (e) {
    console.log(e)
    res.status(500).send("Internal error!")
  }
})

app.get("/getroute/:from-:to", async (req, res) => {
  try {
    let queryFrom = req.params.from.replace(" ", "+")
    let queryTo = req.params.to.replace(" ", "+")

    /**
     * @type {Place[]} hello
     */
    let Places = []

    let [from, to] = await Promise.all([
      f.geocode(queryFrom),
      f.geocode(queryTo)
    ])

    let fromFullAddress =
      from.response.GeoObjectCollection.featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.Address.formatted
    let toFullAddress =
      to.response.GeoObjectCollection.featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.Address.formatted

    let fromCity = from.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(
      el => el.kind == "locality"
    ).name
    let toCity = to.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(
      el => el.kind == "locality"
    ).name

    let [
      lngFrom,
      latFrom
    ] = from.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
      " "
    )
    let [
      lngTo,
      latTo
    ] = to.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
      " "
    )
    let [settlementFrom, settlementTo] = await Promise.all([
      f.settlement(latFrom, lngFrom),
      f.settlement(latTo, lngTo)
    ])
    Places.push(
      new Place(
        { lat: latFrom, lng: lngFrom },
        settlementFrom.code,
        fromFullAddress,
        fromCity
      )
    )
    Places.push(
      new Place(
        { lat: latTo, lng: lngTo },
        settlementTo.code,
        toFullAddress,
        toCity
      )
    )

    //IF THE CITY IS THE SAME
    let result = []
    if (settlementFrom.code != settlementTo.code) {
      let flight = await f.search(
        settlementFrom.code,
        settlementTo.code,
        undefined,
        [sets.TRANSPORT_TYPES.plane()]
      )
      console.log(flight)

      let flightFrom = flight.segments[0].from
      let flightTo = flight.segments[0].to

      // console.log(flightFrom)

      Places.splice(
        1,
        0,
        new Place(
          null,
          flightFrom.code,
          flightFrom.station_type,
          flightFrom.title
        ),
        new Place(null, flightTo.code, flightTo.station_type, flightTo.title)
      )

      // Places.push()
      // Places.push()

      result.push(flight)
    }
    let [] = await Promise.all([
      f.nearestStation(latFrom, lngFrom),
      f.nearestStation(latTo, lngTo)
    ])

    console.log(Places)

    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json("Internal error!")
  }
})

app.get("/", (req, res) => {
  res.send("<h2>T-Port API</h2>")
})
// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
