class STATION_TYPES {
  static station() {
    return "station"
  }
  static platform() {
    return "platform"
  }
  static stop() {
    return "stop"
  }
  static checkpoint() {
    return "checkpoint"
  }
  static post() {
    return "post"
  }
  static crossing() {
    return "crossing"
  }
  static overtaking_point() {
    return "overtaking_point"
  }
  static train_station() {
    return "train_station"
  }
  static airport() {
    return "airport"
  }
  static bus_station() {
    return "bus_station"
  }
  static bus_stop() {
    return "bus_stop"
  }
  static unknown() {
    return "unknown"
  }
  static port() {
    return "port"
  }
  static port_point() {
    return "port_point"
  }
  static wharf() {
    return "wharf"
  }
  static river_port() {
    return "river_port"
  }
  static marine_station() {
    return "marine_station"
  }
}

class TRANSPORT_TYPES {
  static plane() {
    return "plane"
  }
  static train() {
    return "train"
  }
  static suburban() {
    return "suburban"
  }
  static bus() {
    return "bus"
  }
  static sea() {
    return "sea"
  }
  static river() {
    return "river"
  }
  static helicopter() {
    return "helicopter"
  }
}

module.exports = { STATION_TYPES, TRANSPORT_TYPES }
