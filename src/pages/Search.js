import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard'; 
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import '../index.css';

const Wrapper = styled.div`
padding: 2rem;
background: linear-gradient(135deg, #101010 0%, #670097 100%);
height: 100%;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  height: 50px;
  max-width: 500px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  justify-content: center;
  display: block;
  margin: 0 auto 1rem auto;
`;

const ProductGrid = styled.div`
  display: grid;
  margin-top: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-l, 24px);
  max-width: 1200px;
  margin: 0 auto;
`;


const Search =() => {
  const [products, setProducts] = useState([]);
  const [ setIsLoading] = useState(true);
  const [searchParams, setSearchQuery] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await fetch('http://localhost:4000/allproducts');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/allproducts`)
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  });

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Wrapper>
      <h2 id='searchHeader'>Search Results for "{query}"</h2>
      <SearchInput
        type="search"
        placeholder="Search by name"
        value={query}
        onChange={e => {
          const newQuery = e.target.value;
          setSearchQuery({ q: newQuery }); //
        }}
      />
      {query && filteredProducts.length === 0 && (
        <p style={{color: 'white', textAlign:'center', marginTop: '30px'}}>No products found matching "{query}".</p>
      )}
      <ProductGrid>
        {filteredProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductGrid>
    </Wrapper>
  );
};

export default Search;