// class TransportDescroption {
//   /**
//    *
//    * @param {String} id
//    * @param {String} direction
//    * @param {Array} params
//    */
//   constructor(id, direction, params) {
//     //check for correct format of the arguments
//     this.id = id
//     this.direction = direction
//     this.params = params
//   }
// }

// class TrainDescription extends TransportDescroption {
//   /**
//    *
//    * @param {Number} availableSpots
//    */
//   constructor(id, availableSpots, direction, params) {
//     //check for correct format of the arguments
//     super(id, direction, params)
//     this.availableSpots = availableSpots
//   }
// }

class Place {
  /**
   *
   * @param {Object} coordinates Object {lat: xxx, lng: yyy}
   * @param {String} code Yandex code
   * @param {String} geoId Just full address
   * @param {String} name Short name
   * @param other
   */
  constructor(coordinates, code, geoId, name, ...other) {
    this.coordinates = coordinates
    this.code = code
    this.geoId = geoId
    this.name = name
    this.details = other
  }
}

class RouteSegment {
  /**
   *
   * @param {String} transportType
   * @param {String} description
   * @param {Date} departureTime
   * @param {Date} arrivalTime
   * @param {Place} DeparturePlace
   * @param {Place} ArrivalPlace
   */
  constructor(
    transportType,
    description,
    departureTime,
    arrivalTime,
    DeparturePlace,
    ArrivalPlace
  ) {
    this.transportType = transportType
    this.description = description
    this.departureTime = departureTime
    this.arrivalTime = arrivalTime
    this.DeparturePlace = DeparturePlace
    this.ArrivalPlace = ArrivalPlace
  }
}

// class Route {
//   /**
//    *
//    * @param {RouteSegment} masterRoute
//    * @param {RouteSegment} subRoutes
//    */
//   constructor(masterRoute, ...subRoutes) {
//     this.masterRoute = masterRoute
//     this.subRoutes = subRoutes
//   }
// }

// class ListObj {
//   constructor(val, prev, next) {
//     this.val = val
//     this.prev = prev
//     this.next = next
//   }
// }

// class ListPoint extends ListObj {
//   constructor(val, prev, next) {
//     super(val, prev, next)
//   }
// }

// class Transit extends ListObj {
//   constructor(from, to, filled = false) {
//     this.val = val
//     this.filled = filled
//   }
// }

module.exports = { Place, RouteSegment }
