import React from 'react';
import logo1 from '../frontoffice/src/assets/ugb.png';
import logo2 from '../frontoffice/src/assets/uidt.png';
import logo3 from '../frontoffice/src/assets/logo-uadb.png';
import logo4 from '../frontoffice/src/assets/logo.png';
import logo5 from '../frontoffice/src/assets/uasz.png';

function Footer2() {
  return (
    <footer className="bg-light py-3 mt-5">
      <Container>
        <div
          className="d-flex flex-wrap justify-content-center align-items-center gap-4"
          style={{ rowGap: '1rem' }}
        >
          <img src={logo1} alt="UGB" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
          <img src={logo2} alt="UIDT" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
          <img src={logo3} alt="UADB" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
          <img src={logo4} alt="LOGO" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
          <img src={logo5} alt="UASZ" style={{ height: '50px', maxWidth: '100px', objectFit: 'contain' }} />
        </div>
      </Container>
    </footer>
  );
}

export default Footer2;
