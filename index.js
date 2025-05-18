document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navRibbon = document.querySelector(".nav-ribbon");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navRibbon.classList.toggle("active");
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navRibbon.classList.remove("active");
        });
    });

    // Search Functionality
    const searchIcon = document.getElementById("search-icon");
    const searchInput = document.getElementById("header-search-input");
    const sweets = document.querySelectorAll(".sweet-card");
    const namkeens = document.querySelectorAll(".namkeen-card");
    const gifts = document.querySelectorAll(".gift-card");
    const sweetsContainer = document.querySelector(".sweets-container");
    const namkeenContainer = document.querySelector(".namkeen-container");
    const giftContainer = document.querySelector(".gift-container");

    searchIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        searchInput.classList.toggle("active");
        if (searchInput.classList.contains("active")) {
            searchInput.focus();
        }
    });

    function performSearch() {
        const searchValue = searchInput.value.toLowerCase().trim();
        let found = false;

        // Reset all containers
        sweetsContainer.querySelector(".no-results").style.display = "none";
        namkeenContainer.querySelector(".no-results").style.display = "none";
        giftContainer.querySelector(".no-results").style.display = "none";

        // Search Sweets
        let sweetsFound = false;
        sweets.forEach(card => {
            const sweetName = card.querySelector("h3").textContent.toLowerCase();
            if (searchValue === "" || sweetName.includes(searchValue)) {
                card.style.display = "flex";
                sweetsFound = true;
            } else {
                card.style.display = "none";
            }
        });

        // Search Namkeens
        let namkeensFound = false;
        namkeens.forEach(card => {
            const namkeenName = card.querySelector("h3").textContent.toLowerCase();
            if (searchValue === "" || namkeenName.includes(searchValue)) {
                card.style.display = "flex";
                namkeensFound = true;
            } else {
                card.style.display = "none";
            }
        });

        // Search Gifts
        let giftsFound = false;
        gifts.forEach(card => {
            const giftName = card.querySelector("h3").textContent.toLowerCase();
            if (searchValue === "" || giftName.includes(searchValue)) {
                card.style.display = "flex";
                giftsFound = true;
            } else {
                card.style.display = "none";
            }
        });

        // Handle empty search or no results
        if (searchValue === "") {
            sweets.forEach(card => card.style.display = "flex");
            namkeens.forEach(card => card.style.display = "flex");
            gifts.forEach(card => card.style.display = "flex");
            return;
        }

        // Show "No results found" if no items match
        if (!sweetsFound) {
            sweetsContainer.querySelector(".no-results").style.display = "block";
        }
        if (!namkeensFound) {
            namkeenContainer.querySelector(".no-results").style.display = "block";
        }
        if (!giftsFound) {
            giftContainer.querySelector(".no-results").style.display = "block";
        }

        // Scroll to the first section with results
        if (sweetsFound) {
            document.getElementById("order-sweets").scrollIntoView({ behavior: "smooth" });
            found = true;
        } else if (namkeensFound) {
            document.getElementById("namkeen").scrollIntoView({ behavior: "smooth" });
            found = true;
        } else if (giftsFound) {
            document.getElementById("gifting").scrollIntoView({ behavior: "smooth" });
            found = true;
        }

        if (!found && searchValue !== "") {
            sweetsContainer.querySelector(".no-results").style.display = "block";
            document.getElementById("order-sweets").scrollIntoView({ behavior: "smooth" });
        }
    }

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const searchValue = searchInput.value.trim();
            if (searchValue === "") {
                sessionStorage.setItem("isReload", "true");
                location.reload();
            } else {
                performSearch();
                searchInput.classList.remove("active");
            }
        }
    });

    // Close search input when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && e.target !== searchIcon) {
            searchInput.classList.remove("active");
        }
    });

    // Dynamic Header Behavior
    const header = document.querySelector(".header");
    let lastScrollY = window.scrollY;
    let isScrolling;
    let hideTimeout;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const isAtTop = currentScrollY === 0;

        if (isAtTop) {
            header.classList.add("visible");
            header.classList.remove("hidden");
        } else if (currentScrollY > lastScrollY) {
            header.classList.add("hidden");
            header.classList.remove("visible");
        } else if (currentScrollY < lastScrollY) {
            header.classList.add("visible");
            header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;

        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!isAtTop) {
                header.classList.add("hidden");
                header.classList.remove("visible");
            }
        }, 1000);
    }

    window.addEventListener("scroll", () => {
        updateHeader();
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            updateHeader();
        }, 150);
    });

    // Home Button Functionality
    document.querySelector('a[href="#home"]').addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Specialties Carousel
    const items = document.querySelectorAll(".sweet-item");
    const totalItems = items.length;
    const radiusX = 300;
    const radiusY = 150;
    let currentIndex = 0;
    let angleStep = (2 * Math.PI) / totalItems;

    function updatePositions() {
        items.forEach((item, index) => {
            let angle = angleStep * ((index - currentIndex + totalItems) % totalItems);
            let x = Math.cos(angle) * radiusX;
            let y = Math.sin(angle) * radiusY;

            item.style.transform = `translate(${x}px, ${y}px) scale(${index === currentIndex ? 1.2 : 0.8})`;
            item.style.zIndex = index === currentIndex ? 10 : 5;
            item.style.opacity = index === currentIndex ? 1 : 0.5;
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % totalItems;
        updatePositions();
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updatePositions();
    }

    document.getElementById("nextBtn").addEventListener("click", nextItem);
    document.getElementById("prevBtn").addEventListener("click", prevItem);

    let isDragging = false;
    let startX;

    document.querySelector(".specialties-container").addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let deltaX = e.clientX - startX;
            if (deltaX > 50) {
                prevItem();
                isDragging = false;
            } else if (deltaX < -50) {
                nextItem();
                isDragging = false;
            }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextItem();
        if (e.key === "ArrowLeft") prevItem();
    });

    updatePositions();

    // Sweets and Namkeen Animation
    sweets.forEach((sweet, index) => {
        sweet.style.animationDelay = `${index * 100}ms`;
    });
    namkeens.forEach((namkeen, index) => {
        namkeen.style.animationDelay = `${index * 100}ms`;
    });
    gifts.forEach((gift, index) => {
        gift.style.animationDelay = `${index * 100}ms`;
    });

    // Sweets Filter
    const sweetFilterButtons = document.querySelectorAll("#order-sweets .filter-btn");
    sweetFilterButtons.forEach(button => {
        button.addEventListener("click", () => {
            sweetFilterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const filter = button.dataset.filter;
            sweets.forEach(card => {
                const category = card.dataset.category;
                card.style.display = (filter === "all" || category.includes(filter)) ? "flex" : "none";
            });
            sweetsContainer.querySelector(".no-results").style.display = "none";
        });
    });

    // Namkeen Filter
    const namkeenFilterButtons = document.querySelectorAll("#namkeen .filter-btn");
    namkeenFilterButtons.forEach(button => {
        button.addEventListener("click", () => {
            namkeenFilterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const filter = button.dataset.filter;
            namkeens.forEach(card => {
                const category = card.dataset.category;
                card.style.display = (filter === "all" || category.includes(filter)) ? "flex" : "none";
            });
            namkeenContainer.querySelector(".no-results").style.display = "none";
        });
    });

    // Gifting Filter
    const giftFilterButtons = document.querySelectorAll("#gifting .filter-btn");
    giftFilterButtons.forEach(button => {
        button.addEventListener("click", () => {
            giftFilterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const filter = button.dataset.filter;
            gifts.forEach(card => {
                const category = card.dataset.category;
                card.style.display = (filter === "all" || category.includes(filter)) ? "flex" : "none";
            });
            giftContainer.querySelector(".no-results").style.display = "none";
        });
    });

    // Image Slider Carousel
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => (slide.style.opacity = "0"));
        slides[index].style.opacity = "1";
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % totalSlides;
        showSlide(slideIndex);
    }

    setInterval(nextSlide, 5000);
    showSlide(slideIndex);

    // Card Image Hover Effects
    document.querySelectorAll(".sweet-card img, .namkeen-card img, .gift-card img").forEach(img => {
        img.addEventListener("mouseover", function () {
            this.style.transform = "scale(1.05)";
        });
        img.addEventListener("mouseout", function () {
            this.style.transform = "scale(1)";
        });
    });

    // Smooth Scrolling for Navigation Links (including dropdowns)
    document.querySelectorAll('.nav-menu a[href*="#"]').forEach(link => {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (href.startsWith("#")) {
                event.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }
            // For external links with hashes (e.g., Sweets/sweets.html#rajasthani-special), let browser handle navigation
        });
    });

    // Customer Reviews Carousel
    const reviews = document.querySelectorAll(".review-card");
    const totalReviews = reviews.length;
    let visibleIndices = [];

    function getRandomIndices() {
        const indices = Array.from({ length: totalReviews }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices.slice(0, 3);
    }

    function updateReviews() {
        reviews.forEach((review, index) => {
            if (visibleIndices.includes(index)) {
                review.classList.add("visible");
                review.style.display = "block";
            } else {
                review.classList.remove("visible");
                review.style.display = "none";
            }
        });
    }

    function nextReview() {
        const firstIndex = visibleIndices[0];
        visibleIndices = visibleIndices.map(index => (index + 1) % totalReviews);
        if (visibleIndices.includes(firstIndex)) {
            visibleIndices = getRandomIndices();
        }
        updateReviews();
    }

    function prevReview() {
        const lastIndex = visibleIndices[visibleIndices.length - 1];
        visibleIndices = visibleIndices.map(index => (index - 1 + totalReviews) % totalReviews);
        if (visibleIndices.includes(lastIndex)) {
            visibleIndices = getRandomIndices();
        }
        updateReviews();
    }

    // Initialize with random reviews
    visibleIndices = getRandomIndices();
    updateReviews();

    document.getElementById("nextReview").addEventListener("click", nextReview);
    document.getElementById("prevReview").addEventListener("click", prevReview);

    // Dropdown Accessibility (Keyboard Support)
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
        const mainLink = dropdown.querySelector("a");
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");

        mainLink.addEventListener("focus", () => {
            dropdownMenu.style.display = "block";
            dropdownMenu.style.opacity = "1";
            dropdownMenu.style.transform = "translateY(0)";
            mainLink.setAttribute("aria-expanded", "true");
        });

        mainLink.addEventListener("blur", (e) => {
            if (!dropdown.contains(e.relatedTarget)) {
                dropdownMenu.style.display = "none";
                dropdownMenu.style.opacity = "0";
                dropdownMenu.style.transform = "translateY(-10px)";
                mainLink.setAttribute("aria-expanded", "false");
            }
        });

        dropdownMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("blur", (e) => {
                if (!dropdown.contains(e.relatedTarget)) {
                    dropdownMenu.style.display = "none";
                    dropdownMenu.style.opacity = "0";
                    dropdownMenu.style.transform = "translateY(-10px)";
                    mainLink.setAttribute("aria-expanded", "false");
                }
            });
        });
    });

    // Newsletter Form Submission (Placeholder)
    const newsletterForm = document.querySelector(".newsletter-form");
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for subscribing!");
        newsletterForm.reset();
    });

    // Welcome Popup for First-Time Visitors
    const popup = document.getElementById("welcome-popup");
    const closePopupBtn = document.getElementById("close-popup");
    const welcomeForm = document.getElementById("welcome-form");
    const stateSelect = document.getElementById("user-state");
    const citySelect = document.getElementById("user-city");

    // State-City Mapping
    const cityData = {
        Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
        Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
        Delhi: ["New Delhi", "South Delhi", "North Delhi"]
        // Add more states and cities as needed
    };

    // Populate cities based on selected state
    stateSelect.addEventListener("change", () => {
        const selectedState = stateSelect.value;
        citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
        if (cityData[selectedState]) {
            cityData[selectedState].forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        citySelect.disabled = !selectedState;
    });

    // Check if this is a reload or a new tab
    if (sessionStorage.getItem("isReload") === "true") {
        sessionStorage.removeItem("isReload"); // Clear the flag
    } else if (!sessionStorage.getItem("popupShown")) {
        setTimeout(() => {
            popup.classList.add("active");
        }, 1000); // Show after 1 second
    }

    // Close popup
    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("active");
        sessionStorage.setItem("popupShown", "true");
    });

    // Form submission (placeholder)
    welcomeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for joining Munnalal Sweets!");
        popup.classList.remove("active");
        sessionStorage.setItem("popupShown", "true");
        welcomeForm.reset();
    });

    // Close popup when clicking outside
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("active");
            sessionStorage.setItem("popupShown", "true");
        }
    });

    // Order Popup Functionality
    const orderPopup = document.createElement("div");
    orderPopup.id = "order-popup";
    orderPopup.className = "popup-overlay";
    document.body.appendChild(orderPopup);

    function showOrderPopup(itemName, itemImage, itemPrice, itemSubtitle = "") {
        orderPopup.innerHTML = `
            <div class="popup-card">
                <button class="close-btn" id="close-order-popup">×</button>
                <img src="${itemImage}" alt="${itemName}">
                <h3>${itemName}</h3>
                ${itemSubtitle ? `<p class="popup-subtitle">${itemSubtitle}</p>` : ""}
                <p class="popup-price">${itemPrice}</p>
                <div class="popup-contact">
                    <h4>Contact Us to Order</h4>
                    <p>📞 <a href="tel:+919660086877">+91 9660086877</a></p>
                    <p>✉️ <a href="mailto:info@munnalalsweets.com">info@munnalalsweets.com</a></p>
                </div>
            </div>
        `;
        orderPopup.classList.add("active");

        // Close popup
        document.getElementById("close-order-popup").addEventListener("click", () => {
            orderPopup.classList.remove("active");
        });

        // Close when clicking outside
        orderPopup.addEventListener("click", (e) => {
            if (e.target === orderPopup) {
                orderPopup.classList.remove("active");
            }
        });
    }

    // Add event listeners to "Order Now" buttons for sweets and namkeens
    document.querySelectorAll(".sweet-card .order-btn, .namkeen-card .order-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".sweet-card, .namkeen-card");
            const itemName = card.querySelector("h3").textContent;
            const itemImage = card.querySelector("img").src;
            const itemPrice = card.querySelector(".sweet-price, .namkeen-price").textContent;
            showOrderPopup(itemName, itemImage, itemPrice);
        });
    });

    // Add event listeners to gift cards for click anywhere
   
    document.querySelectorAll(".gift-card").forEach(card => {
        card.addEventListener("click", () => {
            const itemName = card.querySelector("h3").textContent;
            const itemImage = card.querySelector("img").src;
            const itemPrice = card.querySelector(".gift-price").textContent;
            const itemSubtitle = card.querySelector(".gift-subtitle").textContent;
            showOrderPopup(itemName, itemImage, itemPrice, itemSubtitle);
        });
    });

    // Gift Ad Popup Functionality
    const giftAd = document.getElementById("gift-ad");
    const giftPopup = document.getElementById("gift-ad-popup");
    const closeGiftPopupBtn = document.getElementById("close-gift-popup");

    giftAd.addEventListener("click", () => {
        giftPopup.classList.add("active");
    });

    closeGiftPopupBtn.addEventListener("click", () => {
        giftPopup.classList.remove("active");
    });

    giftPopup.addEventListener("click", (e) => {
        if (e.target === giftPopup) {
            giftPopup.classList.remove("active");
        }
    });

    const giftCardSample = document.querySelector(".gift-card-sample");
    if (giftCardSample && giftCardSample.dataset.size) {
        giftCardSample.style.setProperty('--gift-card-size', `${giftCardSample.dataset.size}px`);
    }

    // Gift Card Sample Zoom on Hover
    if (giftCardSample) {
        giftCardSample.addEventListener("mouseover", () => {
            // Store original size (natural dimensions, capped at 1000px)
            const maxSize = 500;
            const naturalWidth = Math.min(giftCardSample.naturalWidth, maxSize);
            const naturalHeight = Math.min(giftCardSample.naturalHeight, maxSize);
            giftCardSample.style.width = `${naturalWidth}px`;
            giftCardSample.style.height = `${naturalHeight}px`;
            giftCardSample.style.transition = 'width 0.3s ease, height 0.3s ease';
        });

        giftCardSample.addEventListener("mouseout", () => {
            // Revert to CSS-defined size (339px desktop, 300px mobile)
            const defaultSize = window.innerWidth <= 768 ? 113 : 113;
            giftCardSample.style.width = `${defaultSize}px`;
            giftCardSample.style.height = `${defaultSize}px`;
        });
    }
});

