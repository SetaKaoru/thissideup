import React from 'react';
import styled from 'styled-components';

const FooterSection = styled.footer`
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(90deg, #3D0B52, #1A1A1A);
  color: #FFFFFF;
  padding: 24px 16px;
  justify-content: space-between;
`;

const FooterColumn = styled.div`
  flex: 1 1 200px;
  margin-bottom: 16px;
`;

const FooterHeading = styled.h3`
  font-size: 18px;
  color: #FFD9EB;
  margin-bottom: 12px;
  font-family: var(--font-heading);
`;

const FooterDivider = styled.hr`
  border: none;
  height: 1.5px;
  background: #FFD9EB;
  margin: 6px 0 12px 0;
  width: 100px;
`;

const FooterText = styled.p`
  font-size: 13px;
  color: #E0E0E0;
  line-height: 1.5;
  margin-bottom: 6px;
  font-family: var(--font-main);
`;

const FooterLink = styled.a`
  display: block;
  font-size: 13px;
  color: #E0E0E0;
  margin-bottom: 6px;
  text-decoration: none;
  font-family: var(--font-main);

  &:hover {
    color: #FFD9EB;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0;
  align-items: center;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover {
    transform: scale(1.06);
    transition: 0.25s ease;
  }
`;

const Footer = () => {
  return (
    <FooterSection id='font25'>
      <FooterColumn>
        <FooterHeading id='font2'>Our Slogan</FooterHeading>
        <FooterDivider />
        <FooterText>
          "Ride the Shallow,<br />Rule the Shore."
        </FooterText>
      </FooterColumn>

      <FooterColumn>
        <FooterHeading id='font2'>Social Media</FooterHeading>
        <FooterDivider />
        <SocialIcons>
          <a href="https://www.instagram.com/this_side_up.sg/" target="_blank" rel="noopener noreferrer">
            <IconImage src="/assets/icons/instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.tiktok.com/@this_side_up.sg" target="_blank" rel="noopener noreferrer">
            <IconImage src="/assets/icons/tiktok.png" alt="TikTok" />
          </a>
        </SocialIcons>
        <FooterText>@this_side_up.sg</FooterText>
      </FooterColumn>

      <FooterColumn>
        <FooterHeading id='font2'>Policies and Info</FooterHeading>
        <FooterDivider />
        <FooterLink href="/PrivacyPolicy">Privacy Policy</FooterLink>
        <FooterLink href="/TermsConditions">Terms & Conditions</FooterLink>
        <FooterText>© 2025 This Side Up. All Rights Reserved.</FooterText>
      </FooterColumn>

      <FooterColumn>
        <FooterHeading id='font2'>Contact</FooterHeading>
        <FooterDivider />
        <FooterText>📍 112 East Coast Road, #02-08 KANTONG MALL</FooterText>
        <FooterText>📞 +65 8900 2121</FooterText>
        <FooterText>📠 53451524L</FooterText>
        <FooterText>📧 inquiries@thissideup.com</FooterText>
      </FooterColumn>
    </FooterSection>
  );
};

export default Footer;