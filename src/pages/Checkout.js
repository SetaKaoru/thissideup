// File: src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { countries } from '../DataPack/CountryData';
import { useAuth } from '../contexts/AuthContext';
// --- MODIFIED: Import createOrderAPI instead of the old saveOrderAPI ---

import '../index.css'; // Import the CSS file

// --- SHIPPING CATEGORIES & COSTS (Unchanged) ---
const shippingCostsByCountryCode = {
  "SG": 0.99, "MY": 0.99, "TH": 0.99, "VN": 0.99, "KH": 0.99, "LA": 0.99,
  "ID": 1.99, "PH": 1.99, "BN": 1.99,
  "AU": 2.99, "NZ": 2.99, "CN": 2.99, "HK": 2.99, "JP": 2.99, "KR": 2.99, "TW": 2.99, "IN": 2.99,
  "US": 4.99, "CA": 4.99, "GB": 4.99, "DE": 4.99, "FR": 4.99, "IT": 4.99, "ES": 4.99, "NL": 4.99, "CH": 4.99,
  "IE": 9.99, "SE": 9.99, "NO": 9.99, "DK": 9.99, "FI": 9.99, "PT": 9.99, "AT": 9.99, "BE": 9.99, "GR": 9.99, "PL": 9.99, "RU": 9.99, "AE": 9.99, "SA": 9.99, "ZA": 9.99, "BR": 9.99, "AR": 9.99, "MX": 9.99,
  "DEFAULT": 10.99
};

const getShippingCostForCountry = (countryCode) => {
  return shippingCostsByCountryCode[countryCode] || shippingCostsByCountryCode["DEFAULT"];
};

