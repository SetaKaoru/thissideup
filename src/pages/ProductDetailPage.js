
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import ProductCard from './ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';



const PageWrapper = styled.div`
  background-color: var(--color-background-dark, #121212); /* Very dark background */
  color: var(--color-text-light, #FFFFFF);
  min-height: 100vh;
  padding: var(--spacing-m, 16px) var(--spacing-l, 24px) var(--spacing-xl, 32px);
  font-family: var(--font-body, 'instrument sans', sans-serif);
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

// ... (The rest of the styled components are unchanged)
const ProductContentWrapper = styled.div`
  background-color: var(--color-primary-purple, #5D3FD3); /* Purple background */
  padding: var(--spacing-xl, 32px);
  border-radius: var(--border-radius-l, 12px);
  display: flex;
  gap: var(--spacing-xl, 32px);
  margin-bottom: var(--spacing-xxl, 48px);

  @media (max-width: 768px) { // Responsive: stacks columns on smaller screens
    flex-direction: column;
    padding: var(--spacing-l, 24px);
  }
`;

const ImageColumn = styled.div`
  flex: 0 0 40%; /* Takes up 40% of the width, doesn't grow or shrink excessively */
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    flex: 1; /* Takes full width when stacked */
  }
`;

const MainProductImage = styled.img`
  width: 100%;
  max-width: 350px; /* Max width for the image */
  height: auto;
  object-fit: contain;
  background-color: white; /* Background for the image container itself */
  border-radius: var(--border-radius-m, 8px);
  margin-bottom: var(--spacing-l, 24px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const SocialActions = styled.div`
  display: flex;
  justify-content: space-around; /* Spreads out Share and Likes */
  width: 100%;
  max-width: 350px;
  margin-top: var(--spacing-m, 16px);
`;

const BaseSocialButton = styled.button`
  background-color: var(--color-secondary-peach, #FFDAB9);
  color: var(--color-primary-purple-dark, #4B0082); /* Dark text for contrast */
  border: none;
  border-radius: var(--border-radius-m, 8px);
  padding: var(--spacing-s, 10px) var(--spacing-m, 16px);
  font-size: var(--font-size-medium, 16px);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
  transition: background-color 0.2s ease, color 0.2s ease; /* Added color transition */

  &:hover {
    background-color: var(--color-secondary-peach-dark, #FFA07A);
  }

  svg {
    font-size: var(--font-size-large, 18px);
    transition: color 0.2s ease; /* For smooth color change on icon */
  }
`;

const DetailsColumn = styled.div`
  flex: 1; /* Takes remaining space */
  color: var(--color-text-light, #FFFFFF);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s, 10px); /* Spacing between detail items */
`;

const ProductName = styled.h1`
  color: var(--color-text-light, #FFFFFF);
  font-size: var(--font-size-xxlarge, 28px);
  font-weight: bold;
  margin-bottom: var(--spacing-xs, 4px);
  font-family: var(--font-heading, 'Georgia', serif);
`;

const ProductPrice = styled.p`
  font-size: var(--font-size-xlarge, 22px);
  color: var(--color-secondary-peach, #FFDAB9); /* Peach color for price */
  font-weight: 600;
  margin-bottom: var(--spacing-s, 8px);
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
  margin-bottom: var(--spacing-m, 16px);
  font-size: var(--font-size-medium, 16px);

  svg {
    color: #FFD700; /* Gold color for stars */
  }
`;

const ProductDescription = styled.p`
  font-size: var(--font-size-small, 14px);
  line-height: 1.6;
  color: var(--color-neutral-gray-light, #E0E0E0); /* Lighter text for description */
  margin-bottom: var(--spacing-m, 16px);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start; /* Align items to the start if text wraps */
  gap: var(--spacing-m, 16px);
  margin-bottom: var(--spacing-s, 10px);
  font-size: var(--font-size-medium, 16px);
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-text-light, #FFFFFF);
  min-width: 130px; /* Ensures alignment */
`;

const InfoValue = styled.span`
  color: var(--color-neutral-gray-light, #E0E0E0);
  .highlight { /* For highlighting parts like shipping fee */
    color: var(--color-secondary-peach, #FFDAB9);
    font-weight: 600;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-s, 12px);
  margin: var(--spacing-m, 16px) 0;
`;

const QuantityButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-text-light, #FFFFFF);
  border: none;
  border-radius: var(--border-radius-s, 4px);
  width: 30px;
  height: 30px;
  font-size: var(--font-size-large, 18px);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
    & svg {
    color: #fff;
    font-size: 18px;
  }
`;

const QuantityDisplay = styled.span`
  font-size: var(--font-size-large, 18px);
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: var(--spacing-m, 16px);
  margin-top: var(--spacing-l, 24px);

  @media (max-width: 480px) { // Stacks buttons on very small screens
    flex-direction: column;
  }
`;

const BaseActionButton = styled.button`
  flex-grow: 1; /* Buttons share space equally */
  padding: var(--spacing-m, 14px);
  border: none;
  border-radius: var(--border-radius-m, 8px);
  font-size: var(--font-size-medium, 16px);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-s, 8px);

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled(BaseActionButton)`
  background-color: var(--color-error-red, #D32F2F);
  color: white;

  &:hover { background-color: #B71C1C; transform: translateY(-2px); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

const AddToCartButton = styled(BaseActionButton)`
  background-color: var(--color-primary-purple-dark, #4B0082); /* Darker purple */
  color: var(--color-text-light, #FFFFFF);

  &:hover {
    background-color: var(--color-primary-purple-darker, #3A006A); /* Even darker on hover */
  }
`;

const BuyNowButton = styled(BaseActionButton)`
  background-color: var(--color-neutral-gray-light, #E0E0E0);
  color: var(--color-primary-purple-dark, #4B0082); /* Dark text for contrast */

  &:hover {
    background-color: var(--color-neutral-gray, #BDBDBD);
  }
`;

const SimilarProductsSection = styled.section`
  margin-top: var(--spacing-xxl, 48px);
  padding: var(--spacing-l, 24px) 0; /* Padding only top/bottom */
`;

const SimilarProductsTitle = styled.h2`
  font-size: var(--font-size-xlarge, 24px);
  font-weight: 600;
  margin-bottom: var(--spacing-l, 24px);
  color: var(--color-text-light, #FFFFFF);
  font-family: var(--font-heading, 'Georgia', serif);
`;

const SimilarProductsGrid = styled.div`
  display: flex;
  justify-content: start;
  gap: 8px;
  overflow-x: auto; /* Enables horizontal scrolling */
  padding-bottom: var(--spacing-m, 16px); /* Space for scrollbar if needed */

  /* Hide scrollbar for a cleaner look, but still scrollable */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const SoldOutMessage = styled.div`
    color: var(--color-error-red, #ff6b6b);
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    padding: 1rem;
    background-color: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-top: 1rem;
`;

// --- REACT COMPONENT ---

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const { filteredProducts, loading: contextLoading, error: contextError } = useProducts();
  const { currentUser } = useAuth();
  const [selectedSize, setSelectedSize] = useState('M');

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  const [displayLikes, setDisplayLikes] = useState(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // const res = await fetch(`http://localhost:4000/products/${id}`);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
        const data = await res.json();
        
        if (data) {
          setProduct(data);

          setDisplayLikes(data.likes !== undefined ? data.likes : 0);


          if (currentUser && data.id) {
            const likedStatus = localStorage.getItem(`liked_${currentUser.id}_${data.id}`);
            if (likedStatus === 'true') {
              setIsLikedByCurrentUser(true);
            } else {
              setIsLikedByCurrentUser(false); 
            }
          } else {
            setIsLikedByCurrentUser(false); 
          }
          
          // const allRes = await fetch('http://localhost:4000/allproducts');
          const allRes = await fetch(`${process.env.REACT_APP_API_URL}/allproducts`);
          const allProducts = await allRes.json();

          if (Array.isArray(allProducts) && allProducts.length > 0) {
            const related = allProducts
              .filter(p => p.category === data.category && p.id !== data.id)
              .slice(0, 5);
            setSimilarProducts(related);
        } else {
          setSimilarProducts([]);
        }
        } else {
          setError(`Product with ID ${id} not found.`);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "An error occurred while fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id, filteredProducts, currentUser]);

  const handleIncrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };



const handleAddToCart = async () => {
  if (product) {
    try {
      const token = localStorage.getItem('auth-token');
      
      // const res = await fetch('http://localhost:4000/addtocart', {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addtocart`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ itemId: product.id, quantity, size: selectedSize, })
      });

      const data = await res.text();

      if (res.ok) {
        setCartMessage(`${quantity} of ${product.name} added to cart`);
        setTimeout(() => setCartMessage(''), 3000);
      } else {
        setCartMessage(`Error: ${data}`);
        setTimeout(() => setCartMessage(''), 3000);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      setCartMessage('Error: Failed to add item to cart.');
      setTimeout(() => setCartMessage(''), 3000);
    }
  }
};

  const handleBuyNow = () => {
    if (product) {
      if (cart?.addItemToCart) {
        cart.addItemToCart(product.id, quantity);
        navigate('/checkout');
      } else {
        setCartMessage('Cart functionality is currently unavailable');
        setTimeout(() => setCartMessage(''), 3000);
      }
    }
  };

  

  const handleLike = async () => {
    if (!currentUser) {
      setCartMessage("Please log in to like products");
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }
    if (!product || !product.id) {
      console.error("Product data or ID is missing for like action");
      setCartMessage("Cannot like product at this time");
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }
    const localStorageKey = `liked_${currentUser.id}_${product.id}`;

  if (isLikedByCurrentUser) {

    setDisplayLikes(prevLikes => Math.max(0, prevLikes - 1));
    setIsLikedByCurrentUser(false);
    localStorage.removeItem(localStorageKey);
  } else {
    try {
      // const res = await fetch(`http://localhost:4000/products/${product.id}/like`, {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/${product.id}/like`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setDisplayLikes(updatedProduct.likes);
        setIsLikedByCurrentUser(true);
        localStorage.setItem(localStorageKey, 'true');
      } else {
        throw new Error('Failed to like product');
      }
    } catch (err) {
      console.error("Error liking product:", err);
      setCartMessage("Error liking product");
    }
  }
    setTimeout(() => setCartMessage(''), 2000);
  };

  const handleShare = () => {
    if (product && navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => setCartMessage('Product shared!'))
      .catch((error) => {
          console.log('Error sharing:', error);
          setCartMessage('Could not share product.');
      });
    } else if (product) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => setCartMessage('Link copied to clipboard!'))
        .catch(() => setCartMessage('Could not copy link.'));
    } else {
        setCartMessage('Product data not available for sharing.');
    }
    setTimeout(() => setCartMessage(''), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return null;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={`star-${i}`}
          style={{ opacity: i < Math.round(numRating) ? 1 : 0.3 }}
        />
      );
    }
    return stars;
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };


  if (loading || contextLoading) {
    return <PageWrapper><p>Loading product details...</p></PageWrapper>;
  }

  if (error || contextError) {
    return <PageWrapper><p>Error: {error || contextError}</p></PageWrapper>;
  }

  if (!product) {
    return <PageWrapper><p>Product not found.</p></PageWrapper>;
  }

  const highlightedShippingInfo = product.shippingInfo?.replace(
    /\$(\d+\.\d{2})/g,
    '<span class="highlight">$$$1</span>'
  ) || 'Standard shipping available';

  const handleDelete = async () => {
  if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
    setError('');
    try {
      // const res = await fetch('http://localhost:4000/deleteproduct', {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/deleteproduct`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Product deleted successfully!');
        navigate('/products');
      } else {
        setError('Failed to delete product.');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    }
  }
};


  return (
    <div className="product-detail-page">
      <PageWrapper>
        <BackButton onClick={() => navigate('/products')}>
          <FaArrowLeft />
        </BackButton>

        <ProductContentWrapper>
          <ImageColumn>
            <MainProductImage src={product.image || '/placeholder.png'} alt={product.name} />
            <SocialActions>
              <BaseSocialButton onClick={handleShare}>
                <FaShareAlt /> Share
              </BaseSocialButton>
              <BaseSocialButton
                onClick={handleLike}
                title={isLikedByCurrentUser ? "Unlike this product" : "Like this product"}
                style={{
                  color: isLikedByCurrentUser ? 'var(--color-error-red, #D32F2F)' : 'var(--color-primary-purple-dark, #4B0082)',
                }}
              >
                <FaHeart style={{ color: isLikedByCurrentUser ? 'var(--color-error-red, #D32F2F)' : 'inherit' }} />
                Favorite ({displayLikes})
              </BaseSocialButton>
            </SocialActions>
          </ImageColumn>

          <DetailsColumn>
            <ProductName>{product.name || "Unnamed Product"}</ProductName>
            <ProductPrice>${product.price ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
            <RatingContainer>
              {renderStars(product.rating)}
              <span>{product.numRatings || 0} Ratings</span>
            </RatingContainer>
            <ProductDescription>{product.description}</ProductDescription>
            
            <InfoRow>
              <InfoLabel>Bundle Deals:</InfoLabel>
              <InfoValue>{product.bundleDeals || 'None currently'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Shipping:</InfoLabel>
              <InfoValue dangerouslySetInnerHTML={createMarkup(highlightedShippingInfo)}>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel></InfoLabel>
              <InfoValue>
                <span style={{fontSize: 'var(--font-size-small, 12px)', color: 'var(--color-neutral-gray, #BDBDBD)'}}>
                </span>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Guarantee:</InfoLabel>
              <InfoValue>{product.shoppingGuarantee || 'Standard buyer protection.'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Size:</InfoLabel>
              {(product.category === 'Boardshorts' || product.category === 'T-Shirts' || product.category === 'Jackets') ? 
              <InfoValue>
                <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#000'
                }}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  </select>
                </InfoValue>: ''}
                {product.category === 'Skimboards' ? 
              <InfoValue>
                <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  padding: '6px 10px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#000'
                }}
                >
                  <option value="S">50 inch</option>
                  <option value="M">52 inch</option>
                  <option value="L">54 inch</option>
                  </select>
                </InfoValue>: ''}
            </InfoRow>

            {product.stock > 0 ? (
                <QuantityControl>
                    <InfoLabel>Quantity:</InfoLabel>
                    <QuantityButton onClick={handleDecrementQuantity} disabled={quantity <= 1}>-</QuantityButton>
                    <QuantityDisplay>{quantity}</QuantityDisplay>
                    <QuantityButton onClick={handleIncrementQuantity} disabled={quantity >= product.stock}>+</QuantityButton>
                    <span style={{fontSize: 'var(--font-size-small)', marginLeft: '10px', color: 'var(--color-neutral-gray-light)'}}>
                        {product.stock} left
                    </span>
                </QuantityControl>
            ) : (
                <SoldOutMessage>Product Sold Out</SoldOutMessage>
            )}

            <ActionButtonsContainer>         
              
              {(!currentUser || currentUser.role === 'Customer') && (
                <AddToCartButton onClick={handleAddToCart} disabled={product.stock <= 0}>
                  <FaShoppingCart /> Add to cart
                </AddToCartButton>
              )}
              
              {(!currentUser || currentUser.role === 'Customer') && (
                <BuyNowButton onClick={handleBuyNow} disabled={product.stock <= 0}>
                Buy Now
              </BuyNowButton>
              )}

              {currentUser && currentUser.role === 'Admin' && (
                  <BuyNowButton onClick={() => navigate(`/edit/${product.id}`)}>
                      Edit Product
                  </BuyNowButton>
              )}
              {currentUser && currentUser.role === 'Admin' && (
                <DeleteButton type="button" disabled={loading} onClick={handleDelete}>
                    <FaTrash />
                    {loading ? 'Deleting...' : 'Delete Product'}
                    </DeleteButton>
              )}
            </ActionButtonsContainer>
            
            {cartMessage && (
              <div style={{
                color: 'var(--color-secondary-peach, #FFDAB9)',
                textAlign: 'center',
                marginTop: 'var(--spacing-m, 16px)',
                padding: 'var(--spacing-s, 8px)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--border-radius-s, 4px)'
              }}>
                {cartMessage}
              </div>
            )}
          </DetailsColumn>
        </ProductContentWrapper>

        {similarProducts.length > 0 && (
          <SimilarProductsSection>
            <SimilarProductsTitle>Similar Products</SimilarProductsTitle>
            <SimilarProductsGrid>
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={{ ...similarProduct, image: similarProduct.image }} />
                ))}
            </SimilarProductsGrid>
          </SimilarProductsSection>
        )}
      </PageWrapper>
    </div>
  );
};

export default ProductDetailPage;