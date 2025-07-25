
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import '../index.css';


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
  margin-bottom: 25px;
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

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [ setError] = useState(null);

  const fetchInfo = async () => {
  try {
    const token = localStorage.getItem('auth-token');

    // const res = await fetch('http://localhost:4000/users', {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users`,{
      headers: {
        'auth-token': token,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error(err);
    setError('Failed to fetch users.');
  }
};

useEffect(() => {
  fetchInfo();
});

  return (
    <PageWrapper>
      
      <ProfileContainer>
        <ProfileHeader>
          <h1>Users</h1>
        </ProfileHeader>

        {users.map((user) => (
                    <ProfileCard>
                      <DetailRow>
                        <strong>Name</strong>
                        <span>{user.name}</span>
                      </DetailRow>
                      <DetailRow>
                        <strong>Email</strong>
                        <span>{user.email}</span>
                      </DetailRow>
                      <DetailRow>
                        <strong>Role</strong>
                        <span>{user.role}</span>
                      </DetailRow>
                      <DetailRow>
                        <strong>Date Created</strong>
                        <span>{new Date(user.date).toLocaleDateString('en-GB')}</span>
                      </DetailRow>
                    </ProfileCard>
                  ))}


      </ProfileContainer>
    </PageWrapper>
  );
};
export default UsersList;