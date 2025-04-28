// Modal Script
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('contactModal');
  const overlay = document.getElementById('contactModalOverlay');
  const openBtn = document.getElementById('openContactModalBtn');
  const closeBtn = document.getElementById('closeContactModalBtn');

  function openModal() {
    if (modal && overlay) {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  function closeModal() {
    if (modal && overlay) {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    // Close modal if overlay is clicked
    overlay.addEventListener('click', function(event) {
      // Make sure click is on overlay itself and not on modal content
      if (event.target === overlay) {
         closeModal();
      }
    });
  }

  // Optional: Close modal on Escape key press
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Handle form submission (Placeholder - will need actual submission logic later)
  const modalForm = document.getElementById('contact-modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission for now
      console.log('Form submitted (placeholder)');
      // TODO: Implement actual form submission (e.g., AJAX, Formspree)

      // Optionally show success message and close modal after delay
      const successMessage = modal.querySelector('.w-form-done');
      const failMessage = modal.querySelector('.w-form-fail');
      const submitButton = modalForm.querySelector('input[type="submit"]');

      // Hide form elements, show success message
      // This requires structure change or more complex selection
      // For now, just log and maybe close

      alert('Thank you! Your submission has been received (Placeholder)');
      // setTimeout(closeModal, 2000); // Close after 2 seconds

    });
  }

});

