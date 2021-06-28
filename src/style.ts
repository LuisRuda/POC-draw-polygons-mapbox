import { RENDER_STATE } from 'react-map-gl-draw';
import styled from 'styled-components';

export function getEditHandleStyle({ state }: any) {
  switch (state) {
    case RENDER_STATE.SELECTED:
    case RENDER_STATE.HOVERED:
    case RENDER_STATE.UNCOMMITTED:
      return {
        fill: 'rgb(251, 176, 59)',
        fillOpacity: 1,
        stroke: 'rgb(255, 255, 255)',
        strokeWidth: 2,
        r: 7,
      };

    default:
      return {
        fill: 'rgb(251, 176, 59)',
        fillOpacity: 1,
        stroke: 'rgb(255, 255, 255)',
        strokeWidth: 2,
        r: 5,
      };
  }
}

export function getFeatureStyle({ state }: any) {
  switch (state) {
    case RENDER_STATE.SELECTED:
    case RENDER_STATE.HOVERED:
    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      return {
        stroke: 'rgb(251, 176, 59)',
        strokeWidth: 2,
        fill: 'rgb(251, 176, 59)',
        fillOpacity: 0.3,
        strokeDasharray: '4,2',
      };

    default:
      return {
        stroke: 'rgb(60, 178, 208)',
        strokeWidth: 2,
        fill: 'rgb(60, 178, 208)',
        fillOpacity: 0.1,
      };
  }
}

export const UploadButton = styled.div`
  width: 90px;
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  z-index: 999999999990000 !important;
`;

export const UploadForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 30px;

  input {
    height: 20px;
    width: 100%;
    display: block;
    margin-top: 30px;
    bottom: 2px;
  }

  button {
    width: 100%;
    height: 40px;
  }
`;
