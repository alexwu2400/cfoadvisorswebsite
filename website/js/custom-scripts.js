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
    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) {
         closeModal();
      }
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
      closeModal();
    }
  });

  const modalForm = document.getElementById('contact-modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Thank you! Your submission has been received (Placeholder)');
    });
  }
});

// Set Slackbot Time
document.addEventListener('DOMContentLoaded', function() {
  const accountabilityTimeElement = document.querySelector('.attribute-card[data-attribute="accountability"] #slackbot-current-time');
  const autonomyTimeElement = document.getElementById('slackbot-autonomy-time');
  const timestampElement = document.querySelector('.slackbot-attachment .slackbot-timestamp');

  function setTime(element) {
    if (element) {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' }).replace(" EDT", " EST");
        element.textContent = formattedTime;
    }
  }

  setTime(accountabilityTimeElement);
  setTime(autonomyTimeElement);

  if (timestampElement) {
    const now = new Date();
    const estOffset = -4 * 60;
    const estNow = new Date(now.getTime() + estOffset * 60000);
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
    slidesPerView: 1.2,
    spaceBetween: 15,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 16,
        centeredSlides: false,
      }
    }
  });
});

// New Hero Interaction Script
document.addEventListener('DOMContentLoaded', function() {
    const attributeItems = document.querySelectorAll('.attribute-item');
    const attributeCards = document.querySelectorAll('.attribute-card');
    const actualLine = document.querySelector('.line-graph-actual');

    const slideElements = document.querySelectorAll('#slideshow .slide');
    let currentSlideIndex = 0;
    const totalRotationTime = 4500;
    let slideShowIntervalId = null;
    const slideshowContainer = document.getElementById('slideshow');
    const firstSlide = slideElements.length > 0 ? slideElements[0] : null;

    function showNextSlide() {
        if (slideElements.length === 0) return;
        const previousSlideIndex = currentSlideIndex;
        currentSlideIndex = (currentSlideIndex + 1) % slideElements.length;
        slideElements.forEach(slide => slide.classList.remove('active', 'previous'));
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
        } else {
             // Maybe log warning or retry later
        }
    }

    let rotationInterval;
    const attributes = ['transparency', 'alignment', 'accountability', 'autonomy', 'velocity'];
    let currentAttributeIndex = attributes.indexOf('transparency');

    function activateAttribute(attribute) {
        if (slideShowIntervalId) {
            clearInterval(slideShowIntervalId);
            slideShowIntervalId = null;
        }

        attributeItems.forEach(item => item.classList.remove('active'));
        attributeCards.forEach(card => card.classList.remove('active'));

        if (actualLine) {
            actualLine.classList.remove('start-line-animation');
        }

        const accountabilityCard = document.querySelector('.attribute-card[data-attribute="accountability"]');
        if (accountabilityCard) {
            const slackbotVisualAcc = accountabilityCard.querySelector('.slackbot-visual');
            if (slackbotVisualAcc) slackbotVisualAcc.classList.remove('start-animation');
        }

        const autonomyCardReset = document.querySelector('.attribute-card[data-attribute="autonomy"]');
        const resourcesElementReset = autonomyCardReset?.querySelector('.slackbot-resources');
        if (resourcesElementReset) {
            resourcesElementReset.classList.remove('start-resources-animation');
        }

        if (slideElements.length > 0) {
            slideElements.forEach((slide, index) => {
                slide.classList.remove('active', 'previous');
                if (index === 0) slide.classList.add('active');
            });
             currentSlideIndex = 0;
        }

        const selectedItem = document.querySelector(`.attribute-item[data-attribute="${attribute}"]`);
        const selectedCard = document.querySelector(`.attribute-card[data-attribute="${attribute}"]`);

        if (selectedItem && selectedCard) {
            selectedItem.classList.add('active');
            selectedCard.classList.add('active');

            if (attribute === 'transparency' && actualLine) {
                actualLine.classList.remove('start-line-animation');
                void actualLine.offsetWidth;
                actualLine.classList.add('start-line-animation');
            } else if (attribute === 'accountability') {
                const slackbotVisual = selectedCard?.querySelector('.slackbot-visual');
                if (slackbotVisual) {
                    slackbotVisual.classList.remove('start-animation');
                    void slackbotVisual.offsetWidth;
                    slackbotVisual.classList.add('start-animation');
                }
            } else if (attribute === 'autonomy') {
                const resourcesElement = selectedCard.querySelector('.slackbot-resources');
                if (resourcesElement) {
                    void resourcesElement.offsetWidth;
                    resourcesElement.classList.add('start-resources-animation');
                }
                const autonomyTimeElement = document.getElementById('slackbot-current-time');
                setTime(autonomyTimeElement);
            } else if (attribute === 'alignment' && slideElements.length > 0) {
                currentSlideIndex = 0;
                setContainerHeight();
                const singleSlideDuration = totalRotationTime / slideElements.length;
                slideShowIntervalId = setInterval(showNextSlide, singleSlideDuration);
            }
        }
    }

    function startRotation() {
        if (rotationInterval) clearInterval(rotationInterval);
        rotationInterval = setInterval(autoRotate, totalRotationTime);
    }

    function autoRotate() {
        if (slideShowIntervalId) {
            clearInterval(slideShowIntervalId);
            slideShowIntervalId = null;
        }
        currentAttributeIndex = (currentAttributeIndex + 1) % attributes.length;
        activateAttribute(attributes[currentAttributeIndex]);
    }

    attributeItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (rotationInterval) {
                clearInterval(rotationInterval);
                rotationInterval = null;
            }
            const attribute = this.getAttribute('data-attribute');
            currentAttributeIndex = attributes.indexOf(attribute);
            activateAttribute(attribute);
            startRotation();
        });
    });

    function setTime(element) {
        if (element) {
            const now = new Date();
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
            const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
            element.textContent = formattedTime;
        }
    }

    startRotation();
});

