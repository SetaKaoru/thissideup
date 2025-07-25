// src/pages/UserProfile.js

import React from 'react';
import styled from 'styled-components';
// --- 1. Import useNavigate from react-router-dom ---
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

// --- Styled Components (with additions) ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--gradient-products);
  color: var(--color-text-light, #FFFFFF);
  padding: 48px 24px;
  font-family: 'Instrument Sans', sans-serif;
`;

const ProfileContainer = styled.main`
  max-width: 1100px;
  margin: 0 auto;
`;

// ... (ProfileHeader, ProfileCard, DetailRow, SectionTitle, ActionGrid, ActionCard styled components remain unchanged) ...
const ProfileHeader = styled.div`
  margin-bottom: 40px;
  h1 {
    font-family: 'Inria Serif', serif;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    color: var(--color-text-light);
    margin: 0;
  }
  p {
    font-size: 1.25rem;
    color: var(--color-neutral-gray-light, #E0E0E0);
    margin-top: 8px;
  }
`;

const ProfileCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const DetailRow = styled.div`
  display: flex;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }

  strong {
    font-size: 1rem;
    color: var(--color-accent-orange, #FE9C7F);
    width: 120px;
    flex-shrink: 0;
    text-transform: uppercase;
    font-weight: 600;
  }

  span {
    font-size: 1.1rem;
    color: var(--color-text-light);
    word-break: break-all;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inria Serif', serif;
  font-size: 2rem;
  color: var(--color-secondary-peach);
  margin-top: 48px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary-purple);
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const ActionCard = styled(Link)`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  min-height: 250px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    transition: background 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    &::before {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  h3 {
    position: relative;
    color: white;
    font-size: 1.75rem;
    font-family: 'Inria Serif', serif;
    text-align: center;
    padding: 0 16px;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 48px auto 0;
  flex-wrap: wrap;
  gap: 20px;
`;

const LogoutButton = styled.button`
  flex-grow: 1;
  max-width: 280px;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #FFFFFF;
  background-color: var(--color-accent-orange);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #E87A5E;
    transform: scale(1.02);
  }
`;

const DeleteButton = styled(LogoutButton)`
  background-color: transparent;
  border: 2px solid var(--color-error-red, #D32F2F);
  color: var(--color-error-red, #D32F2F);

  &:hover {
    background-color: var(--color-error-red, #D32F2F);
    color: #FFFFFF;
    transform: scale(1.02);
  }
`;


const UserProfilePage = () => {
  const { currentUser, loading, logout } = useAuth();
  // --- 2. Get clearCart function ---
  const { clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading profile...</p>
      </PageWrapper>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

   const handleLogout = async () => {
    try {
      clearCart(); // Clear the cart first
      await logout(); // Then log the user out
      // Navigation will happen automatically as currentUser becomes null
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDeleteAccount = async () => {
  const token = localStorage.getItem('auth-token');

  // const response = await fetch('http://localhost:4000/deleteaccount', {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteaccount`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account");
  }

  alert("Your account has been successfully deleted.");
  navigate('/'); 

  

  logout();
};


  return (
    <PageWrapper>
      <ProfileContainer>
        <ProfileHeader>
          <h1>Welcome, {currentUser.name}!</h1>
          <p>Manage your account details and orders here.</p>
        </ProfileHeader>

        <ProfileCard>
          <DetailRow>
            <strong>Name</strong>
            <span>{currentUser.name}</span>
          </DetailRow>
          <DetailRow>
            <strong>Email</strong>
            <span>{currentUser.email}</span>
          </DetailRow>
          <DetailRow>
            <strong>Role</strong>
            <span>{currentUser.role}</span>
          </DetailRow>
        </ProfileCard>

        <SectionTitle>Quick Actions</SectionTitle>
        <ActionGrid>
          <ActionCard to="/products/category/Skimboards" bgImage={'/Banana.jpeg'}>
            <h3>SKIMBOARDS</h3>
          </ActionCard>
          <ActionCard to="/design-skimboard" bgImage={'/aizat2.jpeg'}>
            <h3>CUSTOMISE YOUR BOARD</h3>
          </ActionCard>
        </ActionGrid>

        <ActionButtonsContainer>
          <LogoutButton onClick={handleLogout}>
            Log Out
          </LogoutButton>
          <DeleteButton onClick={handleDeleteAccount}>
            Delete Account
          </DeleteButton>
        </ActionButtonsContainer>

      </ProfileContainer>
    </PageWrapper>
  );
};

export default UserProfilePage;