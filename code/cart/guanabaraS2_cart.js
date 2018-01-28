var geet = require('users/elacerda/geet:geet');
var rio_2016 = ee.Image('COPERNICUS/S2/20161110T130242_20161110T165117_T23KPQ');
var rio_2016_ndvi = geet.ndviS2(rio_2016);
var newfc = urbano.merge(floresta).merge(agua).merge(pasto);
var cart_class = geet.cart(rio_2016_ndvi, newfc, 'cobertura');
var COLOR = {WATER: '0066ff', FOREST: '009933', PASTURE: '99cc00', URBAN: 'ff0000'};
Map.addLayer(cart_class, { min: 0, max: 3, palette: [COLOR.URBAN, COLOR.FOREST, COLOR.WATER, COLOR.PASTURE] }, 'class');


