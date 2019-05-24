const express = require("express")
const app = express()
const port = 3000
const f = require("./rawFetches.js")
const sets = require("./sets")
const structures = require("./stuctures")
const Place = structures.Place
const RouteSegment = structures.RouteSegment
const utils = require("./utils")

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

    let ConstructingRoute = []

    let [from, to] = await Promise.all([
      f.geocode(queryFrom),
      f.geocode(queryTo)
    ])

    let fromFullAddress = utils.extactFullAddress(from)
    let toFullAddress = utils.extactFullAddress(to)

    let fromCity = utils.extractCity(from)
    let toCity = utils.extractCity(to)

    let [lngFrom, latFrom] = utils.extractCoords(from)
    let [lngTo, latTo] = utils.extractCoords(to)

    let [settlementFrom, settlementTo] = await Promise.all([
      f.settlement(latFrom, lngFrom),
      f.settlement(latTo, lngTo)
    ])
    ConstructingRoute.push(
      new Place(
        { lat: latFrom, lng: lngFrom },
        settlementFrom.code,
        fromFullAddress,
        fromCity
      )
    )
    ConstructingRoute.push(
      new Place(
        { lat: latTo, lng: lngTo },
        settlementTo.code,
        toFullAddress,
        toCity
      )
    )

    //IF THE CITY IS NOT THE SAME
    if (settlementFrom.code != settlementTo.code) {
      let flight = await f.search(
        settlementFrom.code,
        settlementTo.code,
        undefined,
        [sets.TRANSPORT_TYPES.plane()]
      )
      // console.log(flight)

      let flightFrom = flight.segments[0].from
      let flightTo = flight.segments[0].to
      //console.log(flightFrom)

      let departure = new Date(flight.segments[0].departure)

      let arrival = new Date(flight.segments[0].arrival)

      //find closest stations to airports
      //geocode them
      // let [depAirGeo, arrAirGeo] = await Promise.all([
      //   f.geocode(queryFrom),
      //   f.geocode(queryTo)
      // ])

      // console.log(flightFrom)
      let fromPlace = new Place(
        null,
        flightFrom.code,
        flightFrom.station_type,
        flightFrom.title
      )
      let toPlace = new Place(
        null,
        flightTo.code,
        flightTo.station_type,
        flightTo.title
      )

      let transit = new RouteSegment(
        sets.TRANSPORT_TYPES.plane(),
        "Ultra test",
        departure,
        arrival,
        fromPlace,
        toPlace
      )
      // ConstructingRoute.splice(1, 0, transit)
      utils.insert(ConstructingRoute, transit, 1)

      //how to get to the airport
      //we also need to find nearest stations to airports so we need to geocode them
      let [nearDepAir, nearArrAir] = await Promise.all([
        f.geocode(flightFrom.station_type_name + " " + flightFrom.title),
        f.geocode(flightTo.station_type_name + " " + flightTo.title)
      ])

      let [nearDepAirLng, nearDepAirLat] = utils.extractCoords(nearDepAir)
      let [nearArrAirLng, nearArrAirLat] = utils.extractCoords(nearArrAir)

      let [
        nearFromStation,
        nearToStation,
        nearDepAirStation,
        nearArrAirStation
      ] = await Promise.all([
        f.nearestStation(latFrom, lngFrom, [
          sets.STATION_TYPES.station(),
          sets.STATION_TYPES.bus_stop()
        ]),
        f.nearestStation(latTo, lngTo, [
          sets.STATION_TYPES.station(),
          sets.STATION_TYPES.bus_stop()
        ]),
        f.nearestStation(nearDepAirLat, nearDepAirLng, [
          sets.STATION_TYPES.station(),
          sets.STATION_TYPES.bus_stop()
          // sets.STATION_TYPES.train_station(),
          // sets.STATION_TYPES.stop()
        ]),
        f.nearestStation(nearArrAirLat, nearArrAirLng, [
          sets.STATION_TYPES.station(),
          sets.STATION_TYPES.bus_stop()
        ])
      ])
      // console.log(nearDepAirStation);

      let nearFromCode = nearFromStation.stations[0].code
      let nearToCode = nearToStation.stations[0].code
      let nearDepAirCode = nearDepAirStation.stations[0].code
      let nearArrAirCode = nearArrAirStation.stations[0].code

      let [depAirTransit, arrAirTransit] = await Promise.all([
        f.search(
          nearFromCode,
          nearDepAirCode,
          utils.tomorrow(),
          [
            // sets.TRANSPORT_TYPES.bus(),
            // sets.TRANSPORT_TYPES.train(),
            // sets.TRANSPORT_TYPES.suburban()
          ],
          true
        ),
        f.search(
          nearArrAirCode,
          nearToCode,
          utils.tomorrow(),
          [
            // sets.TRANSPORT_TYPES.bus(),
            // sets.TRANSPORT_TYPES.train(),
            // sets.TRANSPORT_TYPES.suburban()
          ],
          true
        )
      ])

      utils.insert(ConstructingRoute, depAirTransit, 1)
      utils.insert(ConstructingRoute, arrAirTransit, -1)
      

      // console.log(depAirTransit, arrAirTransit)

      // Places.push()
      // Places.push()

      //result.push(flight)
    }

    // console.log(ConstructingRoute)
    // res.json(result)
    res.json(ConstructingRoute)
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
