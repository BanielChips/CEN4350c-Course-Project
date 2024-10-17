
// methods for login form popup
function openForm() {
  document.getElementById("login-form").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

window.onclick = function(event) {
  var popup = document.getElementById("login-form");
  var overlay = document.getElementById("overlay");
  var isPopupVisible = window.getComputedStyle(popup).display !== 'none';

  // If user clicks off of login popup, close the popup
  if (isPopupVisible) {
    if (overlay.contains(event.target)) {
      closeForm();
    }
  }
}

// Shrink text and stick header to top of page on scroll. Revert when at top.
window.onscroll = function() { stickyHeader() };
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

// Product constructor
// Creating this here to make product references scalable in the future---
// When using product data dynamically, the constructor allows
// database queries to then be mapped to an object and not hard coded
function Product(pid, productName, productDescription){
  this.pid = pid;
  this.productName = productName;
  this.productDescription = productDescription;
}

// Starting to work with data from the SQL server
document.addEventListener('DOMContentLoaded', (event) => {
    getProducts();
});


function getProducts() {
    fetch('/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetching table data:', error);
        });
}


