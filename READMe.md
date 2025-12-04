# StrathCart - Complete Project Documentation

## Project Overview

**StrathCart** is a web-based food ordering system designed for Strathmore University's campus cafeteria. It allows students to browse menu items, add them to a cart, place orders, and receive email confirmations. The system provides a seamless ordering experience with real-time cart management and order tracking.

### Team Members
- **Sean Jalemba** - 218821
- **Samuel Kimani** - 220237

---

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [System Architecture](#system-architecture)
3. [Features & Functionalities](#features--functionalities)
4. [Data Flow & Management](#data-flow--management)
5. [Code Structure Explanation](#code-structure-explanation)
6. [Setup & Installation](#setup--installation)
7. [Security Considerations](#security-considerations)

---

## Technologies Used

### Frontend Technologies
- **HTML5**: Structure and markup for all pages
- **CSS3**: Styling with custom stylesheets (`cartstyle.css`, `responsive.css`)
- **JavaScript (ES6+)**: Client-side logic and interactivity
- **Firebase SDK**: Authentication and database integration

### Backend Services
- **Firebase Authentication**: User authentication and session management
- **Cloud Firestore**: NoSQL database for storing user data, cart items, and orders
- **EmailJS**: Third-party service for sending order confirmation emails

### External Resources
- **Cloudinary**: Image hosting for product images and logos
- **CDN Services**: Firebase and EmailJS libraries loaded via CDN

### Development Tools
- **Git/GitHub**: Version control and collaboration
- **Modern Web Browsers**: Chrome, Firefox, Safari for testing

---

## System Architecture

### Client-Server Model
```
User Browser (Client)
    ↓
HTML/CSS/JavaScript (Frontend)
    ↓
Firebase SDK (API Layer)
    ↓
Cloud Firestore (Database) + Firebase Auth (Authentication)
    ↓
EmailJS API (Email Service)
```

### Database Structure

#### Collections in Firestore:

1. **Users/users Collection**
   ```javascript
   {
     uid: "user123",
     fullName: "John Doe",
     name: "John",
     email: "john@strathmore.edu",
     admissionNumber: "123456",
     createdAt: Timestamp
   }
   ```

2. **Cart Collection**
   ```javascript
   {
     userId: "user123",
     items: [
       {
         itemID: "item001",
         itemname: "Burger",
         price: 500,
         quantity: 2,
         imageurl: "https://cloudinary.com/..."
       }
     ],
     updatedAt: Timestamp
   }
   ```

3. **Orders Collection**
   ```javascript
   {
     orderNumber: "ORD-20250101-456",
     orderID: 1234,
     userId: "user123",
     admissionNumber: "123456",
     email: "john@strathmore.edu",
     items: [...],
     Total: 1000,
     Status: "pending",
     ordercreated: Timestamp,
     collectiontime: Timestamp
   }
   ```

---

## Features & Functionalities

### 1. User Authentication
- **Login System**: Users must authenticate before accessing the cart
- **Session Management**: Firebase Authentication maintains user sessions
- **Redirect Logic**: Unauthenticated users are redirected to login page

### 2. Shopping Cart Management

#### Add to Cart
- Users can add items from the menu page
- Items are stored in Firestore under the user's Cart document
- Real-time synchronization across devices

#### View Cart
- Display all items with images, names, prices, and quantities
- Shows individual item totals and grand total
- Responsive layout for different screen sizes

#### Modify Quantities
- **Increase Quantity**: `increaseQuantity()` function
  - Updates local state
  - Recalculates prices
  - Saves to Firestore
  
- **Decrease Quantity**: `decreaseQuantity()` function
  - Reduces quantity by 1
  - If quantity reaches 0, prompts for removal
  - Updates database accordingly

#### Remove Items
- Confirmation dialog before removal
- Removes item from local state and Firestore
- Updates UI immediately

### 3. Order Processing

#### Checkout Flow
1. **Validation**: Checks if cart has items and user is authenticated
2. **Order Generation**: Creates unique order number with format `ORD-YYYYMMDD-XXX`
3. **Collection Time**: Automatically set to 1 hour from order time
4. **Confirmation**: Shows order summary for user approval
5. **Database Update**: Saves order to Firestore Orders collection
6. **Email Notification**: Sends confirmation email via EmailJS
7. **Cart Cleanup**: Clears cart from both memory and database
8. **Redirect**: Takes user to orders page

### 4. Email Notifications

#### EmailJS Integration
- Service ID: `service_yuralkh`
- Template ID: `template_3mspdgl`
- Public Key: `_EAFuYn_2tA8LaBnV`

#### Email Content Includes:
- Customer name and email
- Order number
- Itemized list with quantities and prices
- Total amount
- Collection time formatted in readable format

### 5. User Interface Components

#### Navigation Bar
- Logo and branding
- Links to: Home, Menu, My Orders, About Us, Contact, Account, Cart
- Active state highlighting for current page

#### Cart Display
- Empty state message when no items
- Grid/flex layout for cart items
- Order summary sidebar with totals
- "Continue Shopping" link
- Checkout button

#### Responsive Design
- Mobile-friendly layout
- Breakpoints for different screen sizes
- Touch-friendly buttons and controls

---

## Data Flow & Management

### Loading Cart on Page Load

```
1. User visits cart.html
2. onAuthStateChanged() fires
3. Check if user is authenticated
   ├─ No → Redirect to login.html
   └─ Yes → Continue
4. Fetch user data from Firestore (users/Users collection)
5. Load cart data from Firestore (Cart collection)
6. Parse and validate cart items
7. Render cart UI
8. Update summary totals
```

### Modifying Cart Items

```
User Action (Increase/Decrease/Remove)
    ↓
Update Local State (cartData.items)
    ↓
Update UI Elements (quantity, price)
    ↓
Recalculate Summary
    ↓
saveCart() → Update Firestore
    ↓
If items.length === 0 → deleteDoc()
    ↓
Confirmation/Feedback to User
```

### Checkout Process

```
User Clicks "Proceed to Checkout"
    ↓
Validate cart and user data
    ↓
Disable checkout button ("Processing...")
    ↓
Generate order data with unique order number
    ↓
Show confirmation dialog
    ↓
User confirms → Continue | User cancels → Re-enable button
    ↓
Save order to Firestore (Orders collection)
    ↓
Prepare email parameters
    ↓
Send email via EmailJS API
    ↓
Clear cartData.items array
    ↓
Delete cart document from Firestore
    ↓
Show success alert
    ↓
Redirect to orders.html
```

---

## Code Structure Explanation

### HTML Structure

```html
<!-- Navigation -->
<nav class="navbar">
  <!-- Logo and navigation links -->
</nav>

<!-- Main Content -->
<div class="container">
  <!-- Cart Header -->
  <div class="cart-header">
    <h1>Shopping Cart</h1>
    <p id="cart-item-count"><!-- Dynamic count --></p>
  </div>
  
  <!-- Cart Container -->
  <div class="cart-container">
    <!-- Cart Items List -->
    <div class="cart-items" id="cart-items">
      <!-- Dynamically populated -->
    </div>
    
    <!-- Order Summary -->
    <div class="cart-summary" id="cart-summary">
      <!-- Summary totals and checkout button -->
    </div>
  </div>
</div>

<!-- Footer -->
<footer class="home-footer">
  <!-- Copyright information -->
</footer>
```

### JavaScript Modules

#### 1. Firebase Initialization
```javascript
import { auth, db } from './config.js';
import { onAuthStateChanged } from "firebase-auth.js";
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, Timestamp } from "firebase-firestore.js";
```

#### 2. Global State Variables
```javascript
let cartData = { items: [] };  // Stores cart items
let currentUser = null;         // Current authenticated user
let userData = null;            // User profile data
```

#### 3. Authentication Handler
```javascript
onAuthStateChanged(auth, async (user) => {
  // Check authentication
  // Load user data
  // Initialize cart
});
```

#### 4. Core Functions

**loadCart()**
- Fetches cart from Firestore
- Validates and normalizes item data
- Handles empty cart state
- Triggers rendering

**renderCart()**
- Creates DOM elements for each cart item
- Sets up quantity controls
- Displays images, names, prices
- Shows order summary

**updateSummary()**
- Calculates total items
- Calculates total price
- Updates UI elements

**saveCart()**
- Saves cart to Firestore
- Deletes cart document if empty
- Handles errors gracefully

**increaseQuantity(itemID)**
- Increments item quantity
- Updates price display
- Saves to database

**decreaseQuantity(itemID)**
- Decrements item quantity
- Prompts removal if quantity reaches 0
- Updates database

**removeItem(itemID)**
- Shows confirmation dialog
- Removes from local state
- Updates Firestore
- Handles empty cart state

**proceedToCheckout()**
- Validates cart and user
- Generates order number
- Creates order data structure
- Saves order to Firestore
- Sends confirmation email
- Clears cart
- Redirects to orders page

**showEmptyCart()**
- Displays empty state message
- Hides order summary
- Shows "Browse Menu" button

---

## Setup & Installation

### Prerequisites
1. Modern web browser (Chrome, Firefox, Safari)
2. Firebase project with Firestore and Authentication enabled
3. EmailJS account with configured service and template
4. Web server (local or hosted)

### Configuration Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ashivira/StrathCartV2.git
   cd StrathCartV2
   ```

2. **Firebase Configuration**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create Firestore database
   - Update `config.js` with your Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. **EmailJS Configuration**
   - Sign up at [emailjs.com](https://www.emailjs.com)
   - Create an email service
   - Create an email template with parameters:
     - `{{user_name}}`
     - `{{user_email}}`
     - `{{order_number}}`
     - `{{order_items}}`
     - `{{order_total}}`
     - `{{collection_time}}`
   - Update service ID, template ID, and public key in `cart.html`

4. **Deploy**
   - Upload files to web server or use local development server
   - Access via browser

### File Structure
```
StrathCartV2/
│
├── index.html
├── home.html
├── menu.html
├── cart.html
├── orders.html
├── about.html
├── contact.html
├── account.html
├── login.html
│
├── config.js              # Firebase configuration
├── cartstyle.css         # Cart page styles
├── responsive.css        # Responsive design styles
│
└── assets/
    └── logo.png          # Application logo
```

---

## Security Considerations

### Authentication Security
- Firebase Authentication handles password hashing and secure storage
- Session tokens are managed by Firebase SDK
- Users must be authenticated to access cart functionality

### Database Security
- Firestore security rules should restrict access:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /Cart/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /Orders/{orderId} {
        allow read, write: if request.auth != null;
      }
      match /Users/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

### Email Security
- EmailJS public key is exposed (normal for client-side implementation)
- Rate limiting on EmailJS side prevents abuse
- No sensitive data should be included in emails

### Best Practices Implemented
1. **Input Validation**: All cart data is validated before processing
2. **Error Handling**: Try-catch blocks around database operations
3. **User Feedback**: Loading states and error messages
4. **Data Sanitization**: Prices and quantities parsed as numbers
5. **Confirmation Dialogs**: For destructive actions (remove, checkout)

### Recommendations for Production
1. Implement proper Firestore security rules
2. Add rate limiting for checkout operations
3. Implement server-side order validation
4. Use environment variables for API keys
5. Add HTTPS/SSL certificate
6. Implement proper logging and monitoring
7. Add payment gateway integration
8. Implement admin dashboard for order management

---

## Future Enhancements

### Planned Features
1. **Payment Integration**: M-Pesa or card payments
2. **Order Tracking**: Real-time order status updates
3. **Rating System**: Users can rate items and service
4. **Order History**: Detailed order history with reorder capability
5. **Admin Panel**: Manage menu, orders, and users
6. **Push Notifications**: Order status updates
7. **Favorites**: Save favorite items for quick ordering
8. **Dietary Filters**: Filter menu by dietary restrictions
9. **Scheduled Orders**: Pre-order for later collection
10. **Analytics Dashboard**: Order trends and insights

---

## Troubleshooting

### Common Issues

**Cart items not loading**
- Check Firebase configuration
- Verify user is authenticated
- Check browser console for errors
- Ensure Firestore rules allow read access

**Checkout not working**
- Verify EmailJS configuration
- Check network tab for failed requests
- Ensure all required fields are present
- Check Firestore write permissions

**Email not received**
- Verify EmailJS template parameters match code
- Check spam folder
- Verify email service is active
- Check EmailJS usage limits

**Items not clearing after checkout**
- Ensure `deleteDoc()` is called after successful order
- Check browser console for errors
- Verify Firestore delete permissions

---

## Support & Contact

For issues, questions, or contributions:
- GitHub Repository: https://github.com/Ashivira/StrathCartV2
- Project Team: Sean Jalemba (218821), Samuel Kimani (220237)

---

## License

© 2025 StrathCart. All rights reserved.

---

*Last Updated: December 2025*
