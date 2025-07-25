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
  background-color: black;
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
  color: var(--color-accent-orange,rgb(255, 255, 255));
  font-weight: bold;
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
  font-weight: 600;
  // letter-spacing: 1.7px;
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

  const faqData = [
    {
      id: 1,
      question: <>1. ACCEPTANCE OF TERMS</>,
      ans: <div>
        <p>
          By accessing, browsing, or using the website thissideup.com (the 'Site'), operated by This Side Up, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions ('Terms'). If you do not agree to these Terms, you must immediately discontinue use of the Site.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and This Side Up. We reserve the right to modify these Terms at any time, with changes becoming effective upon posting. Your continued use of the Site after modifications constitutes acceptance of the revised Terms.
        </p>
      </div>
    },
    {
      id: 2,
      question: <>2. ELIGIBILITY AND ACCOUNT REGISTRATION</>,
      ans: <div>
      <AccentHighlight>2.1 Eligibility</AccentHighlight>
      <p>To use the Site or purchase products, you must:</p>
      <ul>
        <li>- Be at least **18 years of age** (or the legal age of majority in your jurisdiction).</li>
        <li>- Provide accurate, current, and complete registration information.</li>
        <li>- Not be barred from receiving goods or services under applicable law.</li>
      </ul>
      <br></br>
      <AccentHighlight>2.2 Account Security</AccentHighlight>
      <ul>
        <li>- You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>- You agree to notify us immediately of any unauthorized account activity.</li>
        <li>- We reserve the right to suspend or terminate accounts that violate these Terms. </li>
      </ul>
      </div>
    },
    {
      id: 3,
      question: <>3. PRODUCT ORDERS AND PAYMENT TERMS</>,
      ans: <div>
        <AccentHighlight>3.1 Order Acceptance</AccentHighlight>
        <ul>
          <li>- All orders are subject to product availability and our acceptance.</li>
          <li>- We may refuse or cancel orders for any reason, including suspected fraud or errors.</li>
        </ul>
        <br></br>
        <AccentHighlight>3.2 Pricing and Taxes</AccentHighlight>
        <ul>
          <li>- Prices are displayed in SGD and are subject to change without notice.  </li>
          <li>- You are responsible for all applicable sales taxes, customs duties, or import fees.  </li>
        </ul>
        <br></br>
        <AccentHighlight>3.3 Payment Methods</AccentHighlight>
        <p>We accept:</p>
        <ul>
          <li>- Credit/Debit Cards (Visa, Mastercard, American Express)</li>
          <li>- PayNow</li>
        </ul>
        <br></br>
        <AccentHighlight>3.4 Shipping & Delivery</AccentHighlight>
        <ul>
          <li>- Delivery times are estimates only.</li>
          <li>- Risk of loss passes to you upon delivery.</li>
        </ul>
        <br></br>
        <AccentHighlight>3.5 Returns & Refunds</AccentHighlight>
        <ul>
          <li>- Returns must be requested within 5 days of delivery.</li>
          <li>- Products must be unused and in original packaging.</li>
          <li>- Refunds will be processed within 5 business days.  </li>
        </ul>
      </div>
    },
    {
      id: 4,
      question: <>4. USER CONDUCT & PROHIBITED ACTIVITIES</>,
      ans: <div>
        <p>You agree NOT to:</p>
        <ul>
          <li>- Use the Site for illegal purposes or in violation of any laws.</li>
          <li>- Upload viruses, malware, or engage in hacking attempts.</li>
          <li>- Scrape, data-mine, or reverse-engineer the Site.</li>
          <li>- Impersonate another person or entity.  </li>
          <li>- Post false, defamatory, or harmful content.  </li>
        </ul>
      </div>
    },
    {
      id: 5,
      question: <>5. DISCLAIMERS & LIMITATION OF LIABILITY</>,
      ans: <div>
        <AccentHighlight>5.1 Product Use Disclaimer</AccentHighlight>
        <p>Skimboarding is an inherently risky activity. By purchasing our products, you acknowledge and assume all risks associated with their use. This Side Up is NOT liable for:</p>
        <ul>
          <li>- Personal injury or property damage resulting from product misuse. </li>
          <li>- Improper assembly or failure to follow safety guidelines.  </li>
        </ul>
        <br></br>
        <AccentHighlight>5.2 Site Disclaimer</AccentHighlight>
        <p>The Site is provided as is without warranties of any kind. We do not guarantee:</p>
        <ul>
          <li>- Uninterrupted or error-free operation.</li>
          <li>- Accuracy of product descriptions or pricing.</li>
        </ul>
        <br></br>
        <AccentHighlight>5.3 Limitation of Liability</AccentHighlight>
        <p>To the fullest extent permitted by law, This Side Up shall NOT be liable for:</p>
        <ul>
          <li>- Indirect, incidental, or consequential damages.</li>
          <li>- Loss of profits, data, or business opportunities.</li>
          <li>- Claims exceeding the amount paid for the product(s) in question.</li>
        </ul>
        <br></br>
      </div>
    },
    {
      id: 6,
      question: <>ACKNOWLEDGMENT</>,
      ans: <div>
        <p>By using This Side Up, you confirm that you have read, understood, and agreed to these Terms and Conditions in their entirety.</p>
      </div>
    },
    
  ];
  
  return (
    <FAQPageWrapper>
      <HeroBanner>
        <HeroTextBox>
          <PageTitle id='font1'>Terms & Conditions</PageTitle>
        </HeroTextBox>
      </HeroBanner>

      <FAQContentSection>
        <FAQContainer>
          {faqData.map(item => (
            <QnOpen key={item.id} question={item.question} ans={item.ans} />
          ))}
          <h3 id='font2' style={{fontSize: "clamp(0.9rem, 2.5vw, 1rem)", color: "#E0E0E0"}}>Last Updated: 7/7/2025</h3>
        </FAQContainer>
      </FAQContentSection>
    </FAQPageWrapper>
  );
};

export default FAQ;