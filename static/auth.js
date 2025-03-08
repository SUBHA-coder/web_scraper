lucide.createIcons();

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutButton = document.getElementById("logoutButton"); // Add this to HTML

// Handle Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("token", data.token);

        // Fetch user details after login
        await fetchUserDetails();

        window.location.href = "/"; // Redirect to home page
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  });
}

// Handle Signup
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        window.location.href = "/login";
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  });
}

// Fetch User Details After Login
async function fetchUserDetails() {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("http://127.0.0.1:5000/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      sessionStorage.setItem("user", JSON.stringify(userData));

      // Update UI
      updateAuthUI();
    } else {
      console.error("Failed to fetch user data.");
      handleLogout(); // If invalid token, log out
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Update UI Based on Auth State
function updateAuthUI() {
  const authButtons = document.getElementById("authButtons");
  const userPanel = document.getElementById("userPanel");
  const userNameDisplay = document.getElementById("userName");

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    authButtons.classList.add("hidden");
    userPanel.classList.remove("hidden");
    userNameDisplay.textContent = user.name; // Update with actual name
  } else {
    authButtons.classList.remove("hidden");
    userPanel.classList.add("hidden");
  }
}

// Handle Logout
if (logoutButton) {
  logoutButton.addEventListener("click", handleLogout);
}

function handleLogout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/login"; // Redirect to login page
}

// Auto-fetch user details on page load
document.addEventListener("DOMContentLoaded", fetchUserDetails);