// Animated ARR Chart Script
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('transparency-chart-container');
  if (!container) return;

  const data = [
      { month: 'Jan', value: 40 }, { month: 'Feb', value: 70 }, { month: 'Mar', value: 60, event: 'Paid Ads' },
      { month: 'Apr', value: 90 }, { month: 'May', value: 140 }, { month: 'Jun', value: 110, event: 'Legacy Churn' },
      { month: 'Jul', value: 180 }, { month: 'Aug', value: 170, event: 'Launched Self Serve' }, { month: 'Sep', value: 200 },
      { month: 'Oct', value: 210 }, { month: 'Nov', value: 230 }, { month: 'Dec', value: 250 }
  ];
  const targetData = [
      { month: 'Jan', value: 40 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 65 }, { month: 'Apr', value: 80 },
      { month: 'May', value: 90 }, { month: 'Jun', value: 105 }, { month: 'Jul', value: 120 }, { month: 'Aug', value: 135 },
      { month: 'Sep', value: 155 }, { month: 'Oct', value: 175 }, { month: 'Nov', value: 195 }, { month: 'Dec', value: 220 }
  ];

  const svg = container.querySelector('.chart-svg');
  if (!svg) return;

  const svgWidth = 500, svgHeight = 300;
  const margin = { top: 20, right: 10, bottom: 40, left: 30 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const xScale = (index) => margin.left + index * (width / (data.length - 1));
  const yScale = (value) => margin.top + height - (value / 250) * height;

  const xAxisGroup = svg.querySelector('.x-axis');
  const yAxisGroup = svg.querySelector('.y-axis');
  const gridGroup = svg.querySelector('.grid');
  const calloutGroup = svg.querySelector('.callouts');

  const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxisLine.setAttribute('x1', margin.left); yAxisLine.setAttribute('y1', margin.top);
  yAxisLine.setAttribute('x2', margin.left); yAxisLine.setAttribute('y2', margin.top + height);
  yAxisGroup.appendChild(yAxisLine);

  const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxisLine.setAttribute('x1', margin.left); xAxisLine.setAttribute('y1', margin.top + height);
  xAxisLine.setAttribute('x2', margin.left + width); xAxisLine.setAttribute('y2', margin.top + height);
  xAxisGroup.appendChild(xAxisLine);

  [0, 50, 100, 150, 200, 250].forEach(tick => {
      const y = yScale(tick);
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('class', 'grid-line');
      gridLine.setAttribute('x1', margin.left); gridLine.setAttribute('y1', y);
      gridLine.setAttribute('x2', margin.left + width); gridLine.setAttribute('y2', y);
      gridGroup.appendChild(gridLine);
  });

  data.forEach((d, i) => {
      if (i % 2 === 0) {
          const x = xScale(i);
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          label.setAttribute('x', x); label.setAttribute('y', margin.top + height + 30);
          label.setAttribute('text-anchor', 'middle'); label.textContent = d.month;
          label.style.fontSize = '24px';
          xAxisGroup.appendChild(label);
      }
  });

  data.forEach((d, i) => {
      if (d.event) {
          const startX = xScale(i), startY = yScale(d.value);
          let endYOffset = -40, textYOffset = -6;
          if (d.event === 'Legacy Churn') { endYOffset = 40; textYOffset = 15; }
          const endX = startX, endY = startY + endYOffset, textY = endY + textYOffset;
          let textX = endX; 

          const calloutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          calloutLine.setAttribute('class', 'callout-line'); calloutLine.setAttribute('id', `callout-line-${i}`);
          calloutLine.setAttribute('x1', startX); calloutLine.setAttribute('y1', startY);
          calloutLine.setAttribute('x2', startX); calloutLine.setAttribute('y2', startY);
          calloutGroup.appendChild(calloutLine);

          const calloutText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          calloutText.setAttribute('class', 'callout'); calloutText.setAttribute('id', `callout-${i}`);
          calloutText.setAttribute('x', textX); calloutText.setAttribute('y', textY);
          calloutText.textContent = d.event;

          const lastEventIndex = data.map(item => item.event).lastIndexOf(d.event);
          if (i === data.length - 1 || (i === lastEventIndex && i > data.length / 2)) {
                calloutText.setAttribute('text-anchor', 'end');
                textX = endX - 5;
                calloutText.setAttribute('x', textX);
          }
          calloutGroup.appendChild(calloutText);

          const lineLength = Math.abs(endY - startY);
          calloutLine.setAttribute('x2', endX); calloutLine.setAttribute('y2', endY);
          calloutLine.style.strokeDasharray = lineLength;
          calloutLine.style.strokeDashoffset = lineLength;
      }
  });

  const targetLinePath = svg.querySelector('.target-line');
  const targetPathData = targetData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.value)}`).join(' ');
  targetLinePath.setAttribute('d', targetPathData);

  const arrLinePath = svg.querySelector('.arr-line');
  const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.value)}`).join(' ');
  arrLinePath.setAttribute('d', pathData);

  let animationTimeouts = [];

  function resetCalloutAnimations() {
    svg.querySelectorAll('.callout-line, .callout').forEach(el => {
        el.style.animation = 'none';
        el.style.opacity = 0;
        if (el.classList.contains('callout-line')) {
             const lineLength = parseFloat(el.getAttribute('data-line-length') || 0);
             el.style.strokeDashoffset = lineLength;
        }
    });
    animationTimeouts.forEach(clearTimeout);
    animationTimeouts = [];
  }

  const lineLength = arrLinePath.getTotalLength();
  arrLinePath.style.strokeDasharray = lineLength;
  arrLinePath.style.strokeDashoffset = lineLength;

  function startArrAnimation() {
      arrLinePath.style.strokeDashoffset = lineLength;
      arrLinePath.style.animation = 'none';
      svg.querySelector('.arr-endpoint').style.opacity = 0;
      resetCalloutAnimations();

      requestAnimationFrame(() => {
          requestAnimationFrame(() => {
              arrLinePath.style.animation = 'drawLine 2s ease-out forwards';

              const arrEndpoint = svg.querySelector('.arr-endpoint');
              const animationEndHandler = () => {
                  const endPoint = data[data.length - 1];
                  const endX = xScale(data.length - 1), endY = yScale(endPoint.value);
                  arrEndpoint.setAttribute('cx', endX); arrEndpoint.setAttribute('cy', endY);
                  arrEndpoint.style.opacity = 1;
                  arrLinePath.removeEventListener('animationend', animationEndHandler);
              };
              arrLinePath.removeEventListener('animationend', animationEndHandler);
              arrLinePath.addEventListener('animationend', animationEndHandler, { once: true });

              const mainAnimationDuration = 2.0;
              const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

              data.forEach((d, i) => {
                  if (d.event) {
                      const calloutLine = svg.querySelector(`#callout-line-${i}`);
                      const calloutText = svg.querySelector(`#callout-${i}`);
                      if (calloutLine && calloutText) {
                          const segmentPathData = data.slice(0, i + 1).map((pd, pi) => `${pi === 0 ? 'M' : 'L'}${xScale(pi)},${yScale(pd.value)}`).join(' ');
                          tempPath.setAttribute('d', segmentPathData);
                          const segmentLength = tempPath.getTotalLength();
                          const delay = (segmentLength / lineLength) * mainAnimationDuration;

                          calloutLine.style.opacity = 0;
                          const calloutLineLength = parseFloat(calloutLine.getAttribute('data-line-length') || 0);
                          calloutLine.style.strokeDashoffset = calloutLineLength;
                          calloutText.style.opacity = 0;

                          const timeoutId = setTimeout(() => {
                              calloutLine.style.animation = 'drawLine 0.4s ease-out forwards, fadeIn 0.3s ease-in forwards';
                              calloutText.style.animation = 'fadeIn 0.5s ease-in forwards';
                              calloutLine.style.opacity = 1;
                              calloutText.style.opacity = 1;
                          }, delay * 1000);
                          animationTimeouts.push(timeoutId);
                      }
                  }
              });
          });
      });
  }

  data.forEach((d, i) => {
      if (d.event) {
          const calloutLine = svg.querySelector(`#callout-line-${i}`);
          if (calloutLine) {
              const x1 = parseFloat(calloutLine.getAttribute('x1')), y1 = parseFloat(calloutLine.getAttribute('y1'));
              const x2 = parseFloat(calloutLine.getAttribute('x2')), y2 = parseFloat(calloutLine.getAttribute('y2'));
              const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              calloutLine.setAttribute('data-line-length', length);
              calloutLine.style.strokeDasharray = length;
              calloutLine.style.strokeDashoffset = length;
              calloutLine.style.opacity = 0;
          }
          const calloutText = svg.querySelector(`#callout-${i}`);
          if(calloutText) calloutText.style.opacity = 0;
      }
  });

  const cardElement = container.closest('.attribute-card');
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (cardElement.classList.contains('active')) {
                  startArrAnimation();
              } else {
                   arrLinePath.style.animation = 'none';
                   arrLinePath.style.strokeDashoffset = lineLength;
                   svg.querySelector('.arr-endpoint').style.opacity = 0;
                   resetCalloutAnimations();
              }
          }
      });
  });

  if (cardElement) {
       observer.observe(cardElement, { attributes: true });
       if (cardElement.classList.contains('active')) startArrAnimation();
  } else {
       startArrAnimation();
  }
});

