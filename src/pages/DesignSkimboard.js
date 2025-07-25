// File: src/pages/DesignSkimboard.js
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '../contexts/DesignContext';
import { SketchPicker } from 'react-color';
import { GradientPicker } from 'react-linear-gradient-picker';
import '../index.css';
import 'react-linear-gradient-picker/dist/index.css';

// The cropImageToSquare function remains the same
export const cropImageToSquare = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "Anonymous"; 

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;
      const cropSize = Math.min(sourceWidth, sourceHeight);
      const sourceX = (sourceWidth - cropSize) / 2;
      const sourceY = (sourceHeight - cropSize) / 2;

      canvas.width = cropSize;
      canvas.height = cropSize;

      ctx.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      const croppedDataUrl = canvas.toDataURL('image/png');
      resolve(croppedDataUrl);
    };

    image.onerror = (error) => reject(error);
  });
};

const rgbToRgba = (rgb, a = 1) => rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`);

const WrappedSketchPicker = ({ onSelect, ...rest }) => {
  return (
    <SketchPicker
      {...rest}
      width="220px"
      color={rgbToRgba(rest.color, rest.opacity)}
      onChange={c => {
        const { r, g, b, a } = c.rgb;
        onSelect(`rgb(${r}, ${g}, ${b})`, a);
      }}
    />
  );
};

// --- STYLED COMPONENTS (Enhancements are here) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #181818;
  color: #fff;
  padding: 32px 0;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px; 
  @media (max-width: 900px) {
    gap: 24px;
  }
`;

const PreviewArea = styled.div`
  background-image: url('/sandpattern.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  min-width: 0;
  min-height: 400px; 

`;

// --- ENHANCEMENT: Made the board responsive ---
// Current SkimboardShape
// src/pages/DesignSkimboard.js

const SkimboardShape = styled.div`
  width: 80%; 
  max-width: 600px;
  aspect-ratio: 2 / 1; 
  margin: 30px 10%; 
  position: absolute;
  background: ${props => props.bg};
  
  mask-image: url('/new-customisable-skimboard.png');
  -webkit-mask-image: url('/new-customisable-skimboard.png');
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  @media (max-width: 426px) {
    margin-top: 100px;
  }
 
`;

const SkimboardShadow = styled.div`
  width: 80%; 
  max-width: 600px;
  aspect-ratio: 2 / 1; 
  margin: 30px 10%; 
  position: absolute;
  overflow: hidden; /* Keep this if you want to clip content that goes outside the mask */
  background-image: url('/new-customisable-skimboard clone.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  @media (max-width: 426px) {
    margin-top: 100px;
  }
`;



// --- ENHANCEMENT: More robust centering for text ---
const PreviewText = styled.div`
  position: absolute;
  color: ${props => props.color || '#000'};
  font-family: ${props => props.font || 'Arial'};
  font-size: ${props => props.size || 36}px;
  font-weight: ${props => props.weight || 'bold'};
  width: 90%; /* Give it some breathing room from edges */
  text-align: center;
  pointer-events: none;
  word-wrap: break-word;
  z-index: 10;

  /* Use transform for perfect horizontal centering */
  left: 50%;
  transform: translateX(-50%);
  top:${props => props.pos || '35%'};
`;

// --- ENHANCEMENT: More robust centering for decal ---
const PreviewDecal = styled.img`
  position: absolute;
  max-width: 35%; /* Adjust decal size relative to board */
  max-height: 70%;
  pointer-events: none;
  object-fit: contain;

  /* Use transform for perfect centering */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ControlsParent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  @media (max-width: 768px) { 
    flex-direction: column;
  }
`;

const Controls = styled.div`
  flex: 1 1 0;
  background: #3F2A56; 
  border-radius: 12px;
  padding: 24px; 
  display: flex;
  flex-direction: column;
  gap: 20px; 
  min-width: 0; 

  input[type="text"],
  input[type="number"],
  select {
    background-color: #FFF; 
    color: #333; 
    border: 1px solid #D1C4E9; 
    border-radius: 6px;
    padding: 10px 12px; 
    font-size: 1rem; 
    width: 100%; 
    box-sizing: border-box;
    margin-top: 4px; 
  }
  
  input[type="color"] {
    height: 40px; 
    width: 60px; 
    padding: 2px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  // --- ENHANCEMENT: Removed inline style for angle input ---
  #gradientAngleInput {
    max-width: 80px;
  }

  input[type="file"] {
    color: #FFDAB9; 
    font-size: 0.9rem;
  }
  input[type="file"]::file-selector-button {
    background: #FFDAB9;
    color: #232323;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
`;

