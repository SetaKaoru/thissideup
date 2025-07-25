// File: src/pages/FAQ.js
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import '../index.css';


const FAQPageWrapper = styled.div`
  background-color: var(--color-background-medium-dark, #222); 
  // min-height: 100vh;
  height: auto;
`;

const HeroBanner = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover; 
  background-repeat: no-repeat;
  background-position: center center;
  height: 250px; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; 

  @media (min-width: 768px) {
    height: 300px; 
  }
`;

const HeroTextBox = styled.div`
  background: linear-gradient(to right, rgba(27,0,39,0.75), rgba(96,0,141,0.75), rgba(96,0,141,0.75), rgba(27,0,39,0.75));
  width: 90%; 
  max-width: 706px; 
  padding: 1.5rem;
  text-align: center;
  border-radius: var(--border-radius-m, 8px); 
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageTitle = styled.p` 
  font-size: clamp(2rem, 6vw, 3.5rem); 
  color: var(--color-text-light, #FFFFFF);
  line-height: 1.2;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.25);
  margin: 0; 
`;

const FAQContentSection = styled.div`
  padding: 1.5rem 1rem;
  margin-top: 19px; 
  
  @media (min-width: 768px) {
    padding: 2rem 2rem 0rem 2rem;
  }
`;

const FAQContainer = styled.div`
  background: linear-gradient(to right, rgba(27,0,39,0.65), rgba(96,0,141,0.65), rgba(96,0,141,0.65), rgba(27,0,39,0.65));
  width: 100%; 
  max-width: 706px; 
  margin: 0 auto; 
  padding: 1.5rem;
  border-radius: var(--border-radius-m, 8px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  @media (min-width: 768px) {
    padding: 2rem;
    margin-top: -50px; 
  }
`;

// const SearchForm = styled.form`
//   margin-bottom: 2rem;
// `;

// const SearchInput = styled.input`
//   width: 100%;
//   padding: 0.75rem 1rem; 
//   font-size: clamp(0.9rem, 2.5vw, 1rem); 
//   border-radius: var(--border-radius-s, 4px);
//   border: 1px solid var(--color-primary-purple-light, #7A5FD3);
//   background-color: rgba(255,255,255,0.1);
//   color: var(--color-text-light, #FFFFFF);
//   box-sizing: border-box;

//   &::placeholder {
//     color: var(--color-neutral-gray-light, #BDBDBD);
//   }

//   &:focus {
//     outline: none;
//     border-color: var(--color-accent-peach, #FE9C7F);
//     background-color: rgba(255,255,255,0.15);
//   }
// `;

const AccentHighlight = styled.span`
  color: var(--color-accent-orange, #FE9C7F);
  font-weight: bold;
  background: rgba(254, 156, 127, 0.1); 
  padding: 2px 6px; 
  border-radius: var(--border-radius-s, 4px);
  transition: background 0.2s;
`;

// --- QnOpen Component Styled ---
const FAQItemWrapper = styled.div`
  background-color: rgba(120, 64, 91, 0.8);
  border-radius: var(--border-radius-s, 6px);
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid transparent; 

  &:hover {
    background-color: rgba(120, 64, 91, 0.25);
  }
  
  ${props => props.isOpen && css`
    background-color: rgba(120, 64, 91, 0.8); 
  `}
`;

const QuestionHeader = styled.div`
  padding: 1rem; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(1rem, 3vw, 1.125rem); 
  color: var(--color-text-light, #FFFFFF);
  font-weight: 500; 
`;

const QuestionText = styled.p`
  margin: 0;
  flex-grow: 1;
`;

const AnswerDivider = styled.div`
  border: none;
  height: 1.5px;
  background: var(--color-accent-pink, #FFD9EB);
  margin: 0 1rem 1rem 1rem; 
  width: auto; 
`;

const ToggleIcon = styled.span`
  font-size: 1.5rem;
  color: var(--color-accent-peach, #FE9C7F);
  margin-left: 1rem;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}; 
`;

// ***** MODIFIED AnswerContent *****
const AnswerContent = styled.div`
  padding-left: 1rem;   /* Keep left/right padding for content alignment */
  padding-right: 1rem;
  padding-top: 0;       /* Initially no top/bottom padding */
  padding-bottom: 0;

  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(0.9rem, 2.5vw, 1rem); 
  color: var(--color-text-neutral-light, #E0E0E0);
  line-height: 1.6;
  
  max-height: 0;
  opacity: 0; /* Start fully transparent */
  overflow: hidden;
  
  /* Transition max-height, opacity, and padding-bottom */
  transition: max-height 0.35s ease-in-out, 
              opacity 0.35s ease-in-out,
              padding-bottom 0.35s ease-in-out; 

  p {
    margin-top: 0;
    margin-bottom: 0.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ${props => props.isOpen && css`
    max-height: 500px; /* Adjust if answers can be very long */
    opacity: 1; /* Fade in */
    padding-bottom: 1rem; /* Add padding-bottom when open for spacing */
    /* padding-top could be added here if the divider wasn't present or if more space above text is needed */
  `}
`;
// ***** END OF MODIFIED AnswerContent *****


function QnOpen({ question, ans }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <FAQItemWrapper onClick={handleClick} isOpen={isVisible}>
      <QuestionHeader>
        <QuestionText>{question}</QuestionText>
        <ToggleIcon isOpen={isVisible}>+</ToggleIcon>
      </QuestionHeader>
      
      {isVisible && ans && <AnswerDivider />} 

      <AnswerContent isOpen={isVisible}>
        {typeof ans === 'string' ? ans.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        )) : ans } 
      </AnswerContent>
    </FAQItemWrapper>
  );
}

const FAQ = () => {
  const backgroundImage = "/bannerHD.jpg"; 

  const faqData = [
    {
      id: 1,
      question: <>How do I customise my skimboard?</>,
      ans: "1. Click 'Design Your Own Board' on the homepage.\n2. Design as you please. 🎨\n3. Add to cart & checkout!"
    },
    {
      id: 2,
      question: <>How long does order processing take?</>,
      ans: <>🚀 Order Processing: 1-2 business days (3-5 days for custom boards).<br />📦 Fast Shipping? Add Express at checkout!<br />📧 Questions? <AccentHighlight>inquiries@thissideup.com</AccentHighlight></>
    },
    {
      id: 3,
      question: <>What if my order arrives damaged?</>,
      ans: <>Please contact us immediately at <AccentHighlight>inquiries@thissideup.com</AccentHighlight> with photos for a quick resolution.</>
    },
    {
      id: 4,
      question: <>Do you ship internationally?</>,
      ans: "🌍 Yes, we ship worldwide! Shipping rates vary by destination."
    },
    {
      id: 5,
      question: <>Do you accept returns/refunds?</>,
      ans: "✅ Yes, we do! Returns/refunds are accepted within 30 days for unused items. Check our full policy for details."
    }
  ];
  
  return (
    <FAQPageWrapper>
      <HeroBanner bgImage={backgroundImage}>
        <HeroTextBox>
          <PageTitle id='font1'>Frequently Asked Questions (FAQs)</PageTitle>
        </HeroTextBox>
      </HeroBanner>

      <FAQContentSection>
        <FAQContainer>
          {/* <SearchForm onSubmit={(e) => e.preventDefault()}> 
            <SearchInput 
              type="text"
              placeholder='Type your question'
            />
          </SearchForm> */}
          
          {faqData.map(item => (
            <QnOpen key={item.id} question={item.question} ans={item.ans} />
          ))}

        </FAQContainer>
      </FAQContentSection>
    </FAQPageWrapper>
  );
};

export default FAQ;