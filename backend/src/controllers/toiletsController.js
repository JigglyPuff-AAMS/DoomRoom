// give user access to dropdowns of availible areas by city/country name
// scoping to a selected area narrows down search and improves speed

// defining a circle radius (toilets witin 1k of this location)
//  node["amenity"="toilets"](around:1000, lat, lon);
/**
 * dropping a pin and fetching nearby restrooms in Los Angeles city hall
 node[amenity=toilets]
 (around:500, 34.0522, -118.2437);
 out;
 */
  
 // Overpass QL Syntax
 /**
  * 
  */

// Civic/amenity
// a tag in a civic building can be accomadations like toilets
// key: Building, value: civic, tag: amenity=toilets
// key: building, value: toilets (A toilet block.)
//  used to identify individual buildings or groups of connected buildings
// The building tags are intended for the physical description of a building. For functions in the building like toilets use tags


// Properties
// keys and tags which, in contrast to top-level tags, are used to give additional information of a general nature about another element
// Key: toilets, Value: yes/no (Describes whether a toilets is available)
// Key: toilets:wheelchair, Value: yes/no (States if a location has a wheelchair accessible toilet or not.)

export async function fetchToilets(req, res) {

try {
const {lat, lon, radius = 5000 } = req.query;



    const query = `
      [out:json];
      node
        ["amenity"="toilets"]
        (around:${radius},${lat},${lon});
      out body;
    `;

const api = "https://overpass-api.de/api/interpreter";

const response = await fetch(api, {
method: 'POST',
headers: {'Content-Type': 'application/x-www-form-urlencoded'},
body: `data=${encodeURIComponent(query)}`
});

const data = await response.json();

console.log("response =", data);


const formatted = data.elements.map(el => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    wheelchair: el.tags?.wheelchair ?? 'not Known',

}))


res.json(formatted) // restroom data
console.log(data)

} catch (err) {
    console.error("Error retriving bathroom node data:", err)
    res.status(500).json ({error: "failed to fetch"})
    }
}






// streach features
// once MVP is done, render full geometric shapes (restroom buildings) instead of only points
// proximity of a polyline: one defines a path over two or more coordinates, and then all objects are found that have a lower distance to that path than the given value

