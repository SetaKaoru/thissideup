// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import videoBG from '../icons/anSkimVignette.mp4';
import '../index.css'; // Keep for global styles like fonts and variables
import BG1 from '../icons/bg1.jpg';
import BG2 from '../icons/bg2.jpg';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- Styled Components (No changes to these) ---
const slides = [
  '/bannerHD.jpg',
  '/aizat2.jpeg',
  '/mansurfingonriver.jpg',
  '/an2.jpeg',
  '/manonwakeboard.jpg',
  '/surferfeetcloseup.jpg',
];

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 100vh;
  width: auto;
  display: flex;
  align-items: center;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const InfoBox = styled.div`
  background-color: rgba(32, 32, 32, 0.85);
  padding: 1.5rem;
  /* CHANGED: Switched from fixed height to min-height for better text wrapping on small screens */
  min-height: 700px; 
  width: 90%;
  max-width: 560px;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.50);
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  color: var(--color-text-light, #FFFFFF);
  display: flex;
  flex-direction: column;
  justify-content: center; /* Better vertical alignment of content */

  @media (min-width: 768px) {
    padding: 2rem;
    margin-left: 5%;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    padding: 2.5rem 2rem;
    margin-left: 80px;
    margin-right: auto;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  color: var(--color-accent-orange, #FE9C7F);
  margin-bottom: 0.5em;
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Title = styled.p`
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: var(--color-text-light, #FFFFFF);
  line-height: 1.1;
  padding-bottom: 0.5em;
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Tagline = styled.p`
  font-size: 24px;
  color: var(--color-accent-orange, #FDDDFD);
  line-height: 1.4;
  margin-bottom: 1.5em;
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 20px;
  color: var(--color-text-light, #FFFFFF);
  line-height: 1.6;
  font-family: "Inria Serif", serif;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  &::before, &::after {
    content: '';
    flex-grow: 1;
    border-bottom: 2px solid var(--color-accent-orange, #FE9C7F);
  }
  img {
    width: clamp(24px, 5vw, 28px);
    height: auto;
    margin: 0 clamp(10px, 3vw, 16px);
  }
`;

const SlideBackground = styled.div`
  background-image: url(${props => props.bgImage});
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: 0;
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


// --- NEW STYLED COMPONENTS TO REPLACE INLINE & ID STYLES ---

const SlideshowControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 15px 0 10px 0;
  background-color: #222;
`;

const ControlDot = styled.button`
  width: 20px;
  height: 20px;
  margin-top: 3px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#7600AD' : 'white'};
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
  gap: 10px;
`;

const PromoSection = styled.section`
  display: flex;
  flex-direction: row; /* Default for desktop */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on tablet/mobile */
  }
`;

// Entire card is now a link for better UX
const PromoCard = styled(Link)`
  width: 50%; /* On desktop */
  position: relative;
  display: block; /* To make the link a container */
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%; /* Full width on tablet/mobile */
  }

  img {
    width: 100%;
    display: block; /* Removes bottom space under image */
    transition: transform 0.3s ease;
  }

  /* The overlay now lives inside the link */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    transition: background-color 0.3s ease;
  }
  
  &:hover {
    img {
      transform: scale(1.05);
    }
    &::after {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const PromoOverlayContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 1rem;
`;

const PromoTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-family: 'Inria Serif', serif;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
  margin: 0 0 1rem 0;
`;

const PromoButton = styled.span`
  background: var(--color-primary-purple, #7600AD);
  color: white;
  padding: 12px 32px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.2s;

  &:hover {
    background: var(--color-secondary-peach, #b19cd9);
  }
`;

// --- The Component ---
const Home = () => {
  const { currentUser } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, []);

  const dividerIcon = "/assets/icons/icons8-surfguy.png";

  return (
    <PageWrapper>
      <HeroSection>
        {slides.map((slide, index) => (
          <SlideBackground
            key={index}
            bgImage={slide}
            active={index === currentSlide}
          />
        ))}
        <InfoBox>
          <Subtitle>Skim & Ride</Subtitle>
          <Title>Find Your Next Adventure</Title>
          <Tagline>
            Premium skimboards and beach gear, crafted for wave chasers
          </Tagline>

          <Divider>
            <img src={dividerIcon} alt="Surfer icon" />
          </Divider>

          <Description>
            This Side Up is an online store for skimboards, beach
            supplies, and custom board designs. This website
            makes it easy for customers to shop for skim-
            boarding gear and personalise their boards.
          </Description>
        </InfoBox>
      </HeroSection>

      <SlideshowControls>
        {slides.map((_, index) => (
          <ControlDot
            key={index}
            active={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </SlideshowControls>

      <PromoSection>
        <PromoCard to='/products/category/Skimboards'>
          <img src={BG1} alt="The Bananas skimboard" />
          <PromoOverlayContent>
            <PromoTitle id='overlayHeader'>SKIMBOARDS</PromoTitle>
            <PromoButton id='overlayButton'>BROWSE</PromoButton>
          </PromoOverlayContent>
        </PromoCard>

        <PromoCard to={currentUser ? '/design-skimboard' : '/login'}>
          <img src={BG2} alt="Skimboard being maintained" />
          <PromoOverlayContent>
            <PromoTitle id='overlayHeader'>CUSTOMISE YOUR BOARD</PromoTitle>
            <PromoButton id='overlayButton'>
              {currentUser ? 'CUSTOMISE' : 'SIGN IN TO CUSTOMISE'}
            </PromoButton>
          </PromoOverlayContent>
        </PromoCard>
      </PromoSection>

      <VideoSection>
        <video src={videoBG} style={{cursor:'pointer'}} autoPlay loop muted />
      </VideoSection>
      
    </PageWrapper>
  );
};

export default Home;