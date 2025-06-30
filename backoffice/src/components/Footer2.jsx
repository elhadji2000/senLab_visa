import React from 'react';
import { Container } from 'react-bootstrap';
import logo1 from '/src/assets/ugb.png';
import logo2 from '/src/assets/uidt.png';
import logo3 from '/src/assets/logo-uadb.png';
import logo4 from '/src/assets/logo.png';
import logo5 from '/src/assets/uasz.png';

function Footer2() {
  return (
    <footer className="footer bg-light py-3 mt-auto">
      <Container>
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
          <img src={logo1} alt="UGB" style={logoStyle} />
          <img src={logo2} alt="UIDT" style={logoStyle} />
          <img src={logo3} alt="UADB" style={logoStyle} />
          <img src={logo4} alt="LOGO" style={logoStyle} />
          <img src={logo5} alt="UASZ" style={logoStyle} />
        </div>
      </Container>
    </footer>
  );
}

const logoStyle = {
  height: '50px',
  maxWidth: '100px',
  objectFit: 'contain'
};

export default Footer2;
