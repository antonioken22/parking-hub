import React from 'react';
import Announcement from '../parking-history/_components/announcement';

const AnnouncementPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: '0', padding: '0', overflow: 'hidden' }}>
      <iframe 
        src="https://cit.edu/?fbclid=IwY2xjawEQUZBleHRuA2FlbQIxMAABHdVvyC7Jvw4-Kxe0SbZFQF00lqd-wESETHuLu5RNQ0_C2VMZ4UozUI_MfA_aem_bIVtYh7YvDkj_Df3WjgD-w" 
        style={{ width: '100%', height: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
}

export default AnnouncementPage;
