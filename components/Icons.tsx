
import React from 'react';

type IconProps = {
  className?: string;
};

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.347.195c.539.045.92.543.875 1.082l-.161 1.002c.487.21.94.475 1.362.787l.836-.363c.52-.225 1.131.06 1.32.558l1.09 1.898c.19.498-.06.996-.558 1.32l-.836.363c.045.24.08.483.104.729l1.002.161c.542.09.952.56 1.082.875l.195 2.347c.045.539-.336 1.037-.875 1.082l-1.002.161c-.21.487-.475.94-.787 1.362l.363.836c.225.52.06 1.131-.558 1.32l-1.898 1.09c-.498.19-.996-.06-1.32-.558l-.363-.836c-.483.045-.96.08-1.44.104l-.161 1.002c-.09.542-.56 1.007-1.11.952l-2.347-.195c-.539-.045-.92-.543-.875-1.082l.161-1.002c-.487-.21-.94-.475-1.362-.787l-.836.363c-.52.225-1.131-.06-1.32-.558l-1.09-1.898c-.19-.498.06-.996.558-1.32l.836-.363c-.045-.24-.08-.483-.104-.729l-1.002-.161c-.542-.09-.952-.56-1.082-.875l-.195-2.347c-.045-.539.336-1.037.875-1.082l1.002-.161c.21-.487.475-.94.787-1.362l-.363-.836c-.225-.52-.06-1.131.558-1.32l1.898-1.09c.498-.19.996.06 1.32.558l.363.836c.483-.045.96-.08 1.44-.104l.161-1.002zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);

export const CameraOffIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5A2.25 2.25 0 012.25 16.5V7.5A2.25 2.25 0 014.5 5.25H9m6.75 13.5l-3.75-3.75M3 3l18 18" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