// Set Slackbot Time
document.addEventListener('DOMContentLoaded', function() {
  // Target both time elements
  const accountabilityTimeElement = document.querySelector('.attribute-card[data-attribute="accountability"] #slackbot-current-time');
  const autonomyTimeElement = document.getElementById('slackbot-autonomy-time'); // Target new ID
  const timestampElement = document.querySelector('.slackbot-attachment .slackbot-timestamp'); // Find the timestamp element

  // Function to format and set time
  function setTime(element) {
    if (element) {
        const now = new Date();
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
        // const formattedTime = now.toLocaleTimeString('en-US', timeOptions).replace(" EDT", " EST"); // Original had options undefined
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' }).replace(" EDT", " EST");
        element.textContent = formattedTime;
    }
  }

  // Set time for accountability bot (if it exists)
  setTime(accountabilityTimeElement);

  // Set time for autonomy bot (if it exists)
  setTime(autonomyTimeElement);

  // Set timestamp for accountability bot's budget section (if it exists)
  if (timestampElement) {
    const now = new Date();
    const estOffset = -4 * 60; // EDT offset from UTC in minutes (use -5 for EST if needed)
    const estNow = new Date(now.getTime() + estOffset * 60000);

    // Format for timestamp element (e.g., Data as of YYYY-MM-DD HH:MM:SS EST)
    const year = estNow.getFullYear();
    const month = (estNow.getMonth() + 1).toString().padStart(2, '0');
    const day = estNow.getDate().toString().padStart(2, '0');
    const hours = estNow.getHours().toString().padStart(2, '0');
    const minutes = estNow.getMinutes().toString().padStart(2, '0');
    const seconds = estNow.getSeconds().toString().padStart(2, '0');
    const formattedTimestamp = `Data as of ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    timestampElement.textContent = formattedTimestamp;
  }
});

// Swiper Initialization
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.testimonial-swiper', {
    // Optional parameters
    slidesPerView: 1.2, // Show fraction on mobile
    spaceBetween: 15, // Space on mobile
    centeredSlides: true, // Center slide on mobile
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
        centeredSlides: false,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 16, // Reduced space between slides
        centeredSlides: false,
      }
    }
  });
});

// New Hero Interaction Script
document.addEventListener('DOMContentLoaded', function() {
    const attributeItems = document.querySelectorAll('.attribute-item');
    const attributeCards = document.querySelectorAll('.attribute-card');
    const actualLine = document.querySelector('.line-graph-actual'); // Get the line element

    // --- Slide Logic Integration ---
    const slideElements = document.querySelectorAll('#slideshow .slide');
    let currentSlideIndex = 0;
    const totalRotationTime = 4500; // Must match the hero rotation interval
    let slideShowIntervalId = null;
    const slideshowContainer = document.getElementById('slideshow');
    const firstSlide = slideElements.length > 0 ? slideElements[0] : null;

    function showNextSlide() {
        if (slideElements.length === 0) return;
        const previousSlideIndex = currentSlideIndex;
        currentSlideIndex = (currentSlideIndex + 1) % slideElements.length;

        slideElements.forEach(slide => {
            slide.classList.remove('active', 'previous');
        });

        slideElements[previousSlideIndex].classList.add('previous');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slideElements[currentSlideIndex].classList.add('active');
            });
        });
    }

    function setContainerHeight() {
         if (slideshowContainer && firstSlide && firstSlide.naturalWidth > 0) {
            const containerWidth = slideshowContainer.offsetWidth;
            const aspectRatio = firstSlide.naturalHeight / firstSlide.naturalWidth;
            const requiredHeight = containerWidth * aspectRatio;
            slideshowContainer.style.height = requiredHeight + 'px';
        } else if (slideshowContainer && firstSlide && firstSlide.naturalWidth === 0) {
            // If naturalWidth is 0, image might not be loaded yet, try again shortly
            // console.log('Retrying container height calculation...');
            // setTimeout(setContainerHeight, 100); // Optionally retry
        } else {
             // console.warn('Could not set slideshow container height. Elements or dimensions missing.');
        }
    }
    // --- End Slide Logic Integration ---

    let rotationInterval;
    const attributes = ['transparency', 'alignment', 'accountability', 'autonomy', 'velocity'];
    let currentAttributeIndex = attributes.indexOf('transparency'); // Start with Transparency active

    function activateAttribute(attribute) {
        // Clear existing slide interval if active
        console.log('Activating:', attribute, 'Clearing old slide interval:', slideShowIntervalId);
        if (slideShowIntervalId) {
            clearInterval(slideShowIntervalId);
            slideShowIntervalId = null;
        }

        // --- Reset Specific Animations --- //
        console.log('Deactivating all items and resetting animations');
        attributeItems.forEach(item => item.classList.remove('active'));
        attributeCards.forEach(card => card.classList.remove('active'));

        // Reset Transparency line animation
        if (actualLine) {
            actualLine.classList.remove('start-line-animation');
        }

        // Reset Accountability slackbot animation
        const accountabilityCard = document.querySelector('.attribute-card[data-attribute="accountability"]');
        if (accountabilityCard) {
            const slackbotVisualAcc = accountabilityCard.querySelector('.slackbot-visual');
            if (slackbotVisualAcc) slackbotVisualAcc.classList.remove('start-animation');
        }

        // --- Reset Autonomy Resource Animations --- //
        const autonomyCardReset = document.querySelector('.attribute-card[data-attribute="autonomy"]');
        const resourcesElementReset = autonomyCardReset?.querySelector('.slackbot-resources');
        // No need to reset button class here if targetting based on resource class
        if (resourcesElementReset) {
            resourcesElementReset.classList.remove('start-resources-animation');
            console.log('Reset Autonomy resource animations.');
        }
        // --- End Reset Autonomy Resource Animations --- //


        // Reset Alignment slides to default state (Slide 1)
        if (slideElements.length > 0) {
            slideElements.forEach((slide, index) => {
                slide.classList.remove('active', 'previous');
                if (index === 0) {
                    slide.classList.add('active');
                }
            });
             currentSlideIndex = 0;
        }

        // Activate selected
        const selectedItem = document.querySelector(`.attribute-item[data-attribute="${attribute}"]`);
        const selectedCard = document.querySelector(`.attribute-card[data-attribute="${attribute}"]`);

        if (selectedItem && selectedCard) {
            selectedItem.classList.add('active');
            selectedCard.classList.add('active');

            // --- Trigger Specific Animations --- //
            if (attribute === 'transparency' && actualLine) {
                actualLine.classList.remove('start-line-animation');
                void actualLine.offsetWidth; // Trigger reflow
                actualLine.classList.add('start-line-animation');
            } else if (attribute === 'accountability') {
                const slackbotVisual = selectedCard?.querySelector('.slackbot-visual');
                if (slackbotVisual) {
                    slackbotVisual.classList.remove('start-animation');
                    void slackbotVisual.offsetWidth; // Trigger reflow
                    slackbotVisual.classList.add('start-animation');
                }
            } else if (attribute === 'autonomy') {
                // --- Trigger Autonomy Resource Animations --- //
                const resourcesElement = selectedCard.querySelector('.slackbot-resources');
                if (resourcesElement) {
                    // ClassList remove is already done above during reset
                    void resourcesElement.offsetWidth; // Trigger reflow
                    resourcesElement.classList.add('start-resources-animation');
                    console.log('Added start-resources-animation to resources element');
                }
                // --- End Trigger Autonomy Resource Animations --- //

                // Update time for this specific slackbot
                const autonomyTimeElement = document.getElementById('slackbot-current-time'); // Corrected ID
                setTime(autonomyTimeElement); // Call the global setTime function
            } else if (attribute === 'alignment' && slideElements.length > 0) {
                // --- Start/Reset Alignment Slideshow --- //
                currentSlideIndex = 0;
                setContainerHeight();
                const singleSlideDuration = totalRotationTime / slideElements.length;
                slideShowIntervalId = setInterval(showNextSlide, singleSlideDuration);
                console.log('Started new slide interval:', slideShowIntervalId, 'Duration:', singleSlideDuration);
                // --- End Alignment Slideshow --- //
            }
             // --- End Trigger Specific Animations --- //
        }
    }

    function startRotation() {
        // Clear existing interval before starting a new one
        console.log('startRotation: Clearing old rotation interval:', rotationInterval);
        if (rotationInterval) { 
            clearInterval(rotationInterval); 
        }
        rotationInterval = setInterval(autoRotate, totalRotationTime);
        console.log('startRotation: Started new rotation interval:', rotationInterval);
    }

    function autoRotate() {
        // Clear any active slide interval *before* switching attribute
        console.log('AutoRotate: Clearing slide interval:', slideShowIntervalId);
        if (slideShowIntervalId) {
            clearInterval(slideShowIntervalId);
            slideShowIntervalId = null;
        }
        currentAttributeIndex = (currentAttributeIndex + 1) % attributes.length;
        console.log('AutoRotate: Activating next attribute index:', currentAttributeIndex);
        activateAttribute(attributes[currentAttributeIndex]);
    }

    // Add click listeners
    attributeItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            console.log('Click detected on:', item.getAttribute('data-attribute'));
            // --- Explicitly clear ALL timers on click --- 
            if (rotationInterval) {
                console.log('Click: Clearing rotation interval:', rotationInterval);
                clearInterval(rotationInterval);
                rotationInterval = null; // Good practice to nullify after clearing
            }
            // The slide interval is cleared within activateAttribute

            const attribute = this.getAttribute('data-attribute');
            currentAttributeIndex = attributes.indexOf(attribute);
            activateAttribute(attribute);
            startRotation(); // Reset timer on manual click
        });
    });

    // Global helper function to set time (accessible by activateAttribute)
    function setTime(element) {
        if (element) {
            const now = new Date();
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
            const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
            element.textContent = formattedTime;
        }
    }

    // Initial activation (redundant if HTML has .active class, but safe)
    // activateAttribute(attributes[currentIndex]); 

    // Start auto-rotation
    startRotation(); // Re-enabled auto-rotation
});

// Animated ARR Chart Script
document.addEventListener('DOMContentLoaded', function() {
  // Scope this script to the specific chart container
  const container = document.getElementById('transparency-chart-container');
  if (!container) {
      console.error("Transparency chart container not found.");
      return;
  }

  // Data (approximated from image)
  const data = [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 70 },
      { month: 'Mar', value: 60, event: 'Paid Ads' }, // Renamed event
      { month: 'Apr', value: 90 }, // Removed event here
      { month: 'May', value: 140 },
      { month: 'Jun', value: 110, event: 'Legacy Churn' }, // Added new event
      { month: 'Jul', value: 180 }, 
      { month: 'Aug', value: 170, event: 'Launched Self Serve' }, // Moved event here
      { month: 'Sep', value: 200 }, 
      { month: 'Oct', value: 210 }, 
      { month: 'Nov', value: 230 },
      { month: 'Dec', value: 250 }
  ];

  const targetData = [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 45 },
      { month: 'Mar', value: 65 },
      { month: 'Apr', value: 80 },
      { month: 'May', value: 90 },
      { month: 'Jun', value: 105 },
      { month: 'Jul', value: 120 },
      { month: 'Aug', value: 135 },
      { month: 'Sep', value: 155 },
      { month: 'Oct', value: 175 },
      { month: 'Nov', value: 195 },
      { month: 'Dec', value: 220 }
  ];

  const svg = container.querySelector('.chart-svg');
  if (!svg) {
       console.error("Chart SVG element not found within container.");
       return;
  }
  const svgWidth = 500; // From viewBox
  const svgHeight = 300; // From viewBox
  const margin = { top: 20, right: 10, bottom: 40, left: 30 }; // Reduced L/R margins to widen chart
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // --- Scales ---
  const xScale = (index) => margin.left + index * (width / (data.length - 1));
  const yScale = (value) => margin.top + height - (value / 250) * height; // Max value approx 250M

  // --- Axes ---
  const xAxisGroup = svg.querySelector('.x-axis');
  const yAxisGroup = svg.querySelector('.y-axis');
  const gridGroup = svg.querySelector('.grid');

  // Y-axis line
  const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxisLine.setAttribute('x1', margin.left);
  yAxisLine.setAttribute('y1', margin.top);
  yAxisLine.setAttribute('x2', margin.left);
  yAxisLine.setAttribute('y2', margin.top + height);
  yAxisGroup.appendChild(yAxisLine);

  // X-axis line
  const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxisLine.setAttribute('x1', margin.left);
  xAxisLine.setAttribute('y1', margin.top + height);
  xAxisLine.setAttribute('x2', margin.left + width);
  xAxisLine.setAttribute('y2', margin.top + height);
  xAxisGroup.appendChild(xAxisLine);

  // Y-axis labels and grid lines
  const yTicks = [0, 50, 100, 150, 200, 250];
  yTicks.forEach(tick => {
      const y = yScale(tick);

      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('class', 'grid-line');
      gridLine.setAttribute('x1', margin.left);
      gridLine.setAttribute('y1', y);
      gridLine.setAttribute('x2', margin.left + width);
      gridLine.setAttribute('y2', y);
      gridGroup.appendChild(gridLine);
  });

  // X-axis labels
  data.forEach((d, i) => {
      if (i % 2 === 0) {
          const x = xScale(i);
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          label.setAttribute('x', x);
          label.setAttribute('y', margin.top + height + 30); // Position below x-axis (moved down 10px)
          label.setAttribute('text-anchor', 'middle');
          label.textContent = d.month;
          // Apply font size for X-axis labels dynamically
          label.style.fontSize = '24px';
          xAxisGroup.appendChild(label);
      }
  });

  // --- Callout Elements (Line & Text) ---
  const calloutGroup = svg.querySelector('.callouts');
  data.forEach((d, i) => {
      if (d.event) {
          const startX = xScale(i);
          const startY = yScale(d.value);

          // Determine direction and position based on event
          let endYOffset = -40; // Default upwards
          let textYOffset = -6;  // Default text above line end
          let textAnchorAdjust = 0; // Default no horizontal shift
          
          if (d.event === 'Legacy Churn') {
              endYOffset = 40; // Point downwards
              textYOffset = 15; // Position text below line end
          }

          const endX = startX;
          const endY = startY + endYOffset;
          const textY = endY + textYOffset; 
          let textX = endX; 

          const calloutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          calloutLine.setAttribute('class', 'callout-line');
          calloutLine.setAttribute('id', `callout-line-${i}`);
          calloutLine.setAttribute('x1', startX);
          calloutLine.setAttribute('y1', startY);
          calloutLine.setAttribute('x2', startX);
          calloutLine.setAttribute('y2', startY);
          calloutGroup.appendChild(calloutLine);

          const calloutText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          calloutText.setAttribute('class', 'callout');
          calloutText.setAttribute('id', `callout-${i}`);
          calloutText.setAttribute('x', textX);
          calloutText.setAttribute('y', textY);
          calloutText.textContent = d.event;

          // Adjust last callout anchor (now also checks if it's the very last data point)
          const lastEventIndex = data.map(item => item.event).lastIndexOf(d.event);
          if (i === data.length - 1 || (i === lastEventIndex && i > data.length / 2) ) { 
                calloutText.setAttribute('text-anchor', 'end'); // Anchor to the right edge of text
                textX = endX - 5; // Shift slightly left from line end (re-assign textX)
                calloutText.setAttribute('x', textX); // Apply adjusted X
          }

          calloutGroup.appendChild(calloutText);

          // Prepare line animation (vertical line)
          const lineLength = Math.abs(endY - startY);
          calloutLine.setAttribute('x2', endX);
          calloutLine.setAttribute('y2', endY);
          calloutLine.style.strokeDasharray = lineLength;
          calloutLine.style.strokeDashoffset = lineLength;
          // Animation is applied via CSS using the ID
      }
  });

  // --- Target Line Path (Static) ---
  const targetLinePath = svg.querySelector('.target-line');
  const targetPathData = targetData.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ');
  targetLinePath.setAttribute('d', targetPathData);

  // --- ARR Line Path (Animated) ---
  const arrLinePath = svg.querySelector('.arr-line');
  const pathData = data.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ');
  arrLinePath.setAttribute('d', pathData);

  // --- Animation ---
  let animationTimeouts = []; // Store timeouts to clear later

  // Function to reset callout animations
  function resetCalloutAnimations() {
    const calloutLines = svg.querySelectorAll('.callout-line');
    const calloutTexts = svg.querySelectorAll('.callout');
    
    calloutLines.forEach(line => {
        line.classList.remove('callout-line-animating'); // Keep class removal just in case
        line.style.animation = 'none'; // Explicitly remove animation style
        const lineLength = parseFloat(line.getAttribute('data-line-length') || 0);
        line.style.strokeDashoffset = lineLength; // Reset draw
        line.style.opacity = 0; // Ensure hidden initially 
    });
    calloutTexts.forEach(text => {
        text.classList.remove('callout-text-animating'); // Keep class removal just in case
        text.style.animation = 'none'; // Explicitly remove animation style
        text.style.opacity = 0; // Ensure hidden
    });

    // Clear any pending timeouts
    animationTimeouts.forEach(clearTimeout);
    animationTimeouts = [];
    console.log('Callout animations reset.'); // Debug log
  }

  const lineLength = arrLinePath.getTotalLength();
  // Add console log to check calculated length
  console.log('Calculated ARR line length:', lineLength);
  arrLinePath.style.strokeDasharray = lineLength;
  arrLinePath.style.strokeDashoffset = lineLength;

  // Function to trigger animation (called when the card becomes active)
  function startArrAnimation() {
      console.log('Attempting to start ARR line animation...'); 
      
      // 1. Reset ARR Line
      arrLinePath.style.strokeDashoffset = lineLength;
      arrLinePath.style.animation = 'none';
      svg.querySelector('.arr-endpoint').style.opacity = 0; // Hide dot

      // 2. Reset Callouts
      resetCalloutAnimations(); // Call the reset function
      
      // Using requestAnimationFrame for a more reliable reflow trigger and animation start
      requestAnimationFrame(() => {
          requestAnimationFrame(() => {
              // 3. Apply ARR Line animation
              arrLinePath.style.animation = 'drawLine 2s ease-out forwards';
              console.log('ARR line animation started via requestAnimationFrame.'); 

              // 4. Endpoint Dot Animation Handling
              const arrEndpoint = svg.querySelector('.arr-endpoint');
              const animationEndHandler = () => {
                  const endPoint = data[data.length - 1];
                  const endX = xScale(data.length - 1);
                  const endY = yScale(endPoint.value);
                  arrEndpoint.setAttribute('cx', endX);
                  arrEndpoint.setAttribute('cy', endY);
                  arrEndpoint.style.opacity = 1; // Fade in the dot
                  console.log('ARR line animation ended, dot shown.'); 
                  arrLinePath.removeEventListener('animationend', animationEndHandler);
              };
              arrLinePath.removeEventListener('animationend', animationEndHandler);
              arrLinePath.addEventListener('animationend', animationEndHandler, { once: true });

              // 5. Schedule Callout Animations
              const mainAnimationDuration = 2.0; // Duration of drawLine animation in seconds
              const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // Temp path for calculations

              data.forEach((d, i) => {
                  if (d.event) {
                      const calloutLine = svg.querySelector(`#callout-line-${i}`);
                      const calloutText = svg.querySelector(`#callout-${i}`);

                      if (calloutLine && calloutText) {
                          // Calculate segment length of the main ARR line up to this point
                          const segmentPathData = data.slice(0, i + 1).map((pd, pi) => {
                              const x = xScale(pi);
                              const y = yScale(pd.value);
                              return (pi === 0 ? 'M' : 'L') + x + ',' + y;
                          }).join(' ');
                          
                          tempPath.setAttribute('d', segmentPathData);
                          const segmentLength = tempPath.getTotalLength();
                          
                          // Calculate delay based on proportion of total length
                          const delay = (segmentLength / lineLength) * mainAnimationDuration;
                          console.log(`Callout for ${d.event} (index ${i}): segmentLength=${segmentLength.toFixed(2)}, delay=${delay.toFixed(2)}s`);

                          // Ensure initial state is hidden before timeout (Confirm elements exist)
                          console.log(`   - Found line: ${calloutLine.id}, Found text: ${calloutText.id}`);
                          calloutLine.style.opacity = 0;
                          const calloutLineLength = parseFloat(calloutLine.getAttribute('data-line-length') || 0);
                          calloutLine.style.strokeDashoffset = calloutLineLength;
                          calloutText.style.opacity = 0;

                          // Schedule the animation style adding
                          console.log(`   - Scheduling animation style for line ${calloutLine.id} and text ${calloutText.id} with delay ${delay.toFixed(2)}s`);
                          const timeoutId = setTimeout(() => {
                              console.log(`   - Executing setTimeout for: ${d.event} (line ${calloutLine.id}, text ${calloutText.id})`);
                              // Apply animations directly via style property
                              calloutLine.style.animation = 'drawLine 0.4s ease-out forwards, fadeIn 0.3s ease-in forwards';
                              calloutText.style.animation = 'fadeIn 0.5s ease-in forwards';
                              // Ensure elements are visible for animation to start
                              calloutLine.style.opacity = 1;
                              calloutText.style.opacity = 1;
                          }, delay * 1000); // Convert seconds to milliseconds
                          animationTimeouts.push(timeoutId);
                      }
                  }
              });
          });
      });
  }

  // Pre-calculate and store callout line lengths, ensure initial hidden state
  data.forEach((d, i) => {
      if (d.event) {
          const calloutLine = svg.querySelector(`#callout-line-${i}`);
          if (calloutLine) {
              const x1 = parseFloat(calloutLine.getAttribute('x1'));
              const y1 = parseFloat(calloutLine.getAttribute('y1'));
              const x2 = parseFloat(calloutLine.getAttribute('x2'));
              const y2 = parseFloat(calloutLine.getAttribute('y2'));
              const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              calloutLine.setAttribute('data-line-length', length);
              calloutLine.style.strokeDasharray = length;
              calloutLine.style.strokeDashoffset = length; // Set initial offset
              calloutLine.style.opacity = 0; // Ensure hidden
          }
          const calloutText = svg.querySelector(`#callout-${i}`);
          if(calloutText) calloutText.style.opacity = 0; // Ensure text hidden
      }
  });

  // --- Observer to start animation when the card becomes visible ---
  const cardElement = container.closest('.attribute-card');
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (cardElement.classList.contains('active')) {
                  console.log('Transparency card became active, starting animation.');
                  startArrAnimation();
              } else {
                   // Optionally reset if needed when card becomes inactive
                   arrLinePath.style.animation = 'none'; // Stop any running animation
                   arrLinePath.style.strokeDashoffset = lineLength; // Reset to start state
                   svg.querySelector('.arr-endpoint').style.opacity = 0; // Hide dot
                   resetCalloutAnimations(); // Reset callouts when card becomes inactive
              }
          }
      });
  });

  if (cardElement) {
       observer.observe(cardElement, { attributes: true });
       // Also check initial state in case it's already active on load
       if (cardElement.classList.contains('active')) {
           startArrAnimation();
       }
  } else {
       console.error("Could not find parent attribute card for observer.");
       // Fallback: Start animation immediately if observer setup fails
       startArrAnimation();
  }

});

