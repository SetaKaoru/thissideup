
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import '../index.css';


const CardWrapper = styled(Link)`
  background-color: var(--color-background-dark-lighter, #2C2C2C); /* Example dark theme */
  color: var(--color-text-light, #FFFFFF);
  border-radius: var(--border-radius, 8px);
  padding: var(--spacing-m, 16px);
  text-decoration: none;
  display: flex;
  max-width: 250px;
  flex:1;
  flex-direction: column;
  gap: var(--spacing-s, 8px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 200px; 
  object-fit: cover;
  border-radius: calc(var(--border-radius, 8px) / 2);
  background-color: var(--color-neutral-gray, #BDBDBD); /* Placeholder for missing images */
`;

const ProductName = styled.h3`
  font-size: var(--font-size-medium, 22px);
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.3;
  min-height: 2.6em; /* Approx 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  font-size: var(--font-size-large, 20px);
  font-weight: bold;
  color: var(--color-secondary-peach, #FFDAB9); /* Example price color */
  margin: 0;
`;

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  return (
    <CardWrapper to={`/product/${product.id}`}>
      <ProductImage src={product.image || '/images/placeholder-product.png'} alt={product.name} />
      <ProductName id='fontProduct'>{product.name}</ProductName>
      <ProductPrice id='fontProduct'>${product.price ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
    </CardWrapper>
  );
};

export default ProductCard;