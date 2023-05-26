"use client";

import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, DistanceMatrixService } from '@react-google-maps/api';
import { decode, encode } from "@googlemaps/polyline-codec";

export default async function Map() {
  const containerStyle = {
    width: '1000px',
    height: '600px'
  };

  // Auckland Art Gallery
  let startPointLat = -36.851068176829905;
  let startPointLng = 174.76628605352832;

  // Sky Tower
  let endPointLat = -36.84812374907156;
  let endPointLng = 174.76233102141367;

  const startPosition = { lat: startPointLat, lng: startPointLng }
  const endPosition = { lat: endPointLat, lng: endPointLng }

  const center = {
    lat: ((startPointLat + endPointLat) / 2.0),
    lng: ((startPointLng + endPointLng) / 2.0)
  }

  console.log(center.lat + ' ' + center.lng);

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    } as Record<string, string>,
    body: JSON.stringify({
      "origin": {
        "location": {
          "latLng": {
            "latitude": startPointLat,
            "longitude": startPointLng,
          }
        }
      },
      "destination": {
        "location": {
          "latLng": {
            "latitude": endPointLat,
            "longitude": endPointLng,
          }
        }
      },
      "travelMode": "DRIVE",
      "routingPreference": "TRAFFIC_AWARE",
      "departureTime": "2023-10-15T15:01:23.045123456Z",
      "computeAlternativeRoutes": false,
      "routeModifiers": {
        "avoidTolls": false,
        "avoidHighways": false,
        "avoidFerries": false
      }
    }),
  };

  let data: any = {};

  try {
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', requestOptions);
    data = await response.json()

    var service = new google.maps.DistanceMatrixService();
    let origins = new Array();
    let destinations = new Array();

    for (let i = 0; i < decode(data.routes[0].polyline.encodedPolyline, 5).length - 1; i++) {
      origins.push(decode(data.routes[0].polyline.encodedPolyline, 5)[i]);
      destinations.push(decode(data.routes[0].polyline.encodedPolyline, 5)[i + 1])
    }

    service.getDistanceMatrix(
      {
        origins: origins,
        destinations: destinations,
        travelMode: google.maps.TravelMode['DRIVING'],
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
      }, callback);

    // Handle the response
    console.log(data.routes[0]);
    console.log(decode(data.routes[0].polyline.encodedPolyline, 5));
  } catch {
    // Handle any errors
    console.log('error');
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        <Marker
          position={startPosition}
          title='Start'
        />
        <Marker
          position={endPosition}
          title='End'
        />
        <></>
      </GoogleMap>
    </LoadScript>
  );
}