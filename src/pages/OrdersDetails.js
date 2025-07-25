
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';


const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--gradient-products);
  color: var(--color-text-light, #FFFFFF);
  padding: 48px 24px;
  font-family: 'Instrument Sans', sans-serif;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-light, #FFFFFF);
  font-size: var(--font-size-xlarge, 24px); /* Larger icon */
  cursor: pointer;
  margin-bottom: var(--spacing-m, 16px);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--color-secondary-peach, #FFDAB9);
  }
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



const SubmitButton = styled.button`
  background-color: var(--color-secondary-peach);
  color: #181824;
  padding: 10px; border: none; border-radius: 8px;
  font-size: 1.1rem; font-weight: bold; cursor: pointer;
  margin-top: 20px; /* Added more margin-top */
  transition: background-color 0.2s ease, transform 0.1s ease;
  &:hover { background-color: var(--color-secondary-peach-dark); transform: translateY(-2px); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

const CancelOrderButton = styled.button`
  background-color: var(--color-error-red, #D32F2F);
  color: white;
  &:hover { background-color: #B71C1C; transform: translateY(-2px); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
  padding: 14px; border: none; border-radius: 8px;
  font-size: 1.1rem; font-weight: bold; cursor: pointer;
  margin-top: 20px; /* Added more margin-top */
  transition: background-color 0.2s ease, transform 0.1s ease;
`;



const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('')

  const fetchInfo = async () => {
    try {
      // const res = await fetch(`http://localhost:4000/orders/${id}`);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError('Failed to fetch order.');
    }
  };

  useEffect(() => {
    fetchInfo();
  });

  useEffect(() => {
  if (order) {
    setStatus(order.status);
  }
}, [order]);

  if (error) return <div>{error}</div>;
  if (!order) return <div>Loading...</div>;

  const handleStatusChange = (e) => {
  setStatus(e.target.value);
};

async function updateStatus(id, data) {
        // const res = await fetch(`http://localhost:4000/updatestatus/${id}`, {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/updatestatus/${id}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Failed to update order status');
  }
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await updateStatus(id, {
      status: currentUser.role === 'Customer' ? 'Order Completed' : status,
    });
    alert('Order is complete!');
  } catch (err) {
    setError(err.message || 'Failed to update status.');
  }
  navigate(`/orders`);
  window.scrollTo(0, 0);
};

const cancelOrder = async (e) => {
  e.preventDefault();
  setError('');

  const confirmed = window.confirm('Are you sure you want to cancel your order?');
  if (!confirmed) return;

  try {
    await updateStatus(id, {
      status: 'Order Cancelled',
    });
    alert('Order cancelled successfully.');
  } catch (err) {
    setError(err.message || 'Failed to cancel order.');
  }
  navigate(`/orders`);
  window.scrollTo(0, 0);
};


  return (
    <PageWrapper>
      
      <ProfileContainer>
        <BackButton onClick={() => navigate('/orders')}>
         <FaArrowLeft />
        </BackButton>
        <ProfileHeader>
          <h1>Order Details</h1>
        </ProfileHeader>

        <ProfileCard>
          <DetailRow>
            <strong>Order ID</strong>
            <span>{order._id}</span>
          </DetailRow>
          <DetailRow>
            <strong>Order Date</strong>
            <span>{new Date(order.date).toLocaleDateString('en-GB')}</span>
          </DetailRow>
          <DetailRow>
            <strong>Customer</strong>
            <span>{order.name}</span>
          </DetailRow>
          <DetailRow>
            <strong>Payment Method</strong>
            <span>{order.payMethod}</span>
          </DetailRow>
          <DetailRow>
            <strong>Country</strong>
            <span>{order.country}</span>
          </DetailRow>
          <DetailRow>
            <strong>Address</strong>
            <span>{order.addressL1}, {order.city}, {order.stateProv}</span>
          </DetailRow>
          <DetailRow>
            <strong>Status</strong>
            <span>{order.status}</span>
          </DetailRow>
        </ProfileCard>

        <ProfileHeader style={{marginBottom:'10px'}}>
          <h1 style={{fontSize:'40px'}}>Item List</h1>
        </ProfileHeader>

        <OrderTable>
          <thead>
            <tr style={{fontSize:'20px'}}>
              <th>Product ID</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
                    <tr>
                      <td>{item.productId}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <img src={item.image} alt={item.name}  style={{ height: '50px', display: 'block', margin: '0 auto' }}/>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                  <tr>
                      <td className="no-border"></td>
                      <td className="no-border"></td>
                      <td className="no-border"></td>
                      <td className="no-border"></td>
                      <td style={{fontWeight:'bold'}}>${order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</td>
                    </tr>
          </tbody>
        </OrderTable>
        
        {currentUser.role === 'Admin' ? (
          <ProfileCard>
            <form onSubmit={handleSubmit}>
              <DetailRow style={{ justifyContent:'space-between'}}>
                <label for="selectStatus" style={{fontSize: '20px', fontWeight:'bold'}}>Order Status:</label>
                <select
                id="selectStatus"
                name="selectStatus"
                value={status}
                onChange={handleStatusChange}
                style={{ width: '300px' }}
              >
                <option value={order.status} disabled>{order.status}</option>
                {["Order Cancelled", "Processing", "Out for Delivery", "Delivered"]
                .filter(s => s !== order.status)
                .map((s) => (
                   <option key={s} value={s}>{s}</option>
                 ))}
              </select>
              </DetailRow>
              <DetailRow style={{justifyContent: 'flex-end'}}>
                <SubmitButton type="submit" disabled={status === order.status}>
                  Update Status
                </SubmitButton>
              </DetailRow>
            </form>
        </ProfileCard>
        ) : ''}

        {currentUser.role === 'Customer' ? (
          <ProfileCard >
            <form style={{display:'flex', justifyContent:'space-between'}}>
              <CancelOrderButton
              type="button"
              onClick={cancelOrder}
              disabled={
                order.status === 'Processing' ||
                order.status === 'Out for Delivery' ||
                order.status === 'Delivered' ||
                order.status === 'Order Completed' ||
                order.status === 'Order Cancelled'
              }
              >
                Cancel Order
              </CancelOrderButton>
              <SubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={order.status !== 'Delivered'}
              >
                Order Received
              </SubmitButton>
          </form>
        </ProfileCard>
        ) : ''}
      </ProfileContainer>
    </PageWrapper>
  );
};
export default OrderDetails;