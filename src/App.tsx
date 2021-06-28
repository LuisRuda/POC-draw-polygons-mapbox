import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import MapGL from 'react-map-gl';
import * as dotenv from 'dotenv';
import * as toGeoJSON from '@tmcw/togeojson';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';

import { getFeatureStyle, getEditHandleStyle, UploadForm } from './style';
import { IViewPort } from './types';
import FileImportIcon from './file-import-solid.svg';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
};

export default function App() {
  dotenv.config();
  Modal.setAppElement('#root');

  const editorRef = useRef<any>(null);

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [viewport, setViewport] = useState<IViewPort>({
    latitude: -24.965146,
    longitude: -50.388881,
    zoom: 14,
  });
  const [mode, setMode] = useState<any>(new EditingMode());
  const [features, setFeatures] = useState<any>([]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<any>(null);

  // GET CURRENT POSITION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setViewport((prevState: IViewPort) => ({
        ...prevState,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  }, []);

  useEffect(() => {
    editorRef.current?.addFeatures(features);
  }, []);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function onSelect(options) {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  }

  function onUpdate({ data, editType }) {
    setFeatures(data);
    if (editType === 'addFeature') {
      setMode(new EditingMode());
    }
  }

  function onDelete() {
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      const tempFeatures = features.filter(
        (_: any, idx: number) => idx !== selectedFeatureIndex,
      );
      setFeatures(tempFeatures);
    }
  }

  function convertKML(kmlFileString) {
    const dom = new DOMParser().parseFromString(kmlFileString, 'text/xml');
    const parsedGeojson = toGeoJSON.kml(dom);
    const features = parsedGeojson?.features;

    if (features?.length > 0) {
      setFeatures((oldState: any) => [...oldState, ...features]);

      const feature = features[0];
      const coordinates = feature?.geometry?.coordinates[0];

      if (coordinates?.length > 0) {
        const firstCoordinate = coordinates[0];
        if (firstCoordinate?.length >= 1) {
          const lgt = firstCoordinate[0];
          const ltd = firstCoordinate[1];
          setViewport((prevState: IViewPort) => ({
            ...prevState,
            latitude: ltd,
            longitude: lgt,
          }));
        }
      }
    }

    closeModal();
  }

  function readFile(file, onLoadCallback) {
    const reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsText(file);
  }

  function uploadFile(e) {
    readFile(e.target.files[0], e => {
      convertKML(e.target.result);
    });
  }

  const drawTools = (
    <div className="mapboxgl-ctrl-top-left">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        <button
          type="button"
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
          title="Polygon tool (p)"
          onClick={() => setMode(new DrawPolygonMode())}
        />
        <button
          type="button"
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
          title="Delete"
          onClick={onDelete}
        />
        <button
          type="button"
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_upload"
          title="Upload"
          onClick={openModal}
        >
          <img src={FileImportIcon} alt="upload" height={12} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={setViewport}
      >
        <Editor
          ref={editorRef}
          style={{ width: '100%', height: '100%' }}
          clickRadius={12}
          mode={mode}
          features={features}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editHandleShape="circle"
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {drawTools}
      </MapGL>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <UploadForm>
          <h2>Selecione o arquivo KML</h2>
          <input type="file" accept=".kml" onChange={uploadFile} />
        </UploadForm>
      </Modal>
    </>
  );
}
