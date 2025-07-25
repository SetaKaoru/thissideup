import React from 'react';
import styled from 'styled-components';
import '../index.css';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background-dark, #121212);
`;

const HeroSection = styled.section`
  flex-grow: 1;
  background-image: url('AbootHD.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const TextOverlayBox = styled.div`
  background-color: #ffffff;
  color: #000000;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 850px;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading, 'Lilita One', cursive);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  color: var(--color-accent-pink, #FFD9EB);
  margin-bottom: 1.5rem;
  text-align: left;
`;

const PageText = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #000000;
  margin-bottom: 1.25rem;
`;

const PrivacyPolicy = () => {
  return (
    <PageWrapper>
      <HeroSection>
        <TextOverlayBox>
          <PageTitle>Privacy Policy</PageTitle>
          <PageText>At This Side Up, your privacy matters. This policy explains how we handle and protect your data.</PageText>
          <PageText><strong>What we collect:</strong> Name, email, address, payment info when placing orders or subscribing.</PageText>
          <PageText><strong>Use of info:</strong> To fulfill orders, improve services, and send updates or offers.</PageText>
          <PageText><strong>Data sharing:</strong> Only with necessary third parties like payment gateways or couriers.</PageText>
          <PageText><strong>Policy changes:</strong> We may update this page periodically without notice.</PageText>
        </TextOverlayBox>
      </HeroSection>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
