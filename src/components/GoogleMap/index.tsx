import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Rectangle, useJsApiLoader } from '@react-google-maps/api';
import {
    Button,
    Input,
    TextField,
    Typography,
    MenuItem,
    CircularProgress,
    Box
} from "@mui/material";


declare global {
    interface Window {
        google: any;
    }
}

const loadGoogleMapsScript = (APIKEY: string) => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${APIKEY}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    document.head.appendChild(googleMapsScript);
};

const MapContainer = () => {
    const [rectangleBounds, setRectangleBounds] = useState<google.maps.LatLngBoundsLiteral | null>(null);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDisabled, setDisabled] = useState(true);
    const [dropValue, setDropValue] = useState("");
    const [clickedLocation, setClickedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [query, setQuery] = useState("")
    const autoCompleteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
    }, [loading])

    const initializeMap = () => {
        const mapElement = document.createElement('div');
        const mapOptions: google.maps.MapOptions = {
            center: { lat: -3.745, lng: -38.523 },
            zoom: 10,
        };
        const map = new google.maps.Map(mapElement, mapOptions);
        return map;
    };

    let map = initializeMap();

    let autoComplete: any

    const { isLoaded } = useJsApiLoader({
        id: 'google map',
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    });

    // const handleScriptLoaded = (updateQuery: any, autoCompleteRef: any) => {
    //     if (isLoaded) {
    //         autoComplete = new window.google.maps.places.Autocomplete(
    //             autoCompleteRef.current,
    //             {}
    //         );
    //         autoComplete.addListener('place_changed', () => {
    //             handlePlaceSelect(updateQuery);
    //         });
    //     }
    // }

    // const handlePlaceSelect = (updateQuery: any) => {
    //     const addressObject = autoComplete.getPlace()

    //     const query = addressObject.formatted_address
    //     updateQuery(query)
    //     console.log({ query });

    //     const latLng = {
    //         lat: addressObject?.geometry?.location.lat(),
    //         lng: addressObject?.geometry?.location.lng()
    //     }

    //     console.log({ latLng });

    // }
    useEffect(() => {
        if (isLoaded) {
            const KEY = 'AIzaSyCSv-yDRBj8qi92-Vo-9COPmwF3PlJOFJ8';
            loadGoogleMapsScript(KEY)
        }
    }, [isLoaded])

    const containerStyle = {
        width: '800px',
        height: '400px',
    };

    let centerInitial = {
        lat: -3.745,
        lng: -38.523,
    };

    useEffect(() => {
        if (!isDisabled && clickedLocation) {
            centerInitial = {
                lat: clickedLocation.lat,
                lng: clickedLocation.lng
            };
        }
    }, [isDisabled, clickedLocation]);

    console.log('centerInitial:', centerInitial);

    const defaultCenter = centerInitial

    const onMapClick = (event: any) => {
        setLoading(true)
        setDisabled(false)
        const north = event.latLng.lat() + 0.01;
        const south = event.latLng.lat() - 0.01;
        const east = event.latLng.lng() + 0.01;
        const west = event.latLng.lng() - 0.01;

        const bounds = {
            north,
            south,
            east,
            west,
        };
        console.log('latLng:', event.latLng.lat());

        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setClickedLocation({ lat, lng });
        // setRectangleBounds(bounds);
        // getNearbyPlaces(map, { lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const getNearbyPlaces = (map: google.maps.Map, location: google.maps.LatLngLiteral) => {
        if (window.google && window.google.maps) {
            const service = new window.google.maps.places.PlacesService(map);
            service.nearbySearch(
                {
                    location,
                    radius: 1000,
                },
                (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
                    console.log('results:', results, status);
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setPlaces(results || []);
                    }
                }
            );
        } else {
            console.error('Google Maps JavaScript API library not loaded.');
        }
    };

    const labelVal = isDisabled ? "click a location on map" : "select area"

    return (
        <div style={{ textAlign: "center" }}>
            <div id='map'>
            </div>
            <GoogleMap
                zoom={10}
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                onClick={onMapClick}
            >
                {/* {clickedLocation && (
                    <Marker
                        position={clickedLocation}
                        title="Clicked Location"
                    />
                )} */}
                {rectangleBounds && (
                    <Rectangle
                        bounds={rectangleBounds}
                        options={{ editable: true, draggable: true }}
                    />
                )}
                {places.map((place, index) => (
                    place !== undefined && place !== null && place.name && place.geometry && place.geometry.location ? (
                        <Marker
                            key={index}
                            position={{
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            }}
                            title={place.name}
                        />
                    ) : null
                ))}
            </GoogleMap>

            <Box sx={{ position: 'relative' }}>
                <TextField
                    variant="outlined"
                    select
                    disabled={isDisabled}
                    id="location"
                    name="location"
                    label={labelVal}
                    placeholder={labelVal}
                    value={dropValue}
                    // onChange={handleChange}
                    sx={{ mb: 3, mt: 3 }}
                    size="medium"
                    style={{
                        width: "50%",
                        visibility: loading ? "hidden" : "visible",
                    }}
                >
                    <MenuItem value={'Berlin'} onClick={() => {
                        setDropValue('Berlin')
                    }}>
                        Berlin
                    </MenuItem>
                    <MenuItem value={'Hamburg'} onClick={() => {
                        setDropValue('Hamburg')
                    }}>
                        Hamburg
                    </MenuItem>
                    <MenuItem value={'Mecklenburg'} onClick={() => {
                        setDropValue('Mecklenburg')
                    }}>
                        Mecklenburg
                    </MenuItem>
                    <MenuItem value={'Hesse'} onClick={() => {
                        setDropValue('Hesse')
                    }}>
                        Hesse
                    </MenuItem>
                    <MenuItem value={'Brandenburg'} onClick={() => {
                        setDropValue('Brandenburg')
                    }}>
                        Brandenburg
                    </MenuItem>
                </TextField>
                {loading && (
                    <CircularProgress
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                        }}
                    />
                )}
            </Box>
        </div>

    );
};

export default MapContainer;
