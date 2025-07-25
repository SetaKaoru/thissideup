import React from 'react';
import styled from 'styled-components';
import '../index.css';


const AboutPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background-dark, #121212);
`;

const AboutHeroSection = styled.section`
  flex-grow: 1;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const TextOverlayBox = styled.div`
  background-color: rgba(26, 26, 26, 0.88);
  color: var(--color-text-light, #ffffff);
  padding: 1.5rem;
  border-radius: var(--border-radius-m, 8px);
  width: 90%;
  max-width: 850px;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  @media (min-width: 768px) {
    padding: 2.5rem;
    width: 80%;
  }
  @media (min-width: 1024px) {
    padding: 36px;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading, 'Lilita One', cursive);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  color: var(--color-accent-pink, #FFD9EB);
  margin-bottom: 1.5rem;
  text-align: left;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const AboutText = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text-neutral-light, #e0e0e0);
  margin-bottom: 1.25rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  &:first-of-type::first-letter {
    font-family: var(--font-heading, 'Lilita One', cursive);
    font-size: clamp(3rem, 10vw, 4rem);
    color: var(--color-accent-orange, #FE9C7F);
    float: left;
    line-height: 0.8;
    margin-right: 0.2em;
    margin-top: 0.1em;
    padding-top: 0.1em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* Clear the float for subsequent paragraphs if needed, or ensure enough margin */
  & + & { /* Selects an AboutText that directly follows another AboutText */
    /* clear: left; // Option 1: if float is causing issues with next paragraph start
                    // This might not be needed if margins are sufficient */
  }
`;

const AccentHighlight = styled.span`
  color: var(--color-accent-orange, #FE9C7F); /* Using CSS var */
  font-weight: bold; /* Keep bold if desired, or let font-heading handle it */
`;

// Main Component
const AboutPage = () => {
  const backgroundImage = "AbootHD.jpg";

  return (
    <AboutPageWrapper>
      <AboutHeroSection bgImage={backgroundImage}>
        <TextOverlayBox>
          <PageTitle>
            <AccentHighlight>About Us</AccentHighlight>
          </PageTitle>
          <AboutText className='about'>
            This Side Up is a passionate skimboard company based in Singapore, dedicated to
            bringing the thrill of skimboarding to enthusiasts of all skill levels. We
            specialize in custom-designed skimboards, blending high-quality materials with
            bold, personalized designs that not only perform exceptionally but also reflect
            your unique style.
          </AboutText>
          <AboutText className='about'>
            Rooted in Singapore's vibrant coastal culture, This Side Up was founded with a
            vision to inspire a community of adventure seekers, wave chasers, and outdoor
            lovers. More than just a brand, we're a movement — promoting an active, creative,
            and connected lifestyle by the shore.
          </AboutText>
          <AboutText className='about'>
            To further connect with our growing community, we're expanding our presence through
            a dedicated e-commerce website. Here, you'll be able to shop our range of premium
            skimboards, essential skimboarding supplies, stylish apparel, and even design your
            own custom boards to ride your way.
          </AboutText>
          <AboutText className='about'>
            Whether you're a seasoned rider or new to the sport, This Side Up is your go-to
            destination for everything skimboarding in Singapore and beyond.
          </AboutText>
        </TextOverlayBox>
      </AboutHeroSection>
    </AboutPageWrapper>
  );
};

export default AboutPage;