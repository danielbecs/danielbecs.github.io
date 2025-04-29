import './styles.css';
import { SpinningWheel } from './wheel';

// Initialize the spinning wheel once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const wheel = new SpinningWheel();
  
  // Setup prank advertisements
  setupPrankAds();
});

// Fake ad images and content - these are deliberate stock photos that look like ads
const adImages = [
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
];

function setupPrankAds() {
  const adBanner1 = document.getElementById('ad-banner-1');
  const adBanner2 = document.getElementById('ad-banner-2');
  const popupOverlay = document.getElementById('popup-overlay');
  const closePopup = document.getElementById('close-popup');
  const donateBtn = document.getElementById('donate-btn');
  
  if (adBanner1 && adBanner2 && popupOverlay && closePopup && donateBtn) {
    // Set random background images for the ad banners
    adBanner1.style.backgroundImage = `url('${adImages[Math.floor(Math.random() * adImages.length)]}')`;
    adBanner2.style.backgroundImage = `url('${adImages[Math.floor(Math.random() * adImages.length)]}')`;
    
    // Add click event listeners to ad banners
    adBanner1.addEventListener('click', showPopup);
    adBanner2.addEventListener('click', showPopup);
    
    // Close popup event
    closePopup.addEventListener('click', hidePopup);
    
    // Donate button event
    donateBtn.addEventListener('click', () => {
      // Open Motivosity in new tab (replace with actual Motivosity URL if available)
      window.open('https://motivosity.com', '_blank');
      hidePopup();
    });
  }
}

function showPopup() {
  const popupOverlay = document.getElementById('popup-overlay');
  if (popupOverlay) {
    popupOverlay.classList.add('active');
  }
}

function hidePopup() {
  const popupOverlay = document.getElementById('popup-overlay');
  if (popupOverlay) {
    popupOverlay.classList.remove('active');
  }
}