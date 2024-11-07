function openForm() {
  document.getElementById("login-form").style.display = "flex";
  document.getElementById("login-form").style.flexDirection = "column";
  document.getElementById("login-form").style.alignItems = "center";

  setTimeout(() => {
    document.getElementById("login-form").style.top = "60px";
  }, 10);

  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("login-form").style.transition = "top 0.8s ease";
  document.getElementById("login-form").style.top = "-300px";

  setTimeout(() => {
    document.getElementById("login-form").style.display = "none";
  }, 600);

  document.getElementById("overlay").style.display = "none";
}

function closeRegistration() {
  document.getElementById("registration-form").style.top = "-1000px";

  setTimeout(() => {
    document.getElementById("registration-form").style.display = "none";
  }, 600);

  document.getElementById("overlay").style.display = "none";
}

window.onclick = function(event) {
  var popup = document.getElementById("login-form");
  var overlay = document.getElementById("overlay");
  var registrationOverlay = document.getElementById("registration-form");

  var isPopupVisible = window.getComputedStyle(popup).display !== "none";
  var isRegistrationVisible = window.getComputedStyle(registrationOverlay) !== "none";


  // If user clicks off of login popup, close the popup
  if (isPopupVisible) {
    if (overlay.contains(event.target)) {
      closeForm();
    }
  }

  if (isRegistrationVisible) {
    if (overlay.contains(event.target)) {
      closeRegistration();
    }
  }


}

document.getElementById("registration-popup").addEventListener("click", function() {
  document.getElementById("registration-form").style.display = "block";
  document.getElementById("login-form").style.display = "none";

  setTimeout(() => {
    document.getElementById("registration-form").style.top = "60px";
  }, 10);
});

// Removed nav bar change on scroll to just be default display
// window.onscroll = function() { stickyHeader() };
function stickyHeader() {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    document.getElementById("navBar").style.transition = "0.4s";
    document.getElementById("navBar").style.fontSize = "22px";
    document.getElementById("navBar").style.position = "sticky";
  } else {
    document.getElementById("navBar").style.fontSize = "26px";
    document.getElementById("navBar").style.position = "static";
    document.getElementById("navBar").style.transition = "0.2s";
  }
}

// TODO:
//  After - User Authentication:
//  let cartCount = query(SELECT count(*) FROM cart_items)
//  (Also consider quantity of each item in users' carts on top of addition to count(*))
let cartCount = 0;
function addToCart() {
  console.log("adding item to cart");
  cartCount++;
  const cartQuantity = document.getElementById("cart-count");

  if (cartCount > 10) {
    document.getElementById("cart-count").style.fontSize = "10px";
    cartQuantity.textContent = 10 + "+";
  } else  {
    cartQuantity.textContent = cartCount.toString();
  }

  if (cartCount > 0) {
    cartQuantity.classList.add("active");
  } else {
    cartQuantity.classList.remove("active");
  }
}

document.querySelector('.add-to-cart').addEventListener("click", addToCart);

function Product(pid, productName, productDescription){
  this.pid = pid;
  this.productName = productName;
  this.productDescription = productDescription;
}

let productInformation = [];

function fetchProductData() {
    return fetch('/get-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed');
            }
            return response.json();
        })
        .then(data => {
            productInformation = data;
        })
        .catch(error => {
            console.error('There was a problem with the fetching table data:', error);
        });
}

function fetchProductPrice() {
  fetch('/get-data')
    .then(response => response.json())
    .then(data => {
      document.getElementById('price').textContent = data.price;
    })
    .catch(error => {
      console.error('Error fetching product price:', error);
    });
}

function loadProductData(productInformation) {
  if (productInformation.length > 0) {
    productInformation.forEach((product, index) => {
      const productDetails = document.getElementById(`product-${index + 1}`);


      if (productDetails) {
        const productName = productDetails.querySelector('.product-name');
        const productDescription = productDetails.querySelector('.product-description');
        const productPrice = productDetails.querySelector('.product-price');

        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productPrice.textContent = product.price;
      }
    });
  } else {
      console.log('No product information found.');
  }
}

function loadNewsletter() {
  const form = document.getElementById('newsletter-signup-form');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      console.log("Newsletter button pressed");

      const email = document.getElementById('email-input').value;
      console.log("Submitting email:", email);
      fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          alert('Thank you for subscribing to our newsletter! You will now begin to receive emails with product updates and events.');

          document.getElementById('email-input').value = '';
        })
        .catch((error) => {
          console.error('Newsletter error:', error);
        });
    });
  } else {
    console.error("Form not found!");
  }
}

document.getElementById("registration-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("registration-email").value;
  const password = document.getElementById("registration-psw").value;

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
      } else {
        alert(data.error || "Registration error");
      }
    })
    .catch(error => console.error("WOAH:", error))
});


document.addEventListener('DOMContentLoaded', (event) => {
  fetchProductData().then( () => {
    loadProductData(productInformation)
  });
  loadNewsletter();
});
