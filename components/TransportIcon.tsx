
import React from 'react';
import { ConnectionType } from '../types';

interface TransportIconProps {
  type: ConnectionType;
  className?: string;
}

const TransportIcon: React.FC<TransportIconProps> = ({ type, className = "w-5 h-5" }) => {
  switch (type) {
    case 'Bus':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <title>Bus</title>
          <g transform="translate(-.787 136.128)">
            <path d="M62.678 24.962c0 13.787-13.789 24.963-30.798 24.963-17.01 0-30.798-11.176-30.798-24.963C1.082 11.176 14.87 0 31.88 0s30.798 11.176 30.798 24.962" fill="#e31b1e" transform="matrix(1.02172 0 0 1.2482 -.318 -136.128)"/>
            <g transform="scale(1.09277 .9151)" fill="#fff">
              <path d="M45.805-107.143q0 6.894-3.878 11.002-2.785 2.93-8.53 2.93H17.51v-42.887h15.713q4.94 0 8.215 3.16 3.303 3.131 3.303 8.071 0 5.487-3.332 8.819 1.694 1.005 2.96 3.275a11.5 11.5 0 0 1 1.435 5.63m-8.474-16.718q0-5.458-4.452-5.458h-8.13v10.628h7.757q4.825 0 4.825-5.17m.89 17.292q0-5.343-5.227-5.343H24.75v11.921h8.072q5.4 0 5.4-6.578"/>
            </g>
          </g>
        </svg>
      );
    case 'FGC':
      return (
        <svg viewBox="0 0 49.25 49.25" className={className}>
          <title>FGC</title>
          <rect width="49.25" height="49.25" fill="#93d500"/>
          <path fill="#fff" d="M36.35,46.79H30.91a.39.39,0,0,1-.27-.68l10.59-9.83a3.64,3.64,0,0,0,1.15-2.65v-4.8a2.14,2.14,0,0,0-2.14-2.14H35.1a3,3,0,0,0-2,.77L21.35,38.07a.36.36,0,0,1-.26.11H18.45a.4.4,0,0,1-.4-.4V35.2a.41.41,0,0,1,.13-.29L30.57,23.59a5.89,5.89,0,0,1,4-1.53h5.88a6.5,6.5,0,0,1,6.51,6.51v4.8a8.74,8.74,0,0,1-2.83,6.45l-7.47,6.87a.43.43,0,0,1-.27.1"/>
          <path fill="#fff" d="M19.84,22.16,12.37,29a8.74,8.74,0,0,0-2.83,6.45v4.8a6.5,6.5,0,0,0,6.51,6.51h5.88a5.86,5.86,0,0,0,4-1.54L38.28,33.93a.39.39,0,0,0,.13-.29V31.07a.4.4,0,0,0-.39-.4H35.37a.42.42,0,0,0-.26.1L23.36,41.39a3,3,0,0,1-2,.77H16.22A2.14,2.14,0,0,1,14.08,40v-4.8a3.64,3.64,0,0,1,1.15-2.65l10.59-9.83a.39.39,0,0,0-.27-.68H20.11a.39.39,0,0,0-.27.1"/>
        </svg>
      );
    case 'Rodalies':
      return (
        <svg viewBox="286.332 487.592 133.195 133.195" className={className}>
          <title>Rodalies</title>
          <g transform="translate(0, 1108.379) scale(1, -1)">
            <path d="M286.332 620.787h133.195V487.592H286.332Z" fill="#f47216"/>
            <g transform="translate(342.09 520.066)">
              <path d="M0 0h23.918v27.072H36.64c9.461 0 10.113-7.719 10.765-15.112.326-4.023.761-8.047 1.957-11.96h23.921C71.108 3.588 71 12.829 70.673 16.635c-.87 9.678-4.893 16.853-11.416 19.353 7.937 2.937 11.633 11.418 11.633 19.463 0 14.679-11.743 22.182-25.334 22.182H0Zm24.463 59.148h11.201c9.133 0 11.85-2.826 11.85-7.719 0-6.96-6.088-7.721-10.546-7.721H24.463Z" fill="#fff"/>
            </g>
          </g>
        </svg>
      );
    case 'Tram':
      return (
        <svg viewBox="0 0 217.7 217.7" className={className}>
          <title>Tram</title>
          <path fill="#fff" fillRule="evenodd" d="M0 0h217.7v217.7H0z" clipRule="evenodd"/>
          <path fill="#008d78" d="M53.6 217.7h164.1v-50.8L161 110.3zM217.7 0H139l78.7 78.7zm-167 0H0v161.3l106-106z"/>
        </svg>
      );
    case 'Montjuïc':
    case 'Funicular de Montjuïc':
      return (
        <div className={`${className} bg-zinc-400 rounded-sm flex items-center justify-center`}>
          <span className="material-symbols-outlined text-white text-[14px]">landscape</span>
        </div>
      );
    case 'Aeropuerto':
      return (
        <div className={`${className} bg-blue-600 rounded-sm flex items-center justify-center`}>
          <span className="material-symbols-outlined text-white text-[14px]">flight</span>
        </div>
      );
    case 'Regional':
      return (
        <div className={`${className} bg-orange-700 rounded-sm flex items-center justify-center text-[8px] font-black text-white`}>R</div>
      );
    case 'AVE':
      return (
        <div className={`${className} bg-blue-900 rounded-sm flex items-center justify-center text-[7px] font-black text-white leading-none`}>AVE</div>
      );
    case 'Info':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="#e31b1e">
          <title>Informació</title>
          <path d="M32 6C17.641 6 6 17.641 6 32s11.641 26 26 26 26-11.641 26-26S46.359 6 32 6m.021 10C33.555 16 35 17.346 35 18.981A3.02 3.02 0 0 1 32.021 22C30.225 22 29 20.727 29 18.981 29 17.346 30.225 16 32.021 16M39 47H25v-3l5-1V30h-4v-3l8-1v17l5 1z"/>
        </svg>
      );
    default:
      return null;
  }
};

export default TransportIcon;
