
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth } from '../contexts/AuthContext';


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

const OrderTable = styled.table`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 12px;
  }

  th {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;





const OrdersPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [setError] = useState(null);

  const fetchInfo = async () => {
      try {
        // const res = await fetch('http://localhost:4000/orders');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/orders`);
        const data = await res.json();
        setOrders(data);
  
      } catch (err) {
        setError('Failed to fetch products.');
      }
    };
  
    useEffect(() => {
      fetchInfo();
    });
  

  return (
    <PageWrapper>
      <ProfileContainer>
        <ProfileHeader>
          {currentUser.role === 'Admin' ? <h1>Orders</h1>:''}
          {currentUser.role === 'Customer' ? <h1>My Orders</h1>:''}
        </ProfileHeader>

        {currentUser.role === 'Admin' ? (
          <OrderTable>
          <thead>
            <tr style={{fontSize:'20px'}}>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Payment Method</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
                    <tr onClick={() => navigate(`/orders/${order._id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{color:'#f88366ff', fontWeight:'bold'}}>{order._id}</td>
                      <td>{order.name}</td>
                      <td>{order.payMethod}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
          </tbody>
        </OrderTable>
        ) : ''}

        {currentUser.role === 'Customer' ? (
          <OrderTable>
            <thead>
              <tr style={{fontSize:'20px'}}>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
              .filter(order => order.userId === currentUser.id).map((order) => (
              <tr
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              style={{ cursor: 'pointer' }}>
                <td style={{ color: '#f88366ff', fontWeight: 'bold' }}>{order._id}</td>
                <td>{order.name}</td>
                <td>{order.payMethod}</td>
                <td>{order.status}</td>
              </tr>
              ))}
            </tbody>
          </OrderTable>
        ) : ''}
      </ProfileContainer>
    </PageWrapper>
  );
};

export default OrdersPage;