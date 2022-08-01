import React, { useEffect, useState } from "react";
import { fromLonLat } from "ol/proj";
import {Feature} from "ol"
import { Point } from "ol/geom";
import { RMap, ROSM, RControl, RLayerVector, RStyle, RFeature, ROverlay } from "rlayers";

import "ol/ol.css";

import point from "../../../../assets/location.svg"
import { updateLocation } from "../../../../controller/CardController";

export const MapCard = ({card, boardId}) => {
  useEffect(() => {
    if (card.location) {
      setFeature(new Feature({
        geometry: new Point(card.location)
      }))
    }
  }, [card])
  
  const [feature, setFeature] = useState(null)
  const layerRef = React.createRef()
  return (
    <div className="map">
      <RMap
        width={"100%"}
        height={"80vh"}
        initial={{ center: fromLonLat([0, 0]), zoom: 4 }}
        onClick={(e) => {
          const coords = e.map.getCoordinateFromPixel(e.pixel);
          console.log(coords)
          setFeature(
            new Feature({
              geometry: new Point(coords)
            })
          )
          updateLocation(card.uid, boardId, coords)
          
        }}
      >
        <ROSM />
        <RLayerVector ref={layerRef}>
          <RStyle.RStyle>
            <RStyle.RIcon src={point} anchor={[0.5, 1]}/>
          </RStyle.RStyle>
          {feature ? (
            <RFeature
              key={feature.get("geometry")}
              feature={feature}
            >
            </RFeature>
          ) : <></>}
        </RLayerVector>
        
        <RControl.RScaleLine />
        <RControl.RAttribution />
        <RControl.RZoom />
        <RControl.RZoomSlider />
        <RControl.RFullScreen />
      </RMap>
    </div>
  );
};
