import { openstreetmapGetPOIs } from 'https://tbo47.github.io/ez-opendata.js'
  let coord = "14.67,-17.46,14.71,-17.41"
  function getLongAndLat() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }
   async function getCurrentPOI() {
    try {
      let position = await getLongAndLat();
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      coord = getBox(latitude, longitude);

    } catch (e) {
      alert('Error: ' + e.message);
    }
  }
  getCurrentPOI.call();
  
  //calculate and parse the latitude and longitude int north south east west
  function getBox(lat, long) {
    //calculate the offset of 1km at a certain coordinate
    const dist = kmInDegree(lat, long)
    //calculate the bounds and make an object of them
    let bounds = {
      north: lat + dist.lat,
      south: lat - dist.lat,
      east: long + dist.long,
      west: long - dist.long
    };
    return `${bounds.north},${bounds.south},${bounds.east},${bounds.west}`;
  }

  //See https://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude
  function kmInDegree(lat, long) {
    const pi = Math.PI;
    const eSq = 0.00669437999014;
    const a = 6378137.0; //equatorial radius in metres
    lat = lat * pi / 180; //convert to radians
    long = long * pi / 180; //convert radians

    //I won't try to explain the calculations. All i know is that they are correct with the examples on wikipedia (see url above)
    const latLength = (pi * a * (1 - eSq)) / (180 * Math.pow((1 - eSq * Math.pow(Math.sin(lat), 2)), 3 / 2));

    const longLength = (pi * a * Math.cos(long)) / (180 * Math.sqrt((1 - (eSq * Math.pow(Math.sin(long), 2)))));

    //If you want a greater offset, say 5km then change 1000 into 5000
    return {
      lat: 1000 / latLength,
      long: 1000 / longLength
    };
  }
// https://wiki.openstreetmap.org/wiki/Key:amenity#Values

const food = await openstreetmapGetPOIs(
  coord,
  [
    ["amenity", "bar"],
    ["amenity", "biergarten"],
    ["amenity", "cafe"],
    ["amenity", "restaurant"],
    ["amenity", "fast_food"],
    ["amenity", "food_court"],
    ["amenity", "ice_cream"],
  ]
)

const myDiv = document.getElementById('my-div')

console.log(food)

food.forEach(poi => {
  myDiv.innerHTML += `<a href="${poi.osm_url}" target="_blank">${poi.name}</a>`
})
