
// methods for login form popup
function openForm() {
  document.getElementById("loginForm").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

window.onclick = function(event) {
  var popup = document.getElementById("loginForm");
  var overlay = document.getElementById("overlay");
  var isPopupVisible = window.getComputedStyle(popup).display !== 'none';

  // If user clicks off of login popup, close the popup
  if (isPopupVisible) {
    if (overlay.contains(event.target)) {
      closeForm();
    }
  }
}

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