// Plexus Background Script
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('plexus-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 80 };

    const baseParticleColor = '255, 255, 255';
    const baseLineColor = '255, 255, 255';
    const baseParticleRadius = 2.0;
    const connectionDistance = 60;
    const baseParticleSpeed = 0.25;
    const depthFactor = 0.6;
    const edgeFadeDistance = 50;
    const mouseEffectStrength = 0.03;
    const baseParticleOpacity = 0.15;
    const brightnessBoostFactor = 0.5;
    const baseLineOpacityFactor = 0.8;
    let particleCount = 100;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        particleCount = Math.max(96, Math.min(288, Math.floor((canvas.width * canvas.height) / 6000 * 0.8))); 
        initParticles();
        if (animationFrameId) startAnimation();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            const yRatio = Math.random();
            const speedMultiplier = (1 - yRatio * depthFactor * 0.5);
            particles.push({
                x: Math.random() * canvas.width, y: yRatio * canvas.height, baseYRatio: yRatio,
                vx: (Math.random() - 0.5) * baseParticleSpeed * speedMultiplier,
                vy: (Math.random() - 0.5) * baseParticleSpeed * speedMultiplier,
                radius: baseParticleRadius * (1 - yRatio * depthFactor), opacity: 0, totalDistOpacityBoost: 0
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.totalDistOpacityBoost = 0);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const distOpacity = 1 - (dist / connectionDistance);
                    p.totalDistOpacityBoost += distOpacity;
                    p2.totalDistOpacityBoost += distOpacity;

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
                    const depthOpacity = (1 - avgDepth * depthFactor * 0.5);
                    const finalLineOpacity = distOpacity * avgEdgeOpacity * depthOpacity * baseLineOpacityFactor;

                    if (finalLineOpacity > 0.01) {
                        ctx.strokeStyle = `rgba(${baseLineColor}, ${finalLineOpacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
            }
        }

        particles.forEach(p => {
             let influenceX = 0, influenceY = 0;
             if (mouse.x !== null) {
                 const dxMouse = p.x - mouse.x, dyMouse = p.y - mouse.y;
                 const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                 if (distMouse < mouse.radius) {
                     const force = (mouse.radius - distMouse) / mouse.radius;
                     influenceX = (dxMouse / distMouse) * force * mouseEffectStrength;
                     influenceY = (dyMouse / distMouse) * force * mouseEffectStrength;
                 }
             }
             p.x += p.vx + influenceX;
             p.y += p.vy + influenceY;

             let edgeOpacity = 1.0;
             if (p.x < edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, p.x / edgeFadeDistance);
             else if (p.x > canvas.width - edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, (canvas.width - p.x) / edgeFadeDistance);
             if (p.y < edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, p.y / edgeFadeDistance);
             else if (p.y > canvas.height - edgeFadeDistance) edgeOpacity = Math.min(edgeOpacity, (canvas.height - p.y) / edgeFadeDistance);
             p.opacity = edgeOpacity;

             if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
             if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

             const averageConnections = connectionDistance / 20;
             const boost = (p.totalDistOpacityBoost / averageConnections) * brightnessBoostFactor;
             const finalParticleOpacity = Math.min(1, baseParticleOpacity + boost) * p.opacity;

             ctx.fillStyle = `rgba(${baseParticleColor}, ${finalParticleOpacity})`;
             ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        });

        animationFrameId = requestAnimationFrame(draw);
    }

    function startAnimation() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });

    resizeCanvas();
    startAnimation();
});

// Interactive Services Section Script
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelectors = document.querySelectorAll('#service-selectors .offering-block');
    const visualizationContents = document.querySelectorAll('#service-visualization-area .service-visualization-content');
    let currentServiceIndex = 0;
    let serviceRotationInterval = null;
    const serviceRotationDelay = 3000;

    const irTableBody = document.querySelector('#ir-framework-table tbody');
    const irTableRows = irTableBody ? Array.from(irTableBody.querySelectorAll('tr')) : [];
    let irCurrentRowIndex = 0;
    let irIntervalId = null;
    const irRotationDelay = 1500;

    function irActivateRow(index) {
        if (!irTableBody || index < 0 || index >= irTableRows.length) return;
        irTableRows.forEach((row, i) => row.classList.toggle('active', i === index));
        irCurrentRowIndex = index;
    }

    function irStartRotation() {
        if (!irTableBody || irIntervalId) return;
        if (irTableRows.length > 0) {
            irActivateRow(irCurrentRowIndex);
            irIntervalId = setInterval(() => {
                const nextIndex = (irCurrentRowIndex + 1) % irTableRows.length;
                irActivateRow(nextIndex);
            }, irRotationDelay);
        }
    }

    function irStopRotation() {
        if (irIntervalId) {
            clearInterval(irIntervalId);
            irIntervalId = null;
        }
    }

    if (irTableBody) {
        irTableRows.forEach((row, index) => {
            row.addEventListener('click', () => {
                irStopRotation();
                irActivateRow(index);
            });
        });
    }

    const visualizationArea = document.getElementById('service-visualization-area'); // Get the container

    function activateService(index) {
        if (index < 0 || index >= serviceSelectors.length) return;
        currentServiceIndex = index;
        const targetService = serviceSelectors[index].getAttribute('data-service');

        // Add/Remove class for height adjustment
        if (targetService === 'planning') {
            visualizationArea?.classList.add('planning-active');
            visualizationArea?.classList.remove('fundraising-active'); // Remove other class
        } else if (targetService === 'fundraising') {
            visualizationArea?.classList.add('fundraising-active');
            visualizationArea?.classList.remove('planning-active'); // Remove other class
        } else {
            visualizationArea?.classList.remove('planning-active');
            visualizationArea?.classList.remove('fundraising-active'); // Remove for other services too
        }

        serviceSelectors.forEach(s => s.classList.remove('active'));
        serviceSelectors[index].classList.add('active');

        visualizationContents.forEach(content => {
            const serviceName = content.getAttribute('data-service');
            const isTarget = (serviceName === targetService);
            const wasActive = content.classList.contains('active');

            if (isTarget && !wasActive) {
                // Becoming Active
                content.classList.add('active');
                if (serviceName === 'fundraising') irStartRotation();
                else if (serviceName === 'planning') {
                    if (!financialModelInstance) {
                        console.log("[FM Debug] Initializing financial model instance.");
                        financialModelInstance = initializeFinancialModel('embedded-financial-model');
                } else {
                        console.log("[FM Debug] Financial model instance exists, calling start().");
                        financialModelInstance.start();
                    }
                }
            } else if (!isTarget && wasActive) {
                // Becoming Inactive
                    content.classList.remove('active');
                if (serviceName === 'fundraising') irStopRotation();
                else if (serviceName === 'planning') {
                    if (financialModelInstance) {
                        console.log("[FM Debug] Destroying financial model instance.");
                        financialModelInstance.destroy();
                        financialModelInstance = null;
                    } else {
                        // No action needed if already null
                    }
                }
            }
        });
    }

    function rotateService() {
        const nextIndex = (currentServiceIndex + 1) % serviceSelectors.length;
        activateService(nextIndex);
    }

    function startServiceRotation() {
        if (serviceRotationInterval) clearInterval(serviceRotationInterval);
        serviceRotationInterval = setInterval(rotateService, serviceRotationDelay);
    }

     // Initialize the first one as active
     const serviceAlreadyActiveSelector = document.querySelector('#service-selectors .offering-block.active');
    let initialTargetService = null; // Variable to store the initially active service

     if (serviceAlreadyActiveSelector) {
         currentServiceIndex = Array.from(serviceSelectors).indexOf(serviceAlreadyActiveSelector);
        initialTargetService = serviceAlreadyActiveSelector.getAttribute('data-service'); // Get the initial service name
         activateService(currentServiceIndex); // Ensure consistency & trigger initial IR start if needed
     } else if (serviceSelectors.length > 0) {
        currentServiceIndex = 0; // Default to first if none is marked active
        initialTargetService = serviceSelectors[0].getAttribute('data-service');
         activateService(0); // Activate the first one
     }

    // --- ADDED: Explicit initialization for default active planning service ---
    if (initialTargetService === 'planning') {
        if (!financialModelInstance) {
           console.log("[FM Debug] Initializing financial model on page load.");
           financialModelInstance = initializeFinancialModel('embedded-financial-model');
        } else {
           // This case shouldn't normally happen on initial load, but good to handle
           console.log("[FM Debug] FM instance exists on load check, starting.");
           financialModelInstance.start();
        }
    }
    // --- END ADDED Section ---

     // Add click listeners that also reset the timer
     serviceSelectors.forEach((selector, index) => {
         selector.addEventListener('click', function() {
            if (serviceRotationInterval) clearInterval(serviceRotationInterval);
             activateService(index);
        });
     });
     
     // Start automatic rotation
     startServiceRotation();
});

// Find the service section JavaScript that handles tab switching
document.addEventListener('DOMContentLoaded', function() {
    // Service selection functionality
    const serviceSelectors = document.querySelectorAll('#service-selectors .offering-block');
    const serviceVisualizations = document.querySelectorAll('.service-visualization-content');
    const visualizationArea = document.getElementById('service-visualization-area');
    
    // Don't add duplicate click handlers - they're already handled above
    // This function is now just a fallback
});

// --- Financial Model Script --- //
function initializeFinancialModel(containerId) {
    console.log(`[FM Debug INIT] Initialize called for: ${containerId}`);
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
        return null;
    }

    const numberAnimationDuration = 800;
    const updateIntervalTime = 2500;
    const quartersPerYear = 4;
    const totalYears = 5;
    const totalQuarters = totalYears * quartersPerYear;
    const startYear = 2024;
    const actualSuffix = 'A', estimatedSuffix = 'E';
    const yearHeaders = ["Metric", "2024A", "2025E", "2026E", "2027E", "2028E"];
    const yearIndices = {};
    yearHeaders.forEach((year, index) => { yearIndices[year] = index; });

    const allCounters = containerElement.querySelectorAll('.financial-summary td[data-value]');
    const arrChartContainer = containerElement.querySelector('#arr-chart .arr-bars');
    const cashflowChartContainer = containerElement.querySelector('#cashflow-chart .cashflow-bars');
    const arrLabelsContainer = containerElement.querySelector('#arr-chart .arr-labels');
    const cashflowLabelsContainer = containerElement.querySelector('#cashflow-chart .cashflow-labels');
    const tableBody = containerElement.querySelector('.financial-summary tbody');

    let currentScenario = 1;
    let mainUpdateInterval = null;
    let resizeTimer = null;

    const quarterlyDataStore = {
        scenario1: {
            arr: [0.25,0.5,0.75,1,1.78,2.56,3.34,4.12,4.8,6.3,7.8,9.3,9.8,11.1,12.4,13.7,15.55,18.1,20.65,23.2].map(v=>v*1e6),
            cashflow: [-0.12,-0.14,-0.15,-0.18,-0.28,-0.39,-0.46,-0.56,-0.6,-0.66,-0.72,-0.73,-0.25,0.1,0.3,0.45,0.55,0.9,1.25,1.96].map(v=>v*1e6)
        },
        scenario2: {
            arr: [0.25,0.5,0.75,1,1.34,1.68,2.02,2.36,3.07,4.13,5.2,6.26,7.08,8.28,9.48,10.68,12.18,14.16,16.14,18.12].map(v=>v*1e6),
            cashflow: [-0.12,-0.14,-0.15,-0.19,-0.4,-0.55,-0.7,-0.93,-1.05,-1.18,-1.3,-1.54,-1.1,-0.85,-0.65,-0.36,-0.32,-0.4,-0.45,-0.4].map(v=>v*1e6)
        }
    };
    const scenarios = { scenario1: {}, scenario2: {
        "BeginningARR_2025E":1,"NewARR_2025E":1.36,"ExpansionARR_2025E":.04,"ChurnedARR_2025E":-.12,"EndingARR_2025E":2.28,"ARRGrowthPct_2025E":128,"GrossRetentionPct_2025E":88,"NetRetentionPct_2025E":92,"AverageContractValueK_2025E":31.6,"EndingCustomers_2025E":72,"Revenue_2025E":1.64,"COGS_2025E":.377,"GrossProfit_2025E":1.263,"GrossMarginPct_2025E":77,"TotalR&D_2025E":1.6,"TotalS&M_2025E":1.85,"TotalG&A_2025E":.52,"TotalOperatingExp_2025E":3.97,"NetIncome_2025E":-2.677,"EndingCash_2025E":-1.262,"AvgMonthlyBurn_2025E":((-0.4-0.55-0.7-0.93)/4).toFixed(3),"TotalHeadcount_2025E":36,"ARRperHead_2025E":(63).toFixed(1),
        "BeginningARR_2026E":2.28,"NewARR_2026E":3.97,"ExpansionARR_2026E":.25,"ChurnedARR_2026E":-.3,"EndingARR_2026E":6.2,"ARRGrowthPct_2026E":171.9,"GrossRetentionPct_2026E":86.8,"NetRetentionPct_2026E":97.8,"AverageContractValueK_2026E":34,"EndingCustomers_2026E":182,"Revenue_2026E":4.24,"COGS_2026E":.975,"GrossProfit_2026E":3.265,"GrossMarginPct_2026E":77,"TotalR&D_2026E":3.3,"TotalS&M_2026E":3.66,"TotalG&A_2026E":1.37,"TotalOperatingExp_2026E":8.33,"NetIncome_2026E":-5.065,"EndingCash_2026E":-6.327,"AvgMonthlyBurn_2026E":((-1.05-1.18-1.3-1.54)/4).toFixed(3),"TotalHeadcount_2026E":70,"ARRperHead_2026E":(89).toFixed(1),
        "BeginningARR_2027E":6.2,"NewARR_2027E":4.9,"ExpansionARR_2027E":.9,"ChurnedARR_2027E":-.6,"EndingARR_2027E":11.4,"ARRGrowthPct_2027E":83.9,"GrossRetentionPct_2027E":90.3,"NetRetentionPct_2027E":104.8,"AverageContractValueK_2027E":37,"EndingCustomers_2027E":308,"Revenue_2027E":8.8,"COGS_2027E":1.936,"GrossProfit_2027E":6.864,"GrossMarginPct_2027E":78,"TotalR&D_2027E":3.38,"TotalS&M_2027E":3.99,"TotalG&A_2027E":2,"TotalOperatingExp_2027E":9.37,"NetIncome_2027E":-2.516,"EndingCash_2027E":-8.843,"AvgMonthlyBurn_2027E":((-1.1-0.85-0.65-0.36)/4).toFixed(3),"TotalHeadcount_2027E":100,"ARRperHead_2027E":(114).toFixed(1),
        "BeginningARR_2028E":11.4,"NewARR_2028E":7.64,"ExpansionARR_2028E":2.09,"ChurnedARR_2028E":-.93,"EndingARR_2028E":20.2,"ARRGrowthPct_2028E":77.2,"GrossRetentionPct_2028E":91.8,"NetRetentionPct_2028E":110.2,"AverageContractValueK_2028E":40,"EndingCustomers_2028E":505,"Revenue_2028E":15.8,"COGS_2028E":3.476,"GrossProfit_2028E":12.324,"GrossMarginPct_2028E":78,"TotalR&D_2028E":4.56,"TotalS&M_2028E":5.68,"TotalG&A_2028E":3.67,"TotalOperatingExp_2028E":13.91,"NetIncome_2028E":-1.566,"EndingCash_2028E":-10.409,"AvgMonthlyBurn_2028E":((-0.32-0.4-0.45-0.4)/4).toFixed(3),"TotalHeadcount_2028E":140,"ARRperHead_2028E":(144).toFixed(1)
    }};

    const storeScenario1AnnualValues = () => {
         scenarios.scenario1 = {};
         if (!tableBody) return;
         tableBody.querySelectorAll('tr[data-metric]').forEach(row => {
             const metricName = row.getAttribute('data-metric');
             if (!metricName) return;
             row.querySelectorAll('td[data-value]').forEach((cell, index) => {
                 const yearHeaderIndex = index + 1;
                 if (yearHeaderIndex >= 1 && yearHeaderIndex < yearHeaders.length) {
                     const year = yearHeaders[yearHeaderIndex];
                     scenarios.scenario1[`${metricName}_${year}`] = cell.getAttribute('data-value');
                 }
             });
         });
     };

    const formatNumber = (rawValue, unit) => {
        if (typeof rawValue === 'string' && rawValue.toLowerCase() === 'profitable') return 'Profitable';
        const numericValue = parseFloat(rawValue);
        if (isNaN(numericValue) || rawValue === null || rawValue === 'null') return '–';
        let displayValue, baseValueForSign = numericValue, addParensForNegative = false, prefix = '', suffix = '';
        switch (unit) {
            case '$ MM': baseValueForSign*=1e6; displayValue=Math.abs(numericValue).toFixed(1); addParensForNegative=true; prefix='$ '; suffix='M'; break;
            case '$ MM/month': baseValueForSign*=1e6; displayValue=Math.abs(numericValue)<1?(Math.abs(numericValue)*1e3).toFixed(0):Math.abs(numericValue).toFixed(1); suffix=Math.abs(numericValue)<1?'K':'M'; addParensForNegative=true; prefix='$ '; break;
            case '$ K': baseValueForSign*=1e3; displayValue=Math.abs(numericValue).toFixed(1); addParensForNegative=true; prefix='$ '; suffix='K'; break;
            case '%': displayValue=Math.round(numericValue).toFixed(0); suffix='%'; break;
            case 'count': case 'FTE': displayValue=Math.round(numericValue).toLocaleString(undefined,{maximumFractionDigits:0}); break;
            case '$': baseValueForSign*=1e3; displayValue=Math.round(numericValue).toLocaleString(undefined,{maximumFractionDigits:0}); prefix='$ '; suffix='K'; break;
            default: displayValue=numericValue.toLocaleString(undefined,{maximumFractionDigits:1});
        }
        let formattedString = `${prefix}${displayValue}${suffix}`;
        return baseValueForSign<0&&addParensForNegative?`(${formattedString.trim()})`:formattedString;
    };

    const parseFormattedNumber = (formattedString) => {
        if (typeof formattedString !== 'string') return NaN;
        let cleanString = formattedString.trim();
        if (cleanString === '–' || cleanString === 'N/A' || cleanString.toLowerCase() === 'profitable') return NaN;
        let rawValue = NaN, isNegative = false;
        if (cleanString.startsWith('(') && cleanString.endsWith(')')) { isNegative=true; cleanString=cleanString.substring(1,cleanString.length-1); }
        if (cleanString.startsWith('$')) cleanString=cleanString.substring(1).trim();
        if (cleanString.endsWith('M')) cleanString=cleanString.substring(0,cleanString.length-1);
        else if (cleanString.endsWith('K')) cleanString=cleanString.substring(0,cleanString.length-1);
        else if (cleanString.endsWith('%')) cleanString=cleanString.substring(0,cleanString.length-1);
        cleanString = cleanString.replace(/,/g,'');
        rawValue = parseFloat(cleanString);
        if (isNaN(rawValue)) return NaN;
        return isNegative?-rawValue:rawValue;
    };

    const findRowByMetric = (metric) => tableBody ? tableBody.querySelector(`tr[data-metric="${metric}"]`) : null;

    const calculateAndSetARRperHead = () => {
        const endingArrRow = findRowByMetric('EndingARR');
        const headcountRow = findRowByMetric('TotalHeadcount');
        const arrPerHeadRow = findRowByMetric('ARRperHead');
        if (!endingArrRow || !headcountRow || !arrPerHeadRow) return;
        const arrCells = endingArrRow.querySelectorAll('td[data-value]'), headcountCells = headcountRow.querySelectorAll('td[data-value]'), arrPerHeadCells = arrPerHeadRow.querySelectorAll('td[data-value]');
        if (arrCells.length !== 5 || headcountCells.length !== 5 || arrPerHeadCells.length !== 5) return;
        for (let i = 0; i < 5; i++) {
            const endingArrValue = parseFloat(arrCells[i].getAttribute('data-value'));
            const totalHeadcount = parseFloat(headcountCells[i].getAttribute('data-value'));
            let calculatedArrPerHeadDollars = NaN;
            if (!isNaN(endingArrValue) && !isNaN(totalHeadcount) && totalHeadcount !== 0) {
                 calculatedArrPerHeadDollars = (endingArrValue * 1e6) / totalHeadcount;
            }
            const newValue = isNaN(calculatedArrPerHeadDollars) ? 'null' : (calculatedArrPerHeadDollars / 1000).toFixed(1);
            arrPerHeadCells[i].setAttribute('data-value', newValue);
        }
    };

    const animateCountUp = (el) => {
        if (!el) return;

        // --- ADDED: Cancel existing animation frame for this element --- >
        if (el._animationFrameId) {
            cancelAnimationFrame(el._animationFrameId);
            // console.log(`[FM Debug ANIM] Canceled previous animation for element:`, el);
        }
        // --- END ADDED --- >

        const parentRow = el.closest('tr');
        if (!parentRow) return;
        let dataValueStr = el.getAttribute('data-value');
        const unit = parentRow.getAttribute('data-unit') || '';
        if (dataValueStr === 'null' || dataValueStr === null || dataValueStr === undefined || dataValueStr.toLowerCase() === 'profitable') {
            el.textContent = formatNumber(dataValueStr, unit);
            return;
        }
        let targetRawValue = parseFloat(dataValueStr);
        if (isNaN(targetRawValue)) {
            el.textContent = formatNumber('null', unit);
            return;
        }
        let startTimestamp = null;
        let startRawValue = parseFormattedNumber(el.textContent);
        if (isNaN(startRawValue)) startRawValue = 0;
        const endRawValue = targetRawValue;
        if (Math.abs(startRawValue - endRawValue) < 0.01) {
            el.textContent = formatNumber(endRawValue, unit);
            return;
        }
        try { el.textContent = formatNumber(startRawValue, unit); } catch(e) { el.textContent = "Err"; }

        const step = (timestamp) => {
            try {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / numberAnimationDuration, 1);
                let currentAnimatedRawVal = progress * (endRawValue - startRawValue) + startRawValue;
                el.textContent = formatNumber(currentAnimatedRawVal, unit);
                if (progress < 1) {
                    el._animationFrameId = window.requestAnimationFrame(step); // Store the new ID
                } else {
                    el.textContent = formatNumber(targetRawValue, unit);
                    delete el._animationFrameId; // Clean up property
                }
            } catch(e) {
                 try { el.textContent = formatNumber(endRawValue, unit); } catch {}
                 delete el._animationFrameId; // Clean up on error too
            }
        };
        el._animationFrameId = window.requestAnimationFrame(step); // Store the initial ID
    };

    const generateQuarterlyLabels = () => {
        const labels = [];
        for (let y=0; y<totalYears; y++) {
            const currentYear=startYear+y, suffix=y===0?actualSuffix:estimatedSuffix;
            for (let q=1; q<=quartersPerYear; q++) labels.push(`Q${q} ${currentYear}${suffix}`);
        }
        return labels;
    };

    const getChartData = () => {
        const scenarioKey = `scenario${currentScenario}`;
        const labels = generateQuarterlyLabels();
        const arrValues = quarterlyDataStore[scenarioKey]?.arr || [];
        const cashflowValues = quarterlyDataStore[scenarioKey]?.cashflow || [];
        if (arrValues.length !== totalQuarters || cashflowValues.length !== totalQuarters) {
            console.error(`[Financial Model ERROR] Data length mismatch for ${scenarioKey}.`);
            return { arrData:{labels,values:Array(totalQuarters).fill(0)}, cashflowData:{labels,values:Array(totalQuarters).fill(0)}};
        }
        return { arrData:{labels, values:arrValues}, cashflowData:{labels, values:cashflowValues} };
    };

    const createChartBars = (data, container, labelsContainer, isCashflow = false) => {
        const chartType = isCashflow ? 'Cashflow' : 'ARR';
        if (!container || !labelsContainer || !data || !data.values || data.values.length === 0 || data.values.length !== data.labels.length) {
            console.log(`[FM Debug BAR] Chart (${chartType}) generation skipped: Missing data/elements.`);
            return;
        }
        container.innerHTML = ''; labelsContainer.innerHTML = '';
        console.log(`[FM Debug BAR] Creating bars for ${chartType} chart.`);

        const fragment=document.createDocumentFragment(), labelFragment=document.createDocumentFragment();
        const values=data.values, labels=data.labels, barCount=values.length;
        const allValues=values.map(v=>v||0);
        let maxVal=0, minVal=0;
        if (isCashflow) { maxVal=Math.max(0,...allValues); minVal=Math.min(0,...allValues); } else { maxVal=Math.max(...allValues); minVal=0; }
        const maxAbsValue=Math.max(Math.abs(maxVal),Math.abs(minVal),1);
        const containerWidth=container.offsetWidth, containerHeight=container.offsetHeight;

        if (containerWidth<=0||containerHeight<=0) {
            console.log(`[FM Debug BAR] Chart (${chartType}) container zero dimensions: W=${containerWidth} H=${containerHeight}`);
            return;
        }
        console.log(`[FM Debug BAR] Chart (${chartType}) dimensions: W=${containerWidth} H=${containerHeight}`);

        const barSpacing=containerWidth/barCount, barWidth=Math.max(2,barSpacing*0.6), barGap=barSpacing-barWidth;
        let zeroLineBottomPercent=50;
        if (isCashflow) {
            const dataRange=maxVal-minVal;
            if (dataRange>1) zeroLineBottomPercent=Math.max(20,Math.min(80,(Math.abs(minVal)/dataRange)*100));
            else if (maxVal===0&&minVal===0) zeroLineBottomPercent=50;
            else if (maxVal>0) zeroLineBottomPercent=20;
            else zeroLineBottomPercent=80;
        }
        let scalePositive=100/maxAbsValue, scaleNegative=100/maxAbsValue;
        if (isCashflow&&maxAbsValue>0) { scalePositive=maxVal>0?(100-zeroLineBottomPercent)/maxVal:0; scaleNegative=minVal<0?zeroLineBottomPercent/Math.abs(minVal):0; }

        values.forEach((value,index)=>{const bar=document.createElement('div');bar.classList.add('bar');const itemValue=value||0;let heightPercentage=0,bottomPositionPercent=0,topPositionPercent=null;
            // Log class assignment for cashflow bars
            let barClass = 'default';
            if(isCashflow){
                if(itemValue>=0){
                    bar.classList.add('positive');
                    bar.classList.remove('negative');
                    barClass = 'positive'; // For logging
                    bottomPositionPercent=zeroLineBottomPercent;topPositionPercent=null;heightPercentage=itemValue*scalePositive;bar.style.backgroundColor='var(--excel-positive-green)'
                } else {
                    bar.classList.add('negative');
                    bar.classList.remove('positive');
                    barClass = 'negative'; // For logging
                    topPositionPercent=100-zeroLineBottomPercent;bottomPositionPercent=null;heightPercentage=Math.min(Math.abs(itemValue)*scaleNegative,zeroLineBottomPercent-1);bar.style.backgroundColor='var(--excel-negative-red)'
                }
                // Log first few cashflow bars' classes
                if (index < 3 || index > values.length - 4) {
                    console.log(`[FM Debug BAR] Bar ${index} (${chartType}): Value=${itemValue.toFixed(0)}, Class assigned: ${barClass}`);
                }
            } else {
                // ARR Chart Logic
                heightPercentage=itemValue*scalePositive;bottomPositionPercent=0;topPositionPercent=null;bar.style.backgroundColor='var(--excel-chart-blue)'
            }
            bar.style.position='absolute';bar.style.left=`${index*barSpacing+barGap/2}px`;bar.style.width=`${barWidth}px`;bar.style.height=`0%`; // Start with 0 height
            if(topPositionPercent!==null){bar.style.top=`${topPositionPercent}%`;bar.style.bottom=''}else{bar.style.bottom=`${bottomPositionPercent}%`;bar.style.top=''}fragment.appendChild(bar);

            // Apply final height in the next frame to allow transition
            requestAnimationFrame(() => {
                 const finalHeight = Math.max(0, heightPercentage);
                 // Log only for the first few bars to avoid flooding console
                 if (index < 3 || index > values.length - 4) {
                     console.log(`[FM Debug BAR] Bar ${index} (${chartType}): Calculated height=${heightPercentage.toFixed(2)}%. Applying final height=${finalHeight.toFixed(2)}%`);
                 }
                 bar.style.height = `${finalHeight}%`;
            });

            if(index%quartersPerYear===0){const label=document.createElement('span');label.textContent=labels[index];label.style.position='absolute';label.style.left=`${index*barSpacing+barSpacing/2}px`;label.style.bottom='0';label.style.whiteSpace='nowrap';label.style.transform='translateX(-50%) translateY(100%)';labelFragment.appendChild(label)}});
        container.appendChild(fragment); labelsContainer.appendChild(labelFragment);
        console.log(`[FM Debug BAR] Finished creating bars for ${chartType} chart.`);
    };

    const redrawCharts = () => {
        console.log(`[FM Debug CHART] Redrawing charts. Scenario: ${currentScenario}`);
        console.log(`[FM Debug CHART] ARR Container: ${arrChartContainer ? 'Exists' : 'MISSING'}, Cashflow Container: ${cashflowChartContainer ? 'Exists' : 'MISSING'}`);
        try {
            const { arrData, cashflowData } = getChartData();
            createChartBars(arrData, arrChartContainer, arrLabelsContainer, false);
            createChartBars(cashflowData, cashflowChartContainer, cashflowLabelsContainer, true);
        } catch(e) {
            console.log("[FM Debug ERROR] Error during chart redraw:", e);
        }
    }

    const updateDashboard = () => {
        console.log("[FM Debug UPDATE] Starting updateDashboard function.");
        currentScenario = currentScenario === 1 ? 2 : 1;
        const targetScenarioAnnualData = scenarios[`scenario${currentScenario}`];
        const cellsToUpdate = [];
        if (!tableBody || !targetScenarioAnnualData) {
            console.log("[FM Debug ERROR] Update failed: Missing table body or scenario data.");
            return;
        }
        Object.keys(targetScenarioAnnualData).forEach(key => {
            const [metricName, year] = key.split('_');
            if (!metricName || !year) return;
            const row = findRowByMetric(metricName);
            if (row) {
                const headerIndex = yearIndices[year];
                if (headerIndex !== undefined && headerIndex > 0) {
                    const cell = row.querySelector(`td:nth-child(${headerIndex + 1})`);
                    if (cell && cell.hasAttribute('data-value')) {
                        const newValue = String(targetScenarioAnnualData[key]);
                        const oldValue = cell.getAttribute('data-value');
                        if (newValue !== oldValue) {
                            cell.setAttribute('data-value', newValue);
                            cellsToUpdate.push(cell);
                        }
                    }
                }
            }
        });
        try {
           calculateAndSetARRperHead();
        } catch (e) {
            console.log("[FM Debug ERROR] Error calculating ARR/Head during update:", e);
        }
        cellsToUpdate.forEach(cell => { try { animateCountUp(cell); } catch(e) { console.log("[FM Debug ERROR] Error animating cell:", cell, e); } });
        redrawCharts();
        console.log("[FM Debug UPDATE] updateDashboard complete.");
    };

    const initialize = () => {
        console.log("[FM Debug INIT] Running internal initialize.");
        storeScenario1AnnualValues();
        try {
             calculateAndSetARRperHead();
        } catch (e) {
             console.log("[FM Debug ERROR] Initial ARR/Head calc error:", e);
        }
        allCounters.forEach(cell => {
            try { animateCountUp(cell); } catch (e) {
                console.log("[FM Debug ERROR] Initial cell animation error:", cell, e);
                if (cell) cell.textContent = 'Err';
            }
        });
        currentScenario = 1;
        redrawCharts();
        startInterval();
        console.log("[FM Debug INIT] Internal initialize complete.");
    };

    const startInterval = () => {
        stopInterval();
        console.log(`[FM Debug INTERVAL] Starting update interval for ${containerId}`);
        mainUpdateInterval = setInterval(updateDashboard, updateIntervalTime);
    };

    const stopInterval = () => {
        console.log(`[FM Debug INTERVAL] Attempting to clear interval ID: ${mainUpdateInterval}`); // ADDED Log
        if (mainUpdateInterval) {
            console.log(`[FM Debug INTERVAL] Clearing update interval for ${containerId}`); // Keep specific FM log
            clearInterval(mainUpdateInterval);
            mainUpdateInterval = null;
        } else {
            console.log(`[FM Debug INTERVAL] No interval ID found to clear for ${containerId}.`); // ADDED Log
        }
    };

    const triggerRedraw = () => {
        console.log(`[FM Debug CONTROL] Triggering redraw for ${containerId}`);
        redrawCharts();
    };

    initialize();

    const handleResize = () => {
        clearTimeout(resizeTimer);
        stopInterval();
        resizeTimer = setTimeout(() => {
            console.log("[FM Debug RESIZE] Redrawing charts after resize.");
            redrawCharts();
        }, 500);
    };
    window.addEventListener('resize', handleResize);

    return {
        start: startInterval,
        stop: stopInterval,
        redraw: triggerRedraw,
        destroy: () => {
            console.log(`[FM Debug CONTROL] Destroying instance for ${containerId}`); // Keep specific FM log
            stopInterval(); // This call should log now
            window.removeEventListener('resize', handleResize);
            // --- ADDED: Explicitly cancel all ongoing number animations --- >
            allCounters.forEach(el => {
                if (el._animationFrameId) {
                    cancelAnimationFrame(el._animationFrameId);
                    delete el._animationFrameId;
                }
            });
            console.log(`[FM Debug CONTROL] Canceled any ongoing number animations.`); // ADDED Log
            // --- END ADDED --- >
        }
    };
}

// --- Global Management for Financial Model Instance --- //
let financialModelInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // Financial model initialization is handled by the activateService function
    // This listener is kept for other potential DOMContentLoaded tasks if needed.
});