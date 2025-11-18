 /*Project Name : StrathCart
  Team Members:
  - Sean Jalemba - 218821
  - Samuel Kimani - 220237 -->

  <!--initial start 1/11/2025-->*/
 const menuItems = [
      {
        id: 1,
        name: "Grilled Chicken with Salad",
        description: "Juicy grilled chicken breast served with fresh garden salad and herbs.",
        price: 350,
        image: "images/meal1.jpg",
        category: "Main Course",
        available: true,
        availableQuantity: 15
      },
      {
        id: 2,
        name: "Pasta Alfredo",
        description: "Creamy pasta with herbs, parmesan cheese, and garlic bread.",
        price: 420,
        image: "images/meal2.jpg",
        category: "Main Course",
        available: true,
        availableQuantity: 20
      },
      {
        id: 3,
        name: "Veggie Delight",
        description: "Colorful vegetarian plate with roasted vegetables and quinoa.",
        price: 280,
        image: "images/meal3.jpg",
        category: "Vegetarian",
        available: true,
        availableQuantity: 12
      },
      {
        id: 4,
        name: "Beef Burger & Fries",
        description: "Classic beef burger with lettuce, tomato, and crispy fries.",
        price: 450,
        image: "images/meal1.jpg",
        category: "Fast Food",
        available: true,
        availableQuantity: 18
      },
      {
        id: 5,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing, croutons, and parmesan.",
        price: 250,
        image: "images/meal3.jpg",
        category: "Salads",
        available: true,
        availableQuantity: 10
      },
      {
        id: 6,
        name: "Fish & Chips",
        description: "Crispy battered fish served with golden fries and tartar sauce.",
        price: 480,
        image: "images/meal1.jpg",
        category: "Seafood",
        available: false,
        availableQuantity: 0
      }
    ];

    // Cart management using localStorage (will be replaced with Firebase)
    class CartManager {
      constructor() {
        this.cart = this.loadCart();
      }

      loadCart() {
        const savedCart = localStorage.getItem('strathcart_cart');
        return savedCart ? JSON.parse(savedCart) : [];
      }

      saveCart() {
        localStorage.setItem('strathcart_cart', JSON.stringify(this.cart));
        this.updateCartBadge();
        // TODO: Sync with Firebase
      }

      addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.cart.push({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            quantity: 1
          });
        }
        
        this.saveCart();
        return true;
      }

      getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
      }

      updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const count = this.getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    }

    // Initialize cart manager
    const cartManager = new CartManager();

    // Render menu items
    function renderMenuItems() {
      const menuList = document.getElementById('menu-list');
      
      menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.setAttribute('data-item-id', item.id);
        
        menuItemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="menu-details">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="availability ${item.available ? '' : 'out-of-stock'}">
              ${item.available ? `In Stock (${item.availableQuantity} available)` : 'Out of Stock'}
            </span>
            <span class="price">KES ${item.price.toFixed(2)}</span>
            <button class="btn-secondary" 
                    onclick="addToCart(${item.id})" 
                    ${!item.available ? 'disabled' : ''}>
              ${item.available ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        `;
        
        menuList.appendChild(menuItemDiv);
      });
    }

    // Add item to cart
    function addToCart(itemId) {
      const item = menuItems.find(m => m.id === itemId);
      
      if (!item || !item.available) {
        return;
      }

      // Add to cart
      const success = cartManager.addItem(item);
      
      if (success) {
        // Show toast notification
        showToast(`${item.name} added to cart!`);
        
        // Animate button
        const button = document.querySelector(`[data-item-id="${itemId}"] .btn-secondary`);
        button.textContent = '✓ Added';
        button.classList.add('added');
        
        setTimeout(() => {
          button.textContent = 'Add to Cart';
          button.classList.remove('added');
        }, 1500);
      }
      
      // TODO: Update Firebase real-time database
    }

    // Show toast notification
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.querySelector('span').textContent = message;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Initialize page
    window.onload = function() {
      renderMenuItems();
      cartManager.updateCartBadge();
      
      // TODO: Load menu items from Firebase
      // TODO: Listen for real-time updates on menu availability
    };

    // Optional: Listen for storage changes (when cart is updated from another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'strathcart_cart') {
        cartManager.cart = cartManager.loadCart();
        cartManager.updateCartBadge();
      }
    });