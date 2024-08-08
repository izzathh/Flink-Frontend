import React, { useEffect, useRef, useState } from 'react';
// import { GoogleMap, Polygon, DrawingManager, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { FeatureCollection, Polygon } from 'geojson';
import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    TextField,
    Typography,
    MenuItem,
    Box,
    Checkbox,
    ListItemText,
    InputLabel,
    Select,
    SelectChangeEvent,
    OutlinedInput,
    Chip,
    Autocomplete,
    IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Theme, useTheme } from '@mui/material/styles';
import { useSnackbar } from "notistack";
import ReactMapGl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl, { LngLat } from 'mapbox-gl';
import * as turf from '@turf/turf';
import MapContainer from '../../components/GoogleMap';
import axios from 'axios';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { boolean } from 'yup';
import { TokenConfig, baseUrl, useAppData } from "../../context/AppContext";

interface GeoapifyFeature {
    properties: {
        name: string;
    };
}

declare global {
    interface Window {
        google: any;
    }
}

// function AddBourndaries() {
//     const { enqueueSnackbar } = useSnackbar();
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);
//     const [dropValue, setDropValue] = useState("");
//     const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedCountry, setSelectedCountry] = useState('');
//     const [selectedState, setSelectedState] = useState('');
//     const [refresh, setRefresh] = useState(false);
//     const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
//     const [boundaries, setBoundaries] = useState<any[]>([
//         // { lng: 79.08491000, lat: 21.14631000 },
//         { lng: 79.58333000, lat: 14.08333000 },//79.58333000
//         { lng: 77.78955000, lat: 9.73579000 },
//         { lng: 75.9339044261591, lat: 14.481573743902686 }
//     ]);
//     // const [selectedBoundaries, setSelectedBoundaries] = useState<any[]>([]);
//     const [coordinates, setCoordinates] = useState("");
//     const { baseUrl, state, tabIdentifier } = useAppData();
//     const [viewPort, setViewPort] = useState({
//         latitude: 36.7014631,
//         longitude: -118.755997,
//         width: '100%',
//         height: '100%',
//         zoom: 1
//     })

//     console.log('BOUNDARIES------->:', boundaries);

//     useEffect(() => {
//         let map: mapboxgl.Map | undefined
//         let draw: any

//         mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94dGVzdDIwMjQiLCJhIjoiY2xzaWozeTJoMmM4ZzJpbm83OTl3NW5tNSJ9.iGANeII1aUrPwzYD8WwsAA"
//         map = new mapboxgl.Map({
//             container: mapContainerRef.current!,
//             style: 'mapbox://styles/mapbox/streets-v11',
//             center: [viewPort.longitude, viewPort.latitude],
//             zoom: viewPort.zoom,
//         })

//         const elements = document.getElementsByClassName('mapboxgl-control-container');
//         Array.from(elements).forEach(element => {
//             element.remove();
//         });

//         draw = new MapboxDraw({
//             displayControlsDefault: false,
//             controls: {
//                 polygon: true,
//                 trash: true
//             },
//             defaultMode: 'draw_polygon'
//         });

//         map.addControl(draw);

//         console.log('map:', map);

//         // draw.changeMode('draw_line_string');

//         // const fetchData = async () => {
//         //     setRefresh(false)
//         //     if (boundaries.length > 0
//         //         // || selectedBoundaries.length > 0
//         //     ) {
//         //         // const mergedBoundaries = [...boundaries, ...selectedBoundaries];
//         //         boundaries.forEach(async (boundary, index) => {
//         //             const KEY = '51b0c3e1aa6a4b539518719fe3b5ed1d'
//         //             const response = await fetch(`https://api.geoapify.com/v1/boundaries/part-of?lon=${boundary.lng}&lat=${boundary.lat}&geometry=geometry_1000&apiKey=${KEY}`);
//         //             console.log('response:', response);
//         //             const data = await response.json();

//         // const boundariesData: FeatureCollection<Polygon> = {
//         //     "type": "FeatureCollection",
//         //     "features": [
//         //         {
//         //             "type": "Feature",
//         //             "properties": {},
//         //             "geometry": {
//         //                 "type": "Polygon",
//         //                 "coordinates": [
//         //                     [
//         //                         [10.0, 50.0],
//         //                         [10.0, 52.0],
//         //                         [12.0, 52.0],
//         //                         [12.0, 50.0],
//         //                         [10.0, 50.0]
//         //                     ]
//         //                 ]
//         //             }
//         //         }
//         //     ]
//         // };

//         // map.addSource(`boundary-source-${index}`, {
//         //     type: 'geojson',
//         //     data: data,
//         // });

