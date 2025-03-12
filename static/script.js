lucide.createIcons();

// DOM Elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("resultsContainer");
const selectedLinksContainer = document.getElementById("selectedLinks");
const emptyStateMessage = selectedLinksContainer.querySelector(".empty-state"); // No sources selected message
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const userPanel = document.getElementById("userPanel");
const authButtons = document.getElementById("authButtons");
const userNameDisplay = document.getElementById("userName");

// Authentication Forms
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// Redirect to Login Page
const loginButton = document.getElementById("loginButton");
if (loginButton) {
  loginButton.addEventListener("click", () => {
    window.location.href = "/login";
  });
}

// Redirect to Signup Page
const signupButton = document.getElementById("signupButton");
if (signupButton) {
  signupButton.addEventListener("click", () => {
    window.location.href = "/signup";
  });
}

// Check if user is logged in
function checkAuth() {
  const user = localStorage.getItem("user");
  if (user) {
    userPanel.classList.remove("hidden");
    authButtons.classList.add("hidden");
    userNameDisplay.textContent = user;
  } else {
    userPanel.classList.add("hidden");
    authButtons.classList.remove("hidden");
  }
}

/* ---------------- Selected Sources ---------------- */

// **Update UI: Show/hide empty state message**
function updateSelectedLinksUI() {
  const selectedLinks =
    selectedLinksContainer.querySelectorAll(".selected-link");
  if (selectedLinks.length > 0) {
    emptyStateMessage.style.display = "none"; // Hide "No sources selected"
  } else {
    emptyStateMessage.style.display = "block"; // Show if no links
  }
}

// **Add link to selected sources**
function addToSelected(url) {
  const linkExists = [...selectedLinksContainer.children].some(
    (child) => child.dataset.url === url
  );
  if (linkExists) return;

  const linkItem = document.createElement("div");
  linkItem.classList.add("selected-link");
  linkItem.dataset.url = url;
  linkItem.innerHTML = `
        <a href="${url}" target="_blank">${url}</a>
        <button onclick="removeSelected('${url}')">Remove</button>
    `;

  selectedLinksContainer.appendChild(linkItem);
  updateSelectedLinksUI();
}

// **Remove selected link**
function removeSelected(url) {
  [...selectedLinksContainer.children].forEach((child) => {
    if (child.dataset.url === url) {
      selectedLinksContainer.removeChild(child);
    }
  });
  updateSelectedLinksUI();
}

// **Search and add links**
if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchButton.textContent = "Searching...";
    searchButton.disabled = true;

    try {
      const response = await fetch(`/search?q=${query}`);
      const data = await response.json();

      resultsContainer.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach((url) => {
          const resultItem = document.createElement("div");
          resultItem.classList.add("result-item");
          resultItem.innerHTML = `
            <a href="${url}" target="_blank">${url}</a>
            <button onclick="addToSelected('${url}')">Add</button>
          `;
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      resultsContainer.innerHTML = "<p>Error fetching results.</p>";
    }

    searchButton.textContent = "Search";
    searchButton.disabled = false;
  });
}

/* ---------------- Scrape Functionality ---------------- */
async function scrapeSelectedSources() {
  const selectedLinks = [
    ...selectedLinksContainer.querySelectorAll(".selected-link a"),
  ].map((a) => a.href);

  console.log("Selected Links for Scraping:", selectedLinks); // Debugging

  if (selectedLinks.length === 0) {
    alert("No sources selected for scraping.");
    return;
  }

  try {
    const response = await fetch("/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: selectedLinks }), // Send multiple URLs
    });

    const data = await response.json();
    console.log("Scraping Response:", data); // Debugging

    if (response.ok) {
      alert(`Scraping completed. Scraped ${data.scraped_count} sources.`);
    } else {
      alert(data.error || "Failed to scrape sources.");
    }
  } catch (error) {
    console.error("Scraping error:", error);
    alert("Error scraping sources.");
  }
}

/* ---------------- Chat Functionality ---------------- */
if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    addMessage("user", question);
    chatInput.value = "";

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      addMessage("bot", data.answer);
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("bot", "Sorry, an error occurred.");
    }
  });
}

// **Add message to chat panel**
function addMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", sender);

  // Check if it's a bot message and add an icon
  if (sender === "bot") {
      msgDiv.innerHTML = `
          <i data-lucide="bot" class="bot-icon"></i>
          <p>${message}</p>`;
  } else {
      msgDiv.innerHTML = `<p>${message}</p>`;
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Re-render Lucide icons after adding new elements
  lucide.createIcons();
}

// **Initialize authentication state**
document.addEventListener("DOMContentLoaded", async function () {
  checkAuth();
  updateSelectedLinksUI(); // Ensure UI updates on page load

  const token = sessionStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch("/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        userNameDisplay.textContent = userData.name;
        userPanel.classList.remove("hidden");
        authButtons.classList.add("hidden");
      } else {
        console.error("Failed to fetch user data");
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    authButtons.classList.remove("hidden");
    userPanel.classList.add("hidden");
  }
});