// --- STYLED COMPONENTS (Unchanged) ---
const PageWrapper = styled.div`
  min-height: 100vh; font-family: "Instrument Sans", sans-serif; padding: 24px 0; background: linear-gradient(180deg, #000000 0%, #7600AD 100%);
`;
const CheckoutTitle = styled.h1`
  font-family: var(--font-serif, 'Inria Serif', serif); color: #fff; text-shadow: 0 2px 8px #181824, 0 1px 0 #C86B98; text-align: center; margin-bottom: 32px;
`;
const Section = styled.section`
  background-color: #000; padding: 24px; margin: 0 auto 24px auto; max-width: 800px; border-radius: 24px; box-shadow: 0 4px 15px rgba(93, 63, 211, 0.12); color: #f5f6fa; font-family: "Instrument Sans", sans-serif;
`;
const SectionTitle = styled.h2`
  font-family: var(--font-serif, 'Inria Serif', serif); font-size: clamp(1.25rem, 4vw, 1.5rem); font-weight: 600; margin-bottom: var(--spacing-m, 16px); color: #C86B98;
`;
const AddressForm = styled.div`
  display: flex; flex-direction: column; gap: var(--spacing-m, 16px);
`;
const FormRow = styled.div`
  display: flex; flex-direction: column; gap: var(--spacing-xs, 4px);
`;
const FormLabel = styled.label`
  font-size: var(--font-size-small, 14px); color: #C86B98; font-weight: 500;
`;
const FormControlBase = styled.select` 
  width: 100%; padding: var(--spacing-s, 10px); font-size: var(--font-size-medium, 16px); border-radius: var(--border-radius-s, 4px); border: 1px solid #35354d; background-color: #181824; color: #fff; box-sizing: border-box; transition: border-color 0.2s ease, background-color 0.2s ease; appearance: none; margin-top: 10px;
  &::placeholder { color: #808080; opacity: 1; }
  &:focus { outline: none; border-color: #C86B98; background-color: #181824; }
`;
const FormInput = styled(FormControlBase).attrs({ as: 'input' })``; 
const FormSelect = styled(FormControlBase).attrs({ as: 'select' })`
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23C86B98%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat; background-position: right .7em top 50%; background-size: .65em auto; padding-right: 2.5em; margin-bottom: 40px;
  option { background-color: #181824; color: #f5f6fa; }
`;
const ProductTable = styled.table`
  width: 100%; border-collapse: collapse; margin-bottom: var(--spacing-m, 16px);
  th, td { text-align: left; padding: var(--spacing-s, 8px) var(--spacing-xs, 4px); border-bottom: 1px solid #35354d; }
  th { font-size: clamp(0.75rem, 2vw, 0.875rem); color: #C86B98; font-weight: 500; }
  td { font-size: clamp(0.8rem, 2.2vw, 0.95rem); color: #f5f6fa; }
  .product-name { display: flex; align-items: center; gap: var(--spacing-s, 8px); }
  .product-image { width: 35px; height: 35px; object-fit: cover; border-radius: var(--border-radius-s, 4px); background-color: #35354d; @media (max-width: 480px) { width: 30px; height: 30px; } }
  .product-name-text { max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; @media (min-width: 768px) { max-width: 250px; } }
  .unit-price, .quantity, .total-price { text-align: right; }
  .quantity { text-align: center; }
`;
const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-s, 10px) 0; font-size: clamp(0.9rem, 2.5vw, 1.1rem); font-weight: 500;
  &:not(:last-child) { border-bottom: 1px solid #35354d; }
  &.order-total { font-weight: bold; font-size: clamp(1rem, 3vw, 1.25rem); color: #C86B98; margin-top: var(--spacing-s, 8px); }
`;

const PaymentButton = styled.button`
  flex-grow: 1; padding: var(--spacing-s, 10px); border-radius: var(--border-radius-m, 8px); font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; border: 2px solid transparent;
  background-color: ${props => props.active ? '#C86B98' : '#181824'}; color: ${props => props.active ? '#181824' : '#C86B98'}; border-color: ${props => props.active ? '#fff' : '#35354d'};
  &:hover:not(:disabled) { border-color: #C86B98; background-color: #35354d; color: #fff; }
`;
const FinalSummary = styled.div`
  padding-top: var(--spacing-m, 16px); margin-top: var(--spacing-m, 16px); border-top: 1px solid #35354d;
  .total-payment { font-size: clamp(1.1rem, 3.5vw, 1.4rem); font-weight: bold; color: #C86B98; }
`;
const PlaceOrderButton = styled.button`
  display: block; width: 100%; max-width: 300px; margin: var(--spacing-l, 24px) auto 0 auto; background-color: #C86B98; color: #181824; padding: var(--spacing-m, 12px); border: none; border-radius: var(--border-radius-m, 8px); font-size: clamp(1rem, 3vw, 1.125rem); font-weight: bold; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease;
  &:hover { background-color: #fff; color: #181824; transform: translateY(-2px); }
  &:active { transform: translateY(0px); }
  &:disabled { background-color: #35354d; color: #bdbdd7; cursor: not-allowed; }
  @media (min-width: 768px) { margin-top: var(--spacing-xl, 32px); }
`;
const PaymentMethodSelector = styled.div`
  display: flex; flex-direction: column; gap: var(--spacing-s, 8px); margin-top: var(--spacing-s, 8px);
  @media (min-width: 600px) { flex-direction: row; gap: var(--spacing-m, 16px); }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();


  
  const itemsFromState = location.state?.itemsForCheckout || [];
  const selectedItems = itemsFromState.length > 0 ? itemsFromState : cartItems.filter(item => item.selected);
  const totalFromCart = location.state?.total || selectedItems.reduce((acc, item) => {
    const itemPrice = item.customDesign?.price || item.product?.price || 0;
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);

  const [addressL1, setAddressL1] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState(''); 
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('SG'); // Default country
  const [shippingCost, setShippingCost] = useState(getShippingCostForCountry('SG'));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PayNow');
  const [isPlacingOrder] = useState(false);

  useEffect(() => {
    if (selectedItems.length === 0 && !isPlacingOrder) {
        navigate('/shoppingCart');
    }
  }, [selectedItems, navigate, isPlacingOrder]);

  useEffect(() => {
    setShippingCost(getShippingCostForCountry(country));
  }, [country]);

  const itemSubtotal = totalFromCart;
  const orderTotal = itemSubtotal + shippingCost;
  const totalPayment = orderTotal;


  const handlePlaceOrder = async () => {
  try {
    const orderItems = selectedItems.map(item => {
      const productData = item.customDesign || item.product;
      if (!productData) return null;
      return {
        productId: productData.id,
        name: productData.name,
        image: productData.image,
        price: productData.price,
        quantity: item.quantity,
      };
    }).filter(Boolean);

    const orderData = {
      items: orderItems,
      amount: totalPayment,
      addressL1: addressL1,
      country,
      city,
      stateProv,
      postalCode,
      payMethod: selectedPaymentMethod
    };

    // const res = await fetch('http://localhost:4000/placeorder', {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/placeorder`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.success) {
      clearCart();
      alert("Order placed successfully!");
      navigate('/');
    } else {
      alert("Failed to place order. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while placing your order.");
  }
  console.log('Current user token:', currentUser?.token);
};

  const currentCartItems = selectedItems; 

  if (currentCartItems.length === 0 && !isPlacingOrder) {
    return (
        <PageWrapper>
            <CheckoutTitle>Checkout</CheckoutTitle>
            <Section style={{ textAlign: 'center' }}>
                <p>Your cart is empty or no items selected. Add some items to proceed to checkout.</p>
                <PlaceOrderButton style={{maxWidth: '200px', marginTop: '20px'}} onClick={() => navigate('/products')}>Shop Now</PlaceOrderButton>
            </Section>
        </PageWrapper>
    );
  }

  return (
      <PageWrapper>
        <CheckoutTitle>Checkout</CheckoutTitle>

        <Section>
          
          <AddressForm>
            <SectionTitle style={{marginBottom:'0px'}}>Name:</SectionTitle>
            <div style={{color: '#ffffffff', fontSize:'20px'}}>{currentUser.name}</div>
            <SectionTitle>Delivery Address</SectionTitle> 
            <FormRow>
              <FormLabel htmlFor="addressLine1">Address Line 1*</FormLabel>
              <FormInput type="text" id="addressL1" value={addressL1} onChange={(e) => setAddressL1(e.target.value)} placeholder="Street address, P.O. box" required />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="country">Country*</FormLabel>
              <FormSelect id="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                <option value="" disabled>Select your country</option>
                {countries.map((c) => (<option key={c.code} value={c.code}>{c.name}</option>))}
              </FormSelect>
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="city">City*</FormLabel>
              <FormInput type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Singapore" required />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="stateProv">State / Province</FormLabel>
              <FormInput type="text" id="stateProv" value={stateProv} onChange={(e) => setStateProv(e.target.value)} placeholder="e.g., CA (Optional)" />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="postalCode">Postal Code*</FormLabel>
              <FormInput type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g., 123456" required />
            </FormRow>
          </AddressForm>
        </Section>

        <Section>
          <SectionTitle>Products Ordered</SectionTitle>
          <ProductTable>
            <thead>
              <tr>
                <th>Product</th>
                <th className="unit-price">Unit Price</th>
                <th className="quantity">Quantity</th>
                <th className="total-price">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCartItems.map(item => {
                if (!item) return null;
                const productDetails = item.customDesign || item.product;
                if (!productDetails) return null;
                const itemPrice = typeof productDetails.price === 'number' ? productDetails.price : 0;
                const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
                const itemId = productDetails._id || item._id;
                return (
                  <tr key={itemId || `temp-${Math.random() * 10000}`}>
                    <td className="product-name">
                      <img src={productDetails.image || '/images/placeholder-product.png'} alt={productDetails.name || 'Product'} className="product-image" />
                      <span className="product-name-text">{productDetails.name || 'Unnamed Product'}</span>
                    </td>
                    <td className="unit-price">${itemPrice.toFixed(2)}</td>
                    <td className="quantity">{quantity}</td>
                    <td className="total-price">${(itemPrice * quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </ProductTable>
          <SummaryRow>
            <span>Item Subtotal:</span>
            <span>${itemSubtotal.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping Option:</span>
            <span>Doorstep Delivery ${shippingCost.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow className="order-total">
            <span>Order Total:</span>
            <span>${orderTotal.toFixed(2)}</span>
          </SummaryRow>
        </Section>

        {/* <Section>
          <SummaryRow>
            <SectionTitle style={{ marginBottom: 0 }}>Vouchers</SectionTitle>
            <SelectVoucherButton onClick={() => alert('Voucher selection UI to be implemented.')}>Select Voucher</SelectVoucherButton>
          </SummaryRow>
        </Section> */}

        <Section>
          <SectionTitle>Payment Method</SectionTitle>
          <PaymentMethodSelector>
            <PaymentButton active={selectedPaymentMethod === 'PayNow'} onClick={() => setSelectedPaymentMethod('PayNow')}>PayNow</PaymentButton>
            <PaymentButton active={selectedPaymentMethod === 'Card'} onClick={() => setSelectedPaymentMethod('Card')}>Credit Card/Debit Card</PaymentButton>
          </PaymentMethodSelector>
        </Section>

        <Section>
          <FinalSummary>
            <SummaryRow>
              <span>Item Subtotal</span>
              <span>${itemSubtotal.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping Subtotal</span>
              <span>${shippingCost.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow className="total-payment">
              <span>Total Payment</span>
              <span>${totalPayment.toFixed(2)}</span>
            </SummaryRow>
          </FinalSummary>
          <PlaceOrderButton onClick={handlePlaceOrder} disabled={isPlacingOrder || currentCartItems.length === 0}>
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </PlaceOrderButton>
        </Section>
      </PageWrapper>
  );
};

export default CheckoutPage;