//         // map.addLayer({
//         //     id: `boundary-layer-${index}`,
//         //     type: 'line',
//         //     source: `boundary-source-${index}`,
//         //     paint: {
//         //         'line-color': '#FF0000',
//         //         'line-width': 2,
//         //     },
//         // });
//         //         });
//         //     }
//         // };

//         // fetchData();

//         // map.on('click', async (e) => {
//         //     let { lng, lat } = e.lngLat;

//         // const newBoundaries = [
//         //     { lng: lng, lat: lat }
//         // ];

//         // const updatedBoundaries = [...boundaries, ...newBoundaries];

//         // // setSelectedBoundaries(updatedBoundaries);
//         // setBoundaries(updatedBoundaries);

//         // const currentZoom = map.getZoom();

//         // setViewPort({
//         //     latitude: lat,
//         //     longitude: lng,
//         //     width: '100%',
//         //     height: '100%',
//         //     zoom: currentZoom
//         // });

//         // const KEY = '51b0c3e1aa6a4b539518719fe3b5ed1d'
//         // const response = await fetch(`https://api.geoapify.com/v1/boundaries/part-of?lon=${lng}&lat=${lat}&geometry=geometry_1000&apiKey=${KEY}`);
//         // console.log('response:', response);
//         // const data = await response.json();

//         // const country = data.features[0].properties.country
//         // // const state = data.features[0].properties.state
//         // // const validState = !state || typeof state == 'undefined'
//         // // ? data.features[0].properties.district
//         // // : state

//         // const state = data.features.map((states: any) => {
//         //     const stateName = !states.properties.state || typeof states.properties.state == 'undefined'
//         //         ? states.properties.city : states.properties.state
//         //     return stateName
//         // })

//         // const validState = state.find((item: any) => item !== undefined && item !== null);

//         // const city = data.features.map((cities: any) => {
//         //     let cityName
//         //     if (cities.properties.name != cities.properties.city || !cities.properties.city) {
//         //         if (cities.properties.county) {
//         //             cityName = cities.properties.county
//         //             console.log('cityName:', cityName);
//         //             return cityName
//         //         }
//         //         cityName = cities.properties.name
//         //         return cityName
//         //     } else {
//         //         cityName = cities.properties.city
//         //         return cityName
//         //     }
//         // })

//         // console.log('city--->:', city);

//         // const cityValue = city.find((item: any) => item !== undefined && item !== null);

//         // console.log('city:', cityValue);


//         // setSelectedCountry(country)
//         // setSelectedState(validState)
//         // let events: any
//         // handleInputChange(events, cityValue, country, validState, true)

//         // // map.addSource('cities', {
//         // //     type: 'geojson',
//         // //     data: data,
//         // // });

//         // // map.addLayer({
//         // //     id: 'city-boundaries',
//         // //     type: 'line',
//         // //     source: 'cities',
//         // //     paint: {
//         // //         'line-color': '#FF0000',
//         // //         'line-width': 2,
//         // //     },
//         // // });

//         // console.log('State data:', data.features[0].properties.country);
//         // console.log('Country data:', data.features);
//         // });

//         return () => {
//             map?.remove();
//         };
//     }, [viewPort, refresh])

//     const handleSubmit = async (val: number) => {
//         try {
//             if (val == 1) {
//                 const { data } = await axios.post(
//                     `${baseUrl}/common-fields/admin/add-operation-area`,
//                     { areaName: dropValue, coordinates: coordinates },
//                     TokenConfig(tabIdentifier)
//                 )
//                 console.log('addedArea:', data);
//                 if (data.status == 1) {
//                     enqueueSnackbar("Group created successfully!", {
//                         variant: "success",
//                     });
//                     return
//                 }
//             } else {
//                 enqueueSnackbar("Area added successfully!", {
//                     variant: "success",
//                 });
//             }
//         } catch (error: any) {
//             console.log('error:', error);
//             enqueueSnackbar(error.response.data.message, {
//                 variant: "error",
//             });
//             return
//         }
//     }

