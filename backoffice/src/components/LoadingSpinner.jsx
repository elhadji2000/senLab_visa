import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation pour la rotation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Style du spinner
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-family: 'Segoe UI', sans-serif;
  color: #3498db;
  font-size: 1.2rem;
  font-weight: 500;
`;

function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>Chargement en cours...</LoadingText>
    </SpinnerContainer>
  );
}

export default LoadingSpinner;