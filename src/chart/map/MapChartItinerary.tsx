import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../chart/Chart';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { extensionEnabled } from '../../utils/ReportUtils';
import { useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const NeoItineraryMapChart: React.FC<ChartProps> = (props) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([41.9028, 12.4964]); // Default center (Mediterranean - Rome)
    const [mapZoom, setMapZoom] = useState(6);
    const [personColors, setPersonColors] = useState({});

    // Settings from props
    const mapProviderURL = props.settings?.providerUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = props.settings?.attribution || '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    const routeWeight = props.settings?.routeWeight || 3;
    const showWaypoints = props.settings?.showWaypoints !== false;
    const showRoutes = props.settings?.showRoutes !== false;

    // Dynamic color generation function - creates unlimited unique colors
    const generateColor = (index) => {
        const hue = (index * 137.508) % 360; // Golden angle for good distribution
        const saturation = 60 + (index % 3) * 15; // Vary saturation: 60%, 75%, 90%
        const lightness = 45 + (index % 2) * 10;  // Vary lightness: 45%, 55%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // Safe function to get person color (no setState during render)
    const getPersonColor = (personName) => {
        return personColors[personName] || '#666666'; // Fallback color
    };

    const styleRules = useStyleRules(
        extensionEnabled(props.extensions, 'styling'),
        props.settings.styleRules,
        props.getGlobalParameter
    );

    useEffect(() => {
        if (props.records && props.records.length > 0) {
            processItineraryData();
        }
    }, [props.records]);

    const processItineraryData = () => {
        try {
            const allFeatures = [];
            const validCoordinates = [];
            const uniquePersons = new Set();

            // First pass: collect all unique person names
            props.records.forEach((record) => {
                const keys = record.keys || [];
                const values = record._fields || [];

                keys.forEach((key, index) => {
                    const value = values[index];
                    if (value && value.itinerary && value.itinerary.type === 'FeatureCollection') {
                        const personName = value.name || value.id || 'Unknown Person';
                        uniquePersons.add(personName);
                    } else if (value && value.type === 'FeatureCollection') {
                        let personName = 'Unknown Person';
                        if (record.get) {
                            try { personName = record.get('name') || record.get('id') || personName; } catch(e) {}
                        }
                        if (keys.length > 1) {
                            const nameIndex = keys.findIndex(k => k.includes('name') || k.includes('id'));
                            if (nameIndex >= 0) {
                                personName = values[nameIndex] || personName;
                            }
                        }
                        uniquePersons.add(personName);
                    }
                });
            });

            // Generate colors for all unique persons
            const newPersonColors = {};
            Array.from(uniquePersons).forEach((personName, index) => {
                newPersonColors[personName] = generateColor(index);
            });
            setPersonColors(newPersonColors);

            props.records.forEach((record, recordIndex) => {
                const keys = record.keys || [];
                const values = record._fields || [];

                // Helper function to process itinerary data
                const processItinerary = (itinerary, personName) => {
                    itinerary.features.forEach((feature, featureIndex) => {
                        if (feature.type === 'Feature') {

                            // Add person name to properties for identification
                            feature.properties = {
                                ...feature.properties,
                                person: personName
                            };

                            // For Point features, collect coordinates for map centering
                            if (feature.geometry.type === 'Point') {
                                console.log(`ItineraryMap - Point coordinates:`, feature.geometry.coordinates);
                                if (feature.geometry.coordinates &&
                                    feature.geometry.coordinates[0] !== null &&
                                    feature.geometry.coordinates[1] !== null) {
                                    console.log(`ItineraryMap - Adding valid point coordinates:`, feature.geometry.coordinates);
                                    validCoordinates.push(feature.geometry.coordinates);
                                } else {
                                    console.log(`ItineraryMap - Point coordinates are null or invalid:`, feature.geometry.coordinates);
                                }
                            }

                            // For LineString features, extract valid coordinates
                            if (feature.geometry.type === 'LineString') {
                                console.log(`ItineraryMap - LineString coordinates:`, feature.geometry.coordinates);
                                if (feature.geometry.coordinates && feature.geometry.coordinates.length > 0) {
                                    feature.geometry.coordinates.forEach((coord, coordIndex) => {
                                        console.log(`ItineraryMap - LineString coord ${coordIndex}:`, coord);
                                        if (coord && coord[0] !== null && coord[1] !== null) {
                                            console.log(`ItineraryMap - Adding valid line coordinate:`, coord);
                                            validCoordinates.push(coord);
                                        }
                                    });

                                    // Filter out null coordinates from LineString
                                    feature.geometry.coordinates = feature.geometry.coordinates.filter(
                                        coord => coord && coord[0] !== null && coord[1] !== null
                                    );
                                } else {
                                    console.log(`ItineraryMap - Empty LineString coordinates, skipping feature`);
                                    return; // Skip empty LineString features
                                }
                            }

                            // Only add features that have valid coordinates
                            if ((feature.geometry.type === 'Point' && feature.geometry.coordinates &&
                                    feature.geometry.coordinates[0] !== null && feature.geometry.coordinates[1] !== null) ||
                                (feature.geometry.type === 'LineString' && feature.geometry.coordinates &&
                                    feature.geometry.coordinates.length > 0)) {
                                allFeatures.push(feature);
                                console.log(`ItineraryMap - Added feature to collection:`, feature);
                            } else {
                                console.log(`ItineraryMap - Skipped invalid feature:`, feature);
                            }
                        }
                    });
                };

                keys.forEach((key, index) => {
                    const value = values[index];

                    // Check if this field contains an itinerary with GeoJSON structure
                    if (value && value.itinerary && value.itinerary.type === 'FeatureCollection') {
                        const personName = value.name || value.id || 'Unknown Person';
                        processItinerary(value.itinerary, personName);
                    }
                    // Also check if the value itself is a GeoJSON FeatureCollection (direct query result)
                    else if (value && value.type === 'FeatureCollection') {
                        // Try to get person name from different sources
                        let personName = 'Unknown Person';
                        if (record.get) {
                            try { personName = record.get('name') || record.get('id') || personName; } catch(e) {}
                        }
                        // Also check if there's a name/id in the current field
                        if (keys.length > 1) {
                            const nameIndex = keys.findIndex(k => k.includes('name') || k.includes('id'));
                            if (nameIndex >= 0) {
                                personName = values[nameIndex] || personName;
                            }
                        }
                        processItinerary(value, personName);
                    }
                });
            });

            // Calculate map bounds from valid coordinates
            if (validCoordinates.length > 0) {
                const lats = validCoordinates.map(coord => coord[1]);
                const lngs = validCoordinates.map(coord => coord[0]);

                const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

                setMapCenter([centerLat, centerLng]);

                // Calculate zoom level based on coordinate spread
                const latSpread = Math.max(...lats) - Math.min(...lats);
                const lngSpread = Math.max(...lngs) - Math.min(...lngs);
                const maxSpread = Math.max(latSpread, lngSpread);

                let zoom = 10;
                if (maxSpread > 20) zoom = 3;
                else if (maxSpread > 10) zoom = 4;
                else if (maxSpread > 5) zoom = 5;
                else if (maxSpread > 2) zoom = 6;
                else if (maxSpread > 1) zoom = 7;

                setMapZoom(zoom);
            }

            // Create GeoJSON data
            const geoJsonCollection = {
                type: 'FeatureCollection',
                features: allFeatures
            };


            setGeoJsonData(geoJsonCollection);
        } catch (error) {
            console.error('Error processing itinerary data:', error);
        }
    };

    const getFeatureStyle = (feature) => {
        const { geometry, properties } = feature;
        
        // Get person-specific color
        const personName = properties.person || 'Unknown';
        const personColor = getPersonColor(personName);

        if (geometry.type === 'LineString' && showRoutes) {
            return {
                color: personColor,
                weight: routeWeight,
                opacity: 0.8
            };
        }

        if (geometry.type === 'Point' && showWaypoints) {
            // Use person color but with slight variations for different stop types
            let color = personColor;
            let fillOpacity = 0.8;
            let radius = 6;
            
            if (properties.type_of_stop === 'origin') {
                // Origin points are larger and more opaque
                radius = 8;
                fillOpacity = 1.0;
            } else if (properties.type_of_stop === 'residence') {
                // Residence points are square-ish (simulated with higher weight border)
                radius = 7;
                fillOpacity = 0.9;
            }

            return {
                color: color,
                fillColor: color,
                fillOpacity: fillOpacity,
                radius: radius,
                weight: 2
            };
        }

        return {};
    };

    const onEachFeature = (feature, layer) => {
        if (feature.properties && (feature.properties.label || feature.properties.person)) {
            const popupContent = `
        <div>
          <strong>${feature.properties.person || 'Unknown'}</strong><br/>
          ${feature.properties.label ? `<strong>Place:</strong> ${feature.properties.label}<br/>` : ''}
          ${feature.properties.date_of_stop ? `<strong>Date:</strong> ${feature.properties.date_of_stop}<br/>` : ''}
          ${feature.properties.type_of_stop ? `<strong>Type:</strong> ${feature.properties.type_of_stop}` : ''}
        </div>
      `;
            layer.bindPopup(popupContent);
        }
    };

    const pointToLayer = (feature, latlng) => {
        if (feature.geometry.type === 'Point') {
            const style = getFeatureStyle(feature);
            return L.circleMarker(latlng, style);
        }
    };

    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#666',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px'
            }}>
                <div>
                    <h3>No itinerary data to display</h3>
                    <p>Your query returned data but no valid coordinates were found.</p>
                </div>
                <div style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', maxWidth: '600px' }}>
                    <strong>Troubleshooting:</strong>
                    <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Check that your places have coordinate data:
                            <code style={{ display: 'block', margin: '5px 0', padding: '5px', backgroundColor: 'white' }}>
                                MATCH (pl:Place) RETURN keys(pl) LIMIT 5
                            </code>
                        </li>
                        <li>Verify coordinate field names in your query</li>
                        <li>Check browser console for detailed logs</li>
                    </ol>
                </div>

                {/* Show map anyway with default center */}
                <div style={{ width: '100%', height: '300px', border: '2px dashed #ccc', borderRadius: '8px' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution={attribution}
                            url={mapProviderURL}
                        />
                    </MapContainer>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
            >
                <TileLayer
                    attribution={attribution}
                    url={mapProviderURL}
                />

                {geoJsonData && (
                    <GeoJSON
                        data={geoJsonData}
                        style={getFeatureStyle}
                        onEachFeature={onEachFeature}
                        pointToLayer={pointToLayer}
                        key={JSON.stringify(geoJsonData)}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default NeoItineraryMapChart;