// --- ENHANCEMENT: Wrapper to handle fixed-width gradient picker ---
const GradientPickerWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the picker */
  overflow-x: auto; /* Allow scrolling if it's still too wide */
  padding-bottom: 5px; /* Add some space for scrollbar if it appears */

  /* Make the picker itself responsive if possible, or just center it */
  .react-linear-gradient-picker {
    max-width: 100%;
  }
`;

// Other styled components remain the same
const Section = styled.div` margin-bottom: 16px; `;
const SectionTitle = styled.h2` font-size: 1.5rem; color: #FFDAB9; margin-bottom: 12px; font-family: 'Inria Serif', serif; `;
const StyledLabel = styled.label` font-size: 1.1rem; color: #EDE7F6; display: block; margin-bottom: 6px; font-family: 'Instrument Sans', sans-serif; `;
const Inline = styled.div` display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; `;
const ToggleGroup = styled.div` display: flex; gap: 12px; margin-bottom: 15px; `;
const ToggleBtn = styled.button` background: ${props => props.active ? '#FFDAB9' : 'rgba(255,255,255,0.1)'}; color: ${props => props.active ? '#3F2A56' : '#FFDAB9'}; border: 1px solid #FFDAB9; border-radius: 6px; padding: 10px 20px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.2s, color 0.2s; flex-grow: 1; font-family: 'Instrument Sans', sans-serif; `;
const AddToCartBtn = styled.button` background: #9C27B0; color: #FFFFFF; border: none; border-radius: 8px; font-size: 1.25rem; font-weight: bold; padding: 16px 0; margin-top: 24px; width: 100%; cursor: pointer; transition: background 0.2s; font-family: 'Instrument Sans', sans-serif; &:hover { background: #7B1FA2; } `;
const ResetButton = styled.button` background: transparent; color: #FFDAB9; border: 2px solid #FFDAB9; border-radius: 8px; font-size: 1.25rem; padding: 14px 0; margin-top: 12px; width: 100%; cursor: pointer; transition: all 0.2s; font-family: 'Instrument Sans', sans-serif; &:hover { background: rgba(255, 218, 185, 0.1); border-color: #FFA07A; color: #FFA07A; } `;