//     const handleInputChange = async (
//         event: React.SyntheticEvent<Element, Event>,
//         value: string,
//         country: string,
//         state: string,
//         flag: boolean
//     ) => {
//         const { data } = await axios.get(
//             `${baseUrl}/mappings/admin/get-city-names?country=${country}&state=${state}&searchParam=${value}&flag=${flag}`,
//             TokenConfig(tabIdentifier)
//         );
//         if (flag) {
//             const getExactMatch = data.cities.filter((city: any) => value.includes(city.name) || city.name === value)
//             console.log('getExactMatch:', getExactMatch)
//             setSelectedLocations((prevSelectedLocations) => [...prevSelectedLocations, ...getExactMatch]);
//         } else {
//             const deselectedOption = selectedLocations.find((location: any) => location.name === value);
//             if (deselectedOption) {
//                 const updatedBoundaries = boundaries.filter(boundary => boundary !== deselectedOption);
//                 setBoundaries(updatedBoundaries);
//                 console.log('updatedBoundaries-->:', updatedBoundaries);
//             }
//         }
//         // setSelectedLocations((prevSelectedLocations) => [...prevSelectedLocations, ...getExactMatch]);
//         console.log('selectedLocations:', selectedLocations)
//         setSuggestedCities(data.cities);
//         console.log('data:', data.cities);
//     };

//     return (
//         <Container style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             minHeight: '100vh',
//         }}>
//             <Typography variant="h6" textAlign="center" mb={2}>
//                 Select Areas
//             </Typography>
//             <div ref={mapContainerRef} style={{
//                 width: '75%', height: '400px', marginBottom: '20px'
//             }} />
//             {/* <Autocomplete
//                 multiple
//                 id="city-input"
//                 options={suggestedCities}
//                 getOptionLabel={(option: any) => option.name}
//                 value={selectedLocations}
//                 onChange={(event, newValue: any) => {
//                     console.log('event:', event.isPropagationStopped());
//                     if (event.isPropagationStopped()) {

//                     } else {
//                         const newLatitude = newValue[newValue.length - 1].latitude;
//                         const newLongitude = newValue[newValue.length - 1].longitude;
//                         const newBoundary = { lng: newLongitude, lat: newLatitude };
//                         setBoundaries(prevBoundaries => [...prevBoundaries, newBoundary]);
//                         setRefresh(true)
//                         console.log('newValue:', newValue);
//                         console.log('lnglat:', newLongitude, newLatitude);
//                         setSelectedLocations(newValue);
//                     }
//                 }}
//                 onInputChange={(event, value) => handleInputChange(
//                     event,
//                     value,
//                     selectedCountry,
//                     selectedState,
//                     false
//                 )}
//                 renderInput={(params) => (
//                     <TextField
//                         style={{
//                             width: '20rem'
//                         }}
//                         {...params}
//                         label="City"
//                         variant="outlined"
//                         InputProps={{
//                             ...params.InputProps,
//                             endAdornment: (
//                                 <>
//                                     {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                                     {params.InputProps.endAdornment}
//                                 </>
//                             ),
//                         }}
//                         inputProps={params.inputProps}
//                     />
//                 )}
//                 isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
//             />
//             {loading && (
//                 <CircularProgress
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         marginTop: '-12px',
//                         marginLeft: '-12px',
//                     }}
//                 />
//             )}
//             <Button onClick={() => handleSubmit(2)} variant="contained" color="primary" style={{ marginTop: 10 }}>
//                 Add Area
//             </Button>
//             <Box sx={{
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 marginTop: 'auto', // Push the following content to the bottom
//                 marginBottom: '50px', // Add some space at the bottom
//             }}>
//                 <TextField
//                     variant="outlined"
//                     select
//                     id="addGroup"
//                     name="addGroup"
//                     label="Select area to create group"
//                     placeholder="Select area to create group"
//                     value={dropValue}
//                     size="medium"
//                     style={{
//                         width: "25rem",
//                         maxWidth: '100%',
//                         marginTop: '1rem',
//                     }}
//                 >
//                 </TextField>
//                 <Button onClick={() => handleSubmit(1)} variant="contained" color="primary" style={{
//                     marginTop: 10,
//                 }}>
//                     Create Group
//                 </Button>
//             </Box>*/}
//         </Container>
//     );
// }

