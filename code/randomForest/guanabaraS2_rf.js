var s2 = ee.ImageCollection("COPERNICUS/S2");
var roi = ee.Geometry.Point(-43.25,-22.90);

var images = s2.filterDate('2015-01-01', '2015-12-31')
                      .filterBounds(roi)
                      .sort('CLOUD_COVERAGE_ASSESSMENT');

var first = ee.Image(s2.first());

// Define the visualization parameters.
var vizParams = {
  bands: ['B2', 'B3', 'B4'],
  min: 0,
  max: 5000,
  gamma: [0.95, 1.1, 1]
};

// var rio_2015 = ee.Image('COPERNICUS/S2/20150808T130810_20160512T235058_T23KPQ')
var rio_2016 = ee.Image('COPERNICUS/S2/20161110T130242_20161110T165117_T23KPQ');
// var rio_2017 = ee.Image('COPERNICUS/S2/20170218T130241_20170218T130353_T23KPQ');

var rio_2016_ndvi = rio_2016.normalizedDifference(['B8','B4']).rename('NDVI');
var rio_2016_idx = rio_2016.addBands(rio_2016_ndvi);
var bands_idx = ['B2', 'B3', 'B4', 'B8','NDVI'];

var newfc = urbano.merge(floresta).merge(agua).merge(pasto);

var training = rio_2016_idx.select(bands_idx).sampleRegions({
  collection: newfc,
  properties: ['cobertura'],
  scale: 10
});

var classifier = ee.Classifier.randomForest(10).train({
  features: training,
  classProperty: 'cobertura',
  inputProperties: bands_idx
});

var classified = rio_2016_idx.select(bands_idx).classify(classifier);

var COLOR = {
    AGUA: '0066ff',
    FLORESTA: '009933',
    PASTO: '99cc00',
    URBANO: 'ff0000'
  };

Map.addLayer(classified, {min: 0, max: 3, palette: [COLOR.FLORESTA, COLOR.URBANO, COLOR.AGUA, COLOR.PASTO]});
Map.addLayer(rio_2016, vizParams, 'default');
Map.addLayer(rio_2016_ndvi, {}, 'ndvi');
print(images);