const DesignSkimboard = () => {
    // The entire logic of your component remains UNCHANGED.
    // ... all your hooks, state, and functions ...
    const previewRef = useRef();
    const navigate = useNavigate();
    const {
        currentDesign,
        updateDesign,
        resetDesign: resetContextDesign,
        initialDesignState
    } = useDesign();
    const [palette, setPalette] = useState(
        currentDesign.gradientDetails.stops || initialDesignState.gradientDetails.stops
    );
    const updatePaletteAndContext = (newPalette) => {
        setPalette(newPalette);
        updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, stops: newPalette } });
    }
    useEffect(() => {
        setPalette(currentDesign.gradientDetails.stops);
    }, [currentDesign.gradientDetails.stops]);
    const colorMode = currentDesign.baseType;
    const setColorMode = (mode) => updateDesign({ baseType: mode });
    const solidColor = currentDesign.solidColor || '#FFDAB9';
    const setSolidColor = (color) => updateDesign({ solidColor: color.hex || color });
    const gradientType = currentDesign.gradientDetails.type;
    const setGradientType = (type) => updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, type } });
    const gradientAngle = currentDesign.gradientDetails.angle;
    const setGradientAngle = (angle) => updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, angle: Number(angle) } });
    let feature = 'none';
    if (currentDesign.isTextEnabled) feature = 'text';
    else if (currentDesign.isDecalEnabled) feature = 'decal';
    else if (currentDesign.isTextAndDecalEnabled) feature = 'textAndDecal';
    const setFeature = (f) => {
        updateDesign({
            isTextEnabled: f === 'text',
            isDecalEnabled: f === 'decal',
            isTextAndDecalEnabled: f === 'textAndDecal'
        });
    };
    const text = currentDesign.customText.text;
    const setText = (val) => updateDesign({ customText: { ...currentDesign.customText, text: val } });
    const textColor = currentDesign.customText.color;
    const setTextColor = (color) => updateDesign({ customText: { ...currentDesign.customText, color: color.hex || color } });
    const textFont = currentDesign.customText.font;
    const setTextFont = (val) => updateDesign({ customText: { ...currentDesign.customText, font: val } });
    const textSize = currentDesign.customText.size;
    const setTextSize = (val) => updateDesign({ customText: { ...currentDesign.customText, size: Number(val) } });
    const textWeight = currentDesign.customText.weight;
    const setTextWeight = (val) => updateDesign({ customText: { ...currentDesign.customText, weight: val } });
    const textPosition = currentDesign.customText.position;
    const setTextPosition = (val) => {
        var pos = "35%";
        if (val === 'top') {
            pos = "15%"; // Adjusted for better placement
        }
        else if (val === 'bottom') {
            pos = "60%" // Adjusted for better placement
        }
        updateDesign({ customText: { ...currentDesign.customText, position: val, pos: pos } });
    }
    const decalUrl = currentDesign.decal.url;
    const decalName = currentDesign.decal.name;
    // const handleDecalUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = async () => {
    //             try {
    //                 const originalDataUrl = reader.result;
    //                 const croppedDataUrl = await cropImageToSquare(originalDataUrl);
    //                 const updatePayload = {
    //                     decal: { ...currentDesign.decal, url: croppedDataUrl, name: file.name },
    //                     isDecalEnabled: true,
    //                     isTextEnabled: false,
    //                     isTextAndDecalEnabled: false,
    //                 };
    //                 if (feature === 'textAndDecal') {
    //                     updatePayload.isTextAndDecalEnabled = true;
    //                     updatePayload.isDecalEnabled = false;
    //                 }
    //                 updateDesign(updatePayload);
    //             } catch (error) {
    //                 console.error("Error cropping image:", error);
    //                 alert("Could not process the image. Please try another one.");
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleDecalUpload = async () => {
    try {
        const canvas = await html2canvas(previewRef.current);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        const formData = new FormData();
        formData.append('product', blob, 'custom_skimboard.png');

        // const uploadRes = await fetch('http://localhost:4000/upload', {
        const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/upload`,{
            method: 'POST',
            body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error("Upload failed");

        return uploadData.image_url; // URL to send to your /addcustomboard endpoint
    } catch (error) {
        console.error("Image export/upload error:", error);
        throw error;
    }
};

    function getGradientString(type, angle, stopsArray) {
        const sortedStops = [...stopsArray].sort((a, b) => parseFloat(a.offset) - parseFloat(b.offset));
        const stopsString = sortedStops
            .map(stop => `${stop.color} ${Math.round(parseFloat(stop.offset) * 100)}%`)
            .join(', ');
        return type === 'linear'
            ? `linear-gradient(${angle}deg, ${stopsString})`
            : `radial-gradient(circle, ${stopsString})`;
    }
    const previewBg = colorMode === 'solid' ? solidColor : getGradientString(gradientType, gradientAngle, palette);

    const handleAddToCart = async () => {
    try {
        const imageUrl = await handleDecalUpload();

        // First: Add the custom board to the database
        // const response = await fetch('http://localhost:4000/addcustomboard', {
        const response = fetch(`${process.env.REACT_APP_API_URL}/addcustomboard`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                image: imageUrl
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || 'Failed to add custom skimboard.');
            return;
        }

        const newBoardId = data.board.id;


        // const cartResponse = await fetch('http://localhost:4000/addtocart', {
        const cartResponse = await fetch(`${process.env.REACT_APP_API_URL}/addtocart`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                itemId: newBoardId,
                quantity: 1
            })
        });

        if (!cartResponse.ok) {
            alert('Board added but failed to add to cart.');
            return;
        }

        alert('Custom skimboard added to cart!');
        navigate('/shoppingCart');

    } catch (error) {
        console.error('Error adding skimboard:', error);
        alert('An error occurred. Please try again.');
    }
};
    const handleResetDesign = () => {
        resetContextDesign();
        setPalette(initialDesignState.gradientDetails.stops);
    };

  return (
    <div className="design-page">
      <PageWrapper>
        <Layout>
          <PreviewArea ref={previewRef}>
            <h1 style={{ textAlign: 'center', color: 'rgb(131, 57, 143)', fontSize: 36, textShadow: '-2px 2px 2px rgba(0, 0, 0, 0.30)' }}>
              Customise Your Skimboard
            </h1>
            <SkimboardShadow></SkimboardShadow>
            <SkimboardShape bg={previewBg} id='skimboardPreview'>
              {(feature === 'text' || feature === 'textAndDecal') && text && (
                <PreviewText color={textColor} font={textFont} size={textSize} weight={textWeight} pos={currentDesign.customText.pos}>
                  {text || "Enter text here"}
                </PreviewText>
              )}
              {(feature === 'decal' || feature === 'textAndDecal') && decalUrl && (
                <PreviewDecal src={decalUrl} alt="Decal Preview" />
              )}
            </SkimboardShape>
            
          </PreviewArea>
          
          <ControlsParent>
            <Controls>
              <Section>
                <SectionTitle>Board Colour</SectionTitle>
                <ToggleGroup>
                  <ToggleBtn active={colorMode === 'solid'} onClick={() => setColorMode('solid')}>Solid</ToggleBtn>
                  <ToggleBtn active={colorMode === 'gradient'} onClick={() => setColorMode('gradient')}>Gradient</ToggleBtn>
                </ToggleGroup>
                {colorMode === 'solid' && (
                  <>
                    <StyledLabel htmlFor="solidColorPicker">Pick Colour:</StyledLabel>
                    <SketchPicker 
                        id="solidColorPicker"
                        color={solidColor}
                        onChangeComplete={(color) => setSolidColor(color.hex)}
                        width="100%"
                    />
                  </>
                )}
                {colorMode === 'gradient' && (
                  <div>
                    <Inline style={{ alignItems: 'flex-end', marginBottom: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <StyledLabel htmlFor="gradientTypeSelect">Type:</StyledLabel>
                        <select id="gradientTypeSelect" value={gradientType} onChange={e => setGradientType(e.target.value)}>
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      {gradientType === 'linear' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <StyledLabel htmlFor="gradientAngleInput">Angle:</StyledLabel>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              id="gradientAngleInput"
                              type="number"
                              value={gradientAngle}
                              min={0}
                              max={360}
                              onChange={e => setGradientAngle(e.target.value)}
                              // INLINE STYLE REMOVED
                            />
                            <span style={{color: '#EDE7F6', marginLeft: '5px'}}>deg</span>
                          </div>
                        </div>
                      )}
                    </Inline>
                    <StyledLabel>Adjust Gradient:</StyledLabel>
                    <GradientPickerWrapper> {/* WRAPPER ADDED */}
                      <GradientPicker
                        width={300} 
                        paletteHeight={30} 
                        palette={palette}
                        onPaletteChange={updatePaletteAndContext}
                      >
                        <WrappedSketchPicker />
                      </GradientPicker>
                    </GradientPickerWrapper>
                  </div>
                )}
              </Section>
            </Controls>

            <Controls>
              {/* This whole section remains the same */ }
              <Section>
              <SectionTitle>Add Detail</SectionTitle>
              <ToggleGroup>
                <ToggleBtn active={feature === 'none'} onClick={() => setFeature('none')}>None</ToggleBtn>
                <ToggleBtn active={feature === 'text'} onClick={() => setFeature('text')}>Text</ToggleBtn>
                <ToggleBtn active={feature === 'decal'} onClick={() => setFeature('decal')}>Decal</ToggleBtn>
                <ToggleBtn active={feature === 'textAndDecal'} onClick={() => setFeature('textAndDecal')}>Text and Decal</ToggleBtn>
              </ToggleGroup>
              
              {(feature === 'text' ||feature === 'textAndDecal') && (
                <>
                  <div>
                    <StyledLabel htmlFor="textInput">Text:</StyledLabel>
                    <input id="textInput" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text here" />
                  </div>
                  <Inline>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textColorPicker">Colour:</StyledLabel>
                      <input id="textColorPicker" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />
                    </div>
                    <div style={{flex: 2}}>
                      <StyledLabel htmlFor="textFontSelect">Font:</StyledLabel>
                      <select id="textFontSelect" value={textFont} onChange={e => setTextFont(e.target.value)}>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Instrument Sans', sans-serif">Instrument Sans</option>
                        <option value="'Inria Serif', serif">Inria Serif</option>
                        <option value="'Lilita One', cursive">Lilita One</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman</option>
                        <option value="'Courier New', Courier, monospace">Courier New</option>
                      </select>
                    </div>
                  </Inline>
                  <Inline>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textSizeInput">Size (px):</StyledLabel>
                      <input id="textSizeInput" type="number" value={textSize} min={10} max={100} onChange={e => setTextSize(e.target.value)} />
                    </div>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textWeightSelect">Weight:</StyledLabel>
                      <select id="textWeightSelect" value={textWeight} onChange={e => setTextWeight(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">Lighter</option>
                        
                      </select>
                    </div>
                  </Inline>
                  <Inline>
                    
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textPosition">Text position:</StyledLabel>
                      <select id="textPosition" value={textPosition} onChange={e => setTextPosition(e.target.value)}>                       
                        <option value="top">Top</option>
                        <option value="centre">Centre</option>
                        <option value="bottom">Bottom</option>                                  
                      </select>
                    </div>
                  </Inline>
                </>
              )}
              
              {(feature === 'decal' ||feature === 'textAndDecal') && (
                <>
                  <div>
                    <StyledLabel htmlFor="decalUpload">Upload Image:</StyledLabel>
                    <input id="decalUpload" type="file" accept="image/*" onChange={handleDecalUpload} />
                  </div>
                  {decalUrl && <div style={{ color: '#FFDAB9', fontSize: '0.9rem', marginTop: 8 }}>Uploaded: {decalName}</div>}
                </>
              )}
            </Section>
            <AddToCartBtn onClick={handleAddToCart}>Add to Cart</AddToCartBtn>
            <ResetButton onClick={handleResetDesign}>Reset Design</ResetButton>
            </Controls>
          </ControlsParent>
        </Layout>
      </PageWrapper>
    </div>
  );
};

export default DesignSkimboard;