function AddBourndaries() {
    const { tabIdentifier } = useAppData();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [polygonId, setPolygonId] = useState<any[]>([]);
    const [existingCoordinates, setExistingCoordinates] = useState<any[]>([
        {
            areaName: {},
            coordinates: []
        }
    ]);
    const [dropValue, setDropValue] = useState("");
    const [viewPort, setViewPort] = useState({
        latitude: 36.7014631,
        longitude: -118.755997,
        width: '100%',
        height: '100%',
        zoom: 1
    })
    const { enqueueSnackbar } = useSnackbar();
    const prevPolygonData = useRef<any[]>([]);

    let map: mapboxgl.Map | undefined
    let draw: MapboxDraw | any

    useEffect(() => {

        mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94dGVzdDIwMjQiLCJhIjoiY2xzaWozeTJoMmM4ZzJpbm83OTl3NW5tNSJ9.iGANeII1aUrPwzYD8WwsAA"
        map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [viewPort.longitude, viewPort.latitude],
            zoom: viewPort.zoom,
        })

        const elements = document.getElementsByClassName('mapboxgl-ctrl-attrib-inner');
        const elements2 = document.getElementsByClassName('mapboxgl-ctrl');

        Array.from(elements2).forEach(element => {
            element.remove();
        });

        Array.from(elements).forEach(element => {
            element.remove();
        });

        draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true,
            },
            defaultMode: 'draw_polygon'
        });

        map.addControl(draw);

        drawExistingPolygons(draw)

        map.on('draw.create', async (e) => {
            const features = e.features;
            const updatedFeatures = await handleDrawnFeatures(features);
            updatePolygonData(updatedFeatures, '', 'create');
        });

        map.on('draw.update', async (e) => {
            const features = e.features;
            const updatedFeatures = await handleDrawnFeatures(features);
            updatePolygonData(updatedFeatures, e.features[0].id, 'update')
        });

        map.on('draw.delete', async (e) => {
            const deletedFeatures = e.features;
            const updatedFeatures = await handleDrawnFeatures(deletedFeatures);
            updatePolygonData(updatedFeatures, e.features[0].id, 'delete');
        });

        const handleDrawnFeatures = async (features: any) => {
            const updatedFeatures = [];

            const drawnGeometryCoordinates = !features[0]
                ? features.features[0].geometry.coordinates
                : features[0].geometry.coordinates

            console.log('drawnGeometryCoordinates:', drawnGeometryCoordinates);

            for (const feature of drawnGeometryCoordinates) {
                console.log('feature:', feature[0][0]);
                const coordinates = feature[0];
                try {
                    const KEY = 'pk.eyJ1IjoibWFwYm94dGVzdDIwMjQiLCJhIjoiY2xzaWozeTJoMmM4ZzJpbm83OTl3NW5tNSJ9.iGANeII1aUrPwzYD8WwsAA'
                    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${KEY}&types=place&limit=1`);
                    const data = await response.json();

                    if (data && data.features && data.features.length > 0) {
                        const city = data.features[0].text;
                        const updatedFeature = {
                            ...feature,
                            properties: {
                                ...feature.properties,
                                city: city,
                                id: features[0].id
                            }
                        };
                        updatedFeatures.push(updatedFeature);
                    }
                } catch (error) {
                    console.error('Error fetching city name:', error);
                }
            }
            return updatedFeatures;
        };

        map.on('click', (e) => {
            const { lat, lng } = e.lngLat
            console.log('LAT:', lat, lng);
        })

        return () => {
            map?.remove();
        };
    }, [viewPort, refresh, polygonId, existingCoordinates])

    const updatePolygonData = (polygons: any, id: string, action: string) => {
        if (action === 'create') {
            prevPolygonData.current.push(...polygons);
        } else if (action === 'delete') {
            prevPolygonData.current = prevPolygonData.current.filter((polygon: any) => {
                return polygon.properties.id !== id;
            });
        } else {
            const index = prevPolygonData.current.findIndex(item => item.properties.id === id);

            if (index !== -1) {
                prevPolygonData.current[index] = polygons[0];
            }
        }
    }

    useEffect(() => {
        getExistingPolygonCoordinates()
    }, [])

    const drawExistingPolygons = async (draw: any) => {
        existingCoordinates.forEach((coordinates, index) => {
            const polygon = {
                type: 'Feature',
                properties: {
                    id: index,
                    areaName: coordinates.areaName
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates.coordinates],
                },
            };
            draw.add(polygon);
        })
    }

    const getExistingPolygonCoordinates = async () => {
        try {
            const { data } = await axios.get(
                `${baseUrl}/mappings/admin/get-coordinates`,
                TokenConfig(tabIdentifier)
            )

            const updatedCoordinates = data.coordinates.map((coordinate: any) => ({
                areaName: coordinate.areaName,
                coordinates: coordinate.geometry.coordinates[0],
            }));

            setExistingCoordinates(updatedCoordinates);

        } catch (error) {
            console.error('getExistingPolygonCoordinates:', error);
        }
    }

    useEffect(() => {
        const getExistingPolygonId = () => {
            const features = draw.getAll().features;
            const existingIds = features.map((feature: any) => {
                if (feature.properties.id !== undefined) {
                    return feature.id;
                }
            }).filter((id: any) => id !== undefined);
            console.log('existingIds:', existingIds);
            setPolygonId(existingIds);
        };
        if (draw) {
            getExistingPolygonId();
        }
    }, [draw]);

    const handleSubmit = async (val: number) => {
        try {
            if (val == 1) {
                const { data } = await axios.post(
                    `${baseUrl}/common-fields/admin/add-operation-area`,
                    { update: true, area: dropValue },
                    TokenConfig(tabIdentifier)
                )
                if (data.status === '1') {
                    enqueueSnackbar("Group created successfully!", {
                        variant: "success",
                    });
                }
            } else {
                if (prevPolygonData.current.length > 0) {
                    const { data } = await axios.post(
                        `${baseUrl}/common-fields/admin/add-operation-area`,
                        { polygon: prevPolygonData.current, update: false, area: dropValue },
                        TokenConfig(tabIdentifier)
                    )
                    console.log('prevPolygonData.current:', prevPolygonData.current);
                    if (data.status == 1) {
                        prevPolygonData.current = [];
                        console.log('remaining-polygonData:', prevPolygonData.current);
                        enqueueSnackbar("Area added successfully!", {
                            variant: "success",
                        });
                    }
                } else {
                    enqueueSnackbar("Please mark one or more areas/cities!", {
                        variant: "error",
                    });
                }
            }
        } catch (error: any) {
            console.log('error:', error);
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
            });
            return
        }
    }


    return (
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Typography variant="h6" textAlign="center" mb={2}>
                Mark Areas/Cities
            </Typography>
            <div ref={mapContainerRef} style={{
                width: '75%', height: '400px', marginBottom: '20px'
            }} />

            <Button onClick={() => handleSubmit(2)} variant="contained" color="primary" style={{ marginTop: 10 }}>
                Add Areas/Cities
            </Button>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2rem',
                marginBottom: '50px',
            }}>
                <TextField
                    variant="outlined"
                    select
                    id="addGroup"
                    name="addGroup"
                    label="Select area to create group"
                    placeholder="Select area to create group"
                    value={dropValue}
                    size="medium"
                    style={{
                        width: "25rem",
                        maxWidth: '100%',
                        marginBottom: '1rem',
                        height: '5rem'
                    }}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    top: '572 !important',
                                }
                            }
                        }
                    }}
                >
                    {existingCoordinates[0].coordinates.length > 0 &&
                        existingCoordinates.map((areas) => (
                            <MenuItem style={{}} value={areas.areaName} onClick={() => {
                                setDropValue(areas.areaName)
                            }}>
                                {areas.areaName}
                            </MenuItem>
                        ))}
                </TextField>
                <Button

                    disabled={!dropValue}
                    onClick={() => handleSubmit(1)} variant="contained" color="primary" style={{
                        marginTop: 10,
                    }}>
                    Create Group
                </Button>
            </Box>
        </Container>
    );
}

// function AddBourndaries() {
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);
//     const [drawingManager, setDrawingManager] = useState<any>(null);
//     const [cityNames, setCityNames] = useState<string[]>([]);

//     const { isLoaded } = useJsApiLoader({
//         id: 'google map',
//         googleMapsApiKey: 'YOUR_API_KEY', // Replace with your Google Maps API key
//     });

//     const initMap = () => {
//         const map = new google.maps.Map(mapContainerRef.current!, {
//             center: { lat: 37.7749, lng: -122.4194 },
//             zoom: 8,
//         });

//         const drawingManager = new google.maps.drawing.DrawingManager({
//             drawingMode: google.maps.drawing.OverlayType.POLYGON,
//             drawingControl: true,
//             drawingControlOptions: {
//                 position: google.maps.ControlPosition.TOP_CENTER,
//                 drawingModes: [google.maps.drawing.OverlayType.POLYGON],
//             },
//         });

//         drawingManager.setMap(map);
//         setDrawingManager(drawingManager);

//         google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: any) => {
//             const coordinates = polygon.getPath().getArray().map((latLng: any) => ({
//                 lat: latLng.lat(),
//                 lng: latLng.lng(),
//             }));

//             const url = `https://nominatim.openstreetmap.org/search.php?q=polygon(${coordinates.join(
//                 ','
//             )})&format=jsonv2`;

//             axios
//                 .get(url)
//                 .then((response) => {
//                     const cities = response.data.map((result: any) => result.address.city);
//                     setCityNames(cities);
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                 });
//         });
//     };

//     if (isLoaded) {
//         initMap();
//     }

//     return (
//         <div style={{ textAlign: 'center' }}>
//             <div ref={mapContainerRef} style={{ width: '75%', height: '400px', marginBottom: '20px' }} />
//             <div>
//                 <h2>City Names Inside Boundary:</h2>
//                 <ul>
//                     {cityNames.map((cityName, index) => (
//                         <li key={index}>{cityName}</li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }
export default AddBourndaries;