// Plexus Background Script
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('plexus-canvas');
    if (!canvas) {
        console.error("Plexus canvas not found!");
        return;
    }
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 80 }; // Increased radius slightly

    // --- Configuration ---
    const baseParticleColor = '255, 255, 255'; // Base RGB for particles
    const baseLineColor = '255, 255, 255'; // Base RGB for lines (changed from cyan to white)
    const baseParticleRadius = 2.0; // Slightly smaller base size
    const connectionDistance = 60; // Slightly reduced connection distance (was 110)
    const baseParticleSpeed = 0.25; // Slightly slower base speed (WAS 0.25)
    const depthFactor = 0.6; // How much depth affects size/speed (0-1)
    const edgeFadeDistance = 50; // How far from edge fading starts
    const mouseEffectStrength = 0.03; // Very subtle mouse interaction
    const baseParticleOpacity = 0.15; // Dim base brightness for particles
    const brightnessBoostFactor = 0.5; // How much close connections boost brightness
    const baseLineOpacityFactor = 0.8; // Base opacity factor for lines (Increased from 0.3)
    let particleCount = 100; // Initial estimate

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // Adjust particle count - Doubled density
        particleCount = Math.max(96, Math.min(288, Math.floor((canvas.width * canvas.height) / 6000 * 0.8))); 
        initParticles();
        if (animationFrameId) {
            startAnimation();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            const yRatio = Math.random(); // Use for depth simulation (0=top, 1=bottom)
            const speedMultiplier = (1 - yRatio * depthFactor * 0.5); // Slower at bottom
            particles.push({
                x: Math.random() * canvas.width,
                y: yRatio * canvas.height,
                baseYRatio: yRatio, // Store original ratio for consistent depth effect
                vx: (Math.random() - 0.5) * baseParticleSpeed * speedMultiplier,
                vy: (Math.random() - 0.5) * baseParticleSpeed * speedMultiplier,
                radius: baseParticleRadius * (1 - yRatio * depthFactor), // Smaller at bottom
                opacity: 0, // Base opacity for edge fade calculation
                totalDistOpacityBoost: 0 // Accumulator for brightness boost
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reset brightness boost for this frame
        particles.forEach(p => p.totalDistOpacityBoost = 0);

        // First pass: Calculate connections and brightness boost, draw lines
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const distOpacity = 1 - (dist / connectionDistance); // Brighter for shorter lines

                    // Accumulate boost for connected particles
                    p.totalDistOpacityBoost += distOpacity;
                    p2.totalDistOpacityBoost += distOpacity;

                    // --- Draw Lines ---
                    // Calculate edge fade opacity for *this pair* of particles
                    let p1EdgeOpacity = 1.0;
                    if (p.x < edgeFadeDistance) p1EdgeOpacity = Math.min(p1EdgeOpacity, p.x / edgeFadeDistance);
                    else if (p.x > canvas.width - edgeFadeDistance) p1EdgeOpacity = Math.min(p1EdgeOpacity, (canvas.width - p.x) / edgeFadeDistance);
                    if (p.y < edgeFadeDistance) p1EdgeOpacity = Math.min(p1EdgeOpacity, p.y / edgeFadeDistance);
                    else if (p.y > canvas.height - edgeFadeDistance) p1EdgeOpacity = Math.min(p1EdgeOpacity, (canvas.height - p.y) / edgeFadeDistance);
                    
                    let p2EdgeOpacity = 1.0;
                    if (p2.x < edgeFadeDistance) p2EdgeOpacity = Math.min(p2EdgeOpacity, p2.x / edgeFadeDistance);
                    else if (p2.x > canvas.width - edgeFadeDistance) p2EdgeOpacity = Math.min(p2EdgeOpacity, (canvas.width - p2.x) / edgeFadeDistance);
                    if (p2.y < edgeFadeDistance) p2EdgeOpacity = Math.min(p2EdgeOpacity, p2.y / edgeFadeDistance);
                    else if (p2.y > canvas.height - edgeFadeDistance) p2EdgeOpacity = Math.min(p2EdgeOpacity, (canvas.height - p2.y) / edgeFadeDistance);
                    
                    const avgEdgeOpacity = (p1EdgeOpacity + p2EdgeOpacity) / 2;

                    const avgDepth = (p.baseYRatio + p2.baseYRatio) / 2;
                    const depthOpacity = (1 - avgDepth * depthFactor * 0.5); // Fade lines in background
                    const finalLineOpacity = distOpacity * avgEdgeOpacity * depthOpacity * baseLineOpacityFactor; // Use user's base factor

                    if (finalLineOpacity > 0.01) { // Only draw if reasonably visible
                        ctx.strokeStyle = `rgba(${baseLineColor}, ${finalLineOpacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Second pass: Update positions and draw particles with calculated brightness
        particles.forEach(p => {
             // --- Update Position & Mouse Interaction ---
             let influenceX = 0;
             let influenceY = 0;
             if (mouse.x !== null) {
                 const dxMouse = p.x - mouse.x;
                 const dyMouse = p.y - mouse.y;
                 const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                 if (distMouse < mouse.radius) {
                     const force = (mouse.radius - distMouse) / mouse.radius; // Gentle push
                     influenceX = (dxMouse / distMouse) * force * mouseEffectStrength;
                     influenceY = (dyMouse / distMouse) * force * mouseEffectStrength;
                 }
             }
             p.x += p.vx + influenceX;
             p.y += p.vy + influenceY;

             // --- Calculate Particle Edge Fade Opacity ---
             let edgeOpacity = 1.0;
             if (p.x < edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, p.x / edgeFadeDistance);
             else if (p.x > canvas.width - edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, (canvas.width - p.x) / edgeFadeDistance);
             if (p.y < edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, p.y / edgeFadeDistance);
             else if (p.y > canvas.height - edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, (canvas.height - p.y) / edgeFadeDistance);
             p.opacity = edgeOpacity; // Store edge fade for line calculations potentially, though calculated inline now

             // Wrap around
             if (p.x < 0) p.x = canvas.width;
             if (p.x > canvas.width) p.x = 0;
             if (p.y < 0) p.y = canvas.height;
             if (p.y > canvas.height) p.y = 0;

             // --- Calculate Final Particle Opacity ---
             // Normalize boost slightly by typical number of connections expected (heuristic)
             const averageConnections = connectionDistance / 20; // Rough guess
             const boost = (p.totalDistOpacityBoost / averageConnections) * brightnessBoostFactor;
             const finalParticleOpacity = Math.min(1, baseParticleOpacity + boost) * p.opacity;

             // --- Draw Particle ---
             ctx.fillStyle = `rgba(${baseParticleColor}, ${finalParticleOpacity})`;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
             ctx.fill();
        });

        animationFrameId = requestAnimationFrame(draw);
    }

    function startAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(draw);
        // console.log("Refined Plexus animation started.");
    }

    // --- Event Listeners ---
    window.addEventListener('mousemove', (event) => {
        // Adjust mouse coordinates relative to the canvas position
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });

    // Initial setup
    resizeCanvas();
    startAnimation();
});

// Interactive Services Section Script
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelectors = document.querySelectorAll('#service-selectors .offering-block');
    const visualizationContents = document.querySelectorAll('#service-visualization-area .service-visualization-content');
    let currentServiceIndex = 0;
    let serviceRotationInterval = null;
    const serviceRotationDelay = 3000; // Renamed variable

    // *** ADDED: IR Table Animation Logic ***
    const irTableBody = document.querySelector('#ir-framework-table tbody');
    const irTableRows = irTableBody ? Array.from(irTableBody.querySelectorAll('tr')) : [];
    let irCurrentRowIndex = 0;
    let irIntervalId = null;
    const irRotationDelay = 1500; // Delay for IR table row highlight

    function irActivateRow(index) {
        if (!irTableBody || index < 0 || index >= irTableRows.length) return;
        irTableRows.forEach((row, i) => {
            if (i === index) {
                row.classList.add('active');
            } else {
                row.classList.remove('active');
            }
        });
        irCurrentRowIndex = index;
    }

    function irStartRotation() {
        if (!irTableBody || irIntervalId) return; // Don't start if already running or no table
        console.log("Starting IR table rotation"); // Debug
        if (irTableRows.length > 0) {
            irActivateRow(irCurrentRowIndex); // Activate the starting row
            irIntervalId = setInterval(() => {
                const nextIndex = (irCurrentRowIndex + 1) % irTableRows.length;
                irActivateRow(nextIndex);
            }, irRotationDelay);
        }
    }

    function irStopRotation() {
        if (irIntervalId) {
            console.log("Stopping IR table rotation"); // Debug
            clearInterval(irIntervalId);
            irIntervalId = null;
            // Optional: Remove active class from all rows when stopping
            // irTableRows.forEach(row => row.classList.remove('active'));
        }
    }

    // Add click listeners to IR table rows
    if (irTableBody) {
        irTableRows.forEach((row, index) => {
            row.addEventListener('click', () => {
                irStopRotation(); // Stop auto-rotation on click
                irActivateRow(index); // Activate the clicked row
            });
        });
    }
    // *** END: IR Table Animation Logic ***


    // Original Service Activation Logic (Modified)
    function activateService(index) {
        if (index < 0 || index >= serviceSelectors.length) return;
        console.log('activateService called for index:', index); // Debug

        currentServiceIndex = index;
        const targetService = serviceSelectors[index].getAttribute('data-service');

        // Update selectors
        serviceSelectors.forEach(s => s.classList.remove('active'));
        serviceSelectors[index].classList.add('active');

        // Update visualizations & INTEGRATE IR TABLE START/STOP
        visualizationContents.forEach(content => {
            const serviceName = content.getAttribute('data-service');
            if (serviceName === targetService) {
                console.log('Activating visualization for:', serviceName); // Debug
                content.classList.add('active');
                // --- START/STOP IR TABLE --- >
                if (serviceName === 'fundraising') {
                    irStartRotation();
                } else {
                    irStopRotation();
                }
                // --- END START/STOP --- >
            } else {
                if (content.classList.contains('active')) {
                    console.log('Deactivating visualization for:', serviceName); // Debug
                    content.classList.remove('active');
                     // --- Ensure IR Table stops if fundraising is deactivated --- >
                    if (serviceName === 'fundraising') {
                         irStopRotation();
                    }
                    // --- END STOP --- >
                }
            }
        });
         console.log('Activated service visual:', targetService); // Original log kept for reference
    }

    function rotateService() {
        const nextIndex = (currentServiceIndex + 1) % serviceSelectors.length;
        activateService(nextIndex);
    }

    function startServiceRotation() {
        // Clear existing interval before starting a new one
        if (serviceRotationInterval) {
            clearInterval(serviceRotationInterval);
        }
        console.log('Starting service rotation interval');
        serviceRotationInterval = setInterval(rotateService, serviceRotationDelay); // Use renamed variable
    }

     // Initialize the first one as active
     const serviceAlreadyActiveSelector = document.querySelector('#service-selectors .offering-block.active');
     if (serviceAlreadyActiveSelector) {
         currentServiceIndex = Array.from(serviceSelectors).indexOf(serviceAlreadyActiveSelector);
         activateService(currentServiceIndex); // Ensure consistency & trigger initial IR start if needed
     } else if (serviceSelectors.length > 0) {
         activateService(0); // Activate the first one
     }

     // Add click listeners that also reset the timer
     serviceSelectors.forEach((selector, index) => {
         selector.addEventListener('click', function() {
             if (serviceRotationInterval) clearInterval(serviceRotationInterval); // Stop main rotation on click
             activateService(index);
             // Decide whether to restart main rotation after click or not
             // startServiceRotation(); // Uncomment to restart rotation after manual click
         });
     });

     // Start the initial rotation (Commented out as click/initial activation handles it)
     // if (serviceSelectors.length > 1) { 
     //    startServiceRotation();
     // }
});