// lucide.createIcons();

// // DOM Elements
// const searchForm = document.getElementById('searchForm');
// const searchInput = document.getElementById('searchInput');
// const searchButton = document.getElementById('searchButton');
// const resultsContainer = document.getElementById('resultsContainer');
// const selectedLinks = document.getElementById('selectedLinks');
// const chatForm = document.getElementById('chatForm');
// const chatInput = document.getElementById('chatInput');
// const chatMessages = document.getElementById('chatMessages');

// // Search functionality
// searchForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const query = searchInput.value.trim();
//     if (!query) {
//         alert('Please enter a search query');
//         return;
//     }

//     // Show loading state
//     searchButton.disabled = true;
//     searchButton.textContent = 'Searching...';
//     resultsContainer.innerHTML = '<p class="empty-state">Searching...</p>';

//     try {
//         const response = await fetch('http://127.0.0.1:5000/search', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ query })
//         });

//         const data = await response.json();
        
//         if (data.error) {
//             throw new Error(data.error);
//         }

//         // Display results
//         resultsContainer.innerHTML = '';
//         data.links.forEach(link => {
//             const resultItem = document.createElement('div');
//             resultItem.className = 'result-item';
            
//             const linkElement = document.createElement('a');
//             linkElement.href = link;
//             linkElement.target = '_blank';
//             linkElement.textContent = link;

//             const addButton = document.createElement('button');
//             addButton.innerHTML = '<i data-lucide="plus"></i>';
//             addButton.onclick = (e) => {
//                 e.preventDefault();
//                 addToSelected(link);
//             };

//             resultItem.appendChild(linkElement);
//             resultItem.appendChild(addButton);
//             resultsContainer.appendChild(resultItem);
//         });

//         // Reinitialize icons for new elements
//         lucide.createIcons();

//     } catch (error) {
//         resultsContainer.innerHTML = `<p class="empty-state">Error: ${error.message}</p>`;
//     } finally {
//         searchButton.disabled = false;
//         searchButton.textContent = 'Search';
//     }
// });

// // Add link to selected panel
// function addToSelected(link) {
//     const existingLinks = Array.from(selectedLinks.getElementsByTagName('a'));
//     if (existingLinks.some(el => el.href === link)) {
//         alert('This source is already selected');
//         return;
//     }

//     // Remove empty state if present
//     const emptyState = selectedLinks.querySelector('.empty-state');
//     if (emptyState) {
//         emptyState.remove();
//     }

//     const linkContainer = document.createElement('div');
//     linkContainer.className = 'selected-link';

//     const linkElement = document.createElement('a');
//     linkElement.href = link;
//     linkElement.target = '_blank';
//     linkElement.textContent = link;

//     const removeButton = document.createElement('button');
//     removeButton.innerHTML = '<i data-lucide="x"></i>';
//     removeButton.onclick = () => {
//         linkContainer.remove();
//         if (selectedLinks.children.length === 0) {
//             selectedLinks.innerHTML = '<p class="empty-state">No sources selected</p>';
//         }
//     };

//     linkContainer.appendChild(linkElement);
//     linkContainer.appendChild(removeButton);
//     selectedLinks.appendChild(linkContainer);

//     // Reinitialize icons for new elements
//     lucide.createIcons();
// }

// // Chat functionality
// chatForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const question = chatInput.value.trim();
//     if (!question) return;

//     // Add user message
//     addMessage(question, true);
//     chatInput.value = '';

//     try {
//         const response = await fetch('http://127.0.0.1:5000/ask', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ question })
//         });

//         const data = await response.json();
//         addMessage(data.answer || 'Sorry, I could not process your request.', false);

//     } catch (error) {
//         addMessage('Sorry, there was an error processing your request.', false);
//     }
// });

// // Add message to chat
// function addMessage(text, isUser) {
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
//     messageDiv.textContent = text;
//     chatMessages.appendChild(messageDiv);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }
// Initialize Lucide icons
// Initialize Lucide icons
// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const selectedLinks = document.getElementById('selectedLinks');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const userPanel = document.getElementById('userPanel');
const authButtons = document.getElementById('authButtons');
const userNameDisplay = document.getElementById('userName');

// Authentication Modal
const authModal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authSubmit = document.getElementById('authSubmit');
const authToggleText = document.getElementById('authToggleText');

let isLogin = true;
// Redirect to Login Page
if (loginButton) {
    loginButton.addEventListener('click', () => {
        window.location.href = '/login';
    });
}

// Redirect to Signup Page
if (signupButton) {
    signupButton.addEventListener('click', () => {
        window.location.href = '/signup';

    });
}
// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        userPanel.classList.remove('hidden');
        authButtons.classList.add('hidden');
        userNameDisplay.textContent = user;
    } else {
        userPanel.classList.add('hidden');
        authButtons.classList.remove('hidden');
    }
}

// Open authentication modal
function openAuthModal(type) {
    isLogin = type === 'login';
    authTitle.textContent = isLogin ? 'Login' : 'Sign Up';
    authSubmit.textContent = isLogin ? 'Login' : 'Sign Up';
    authToggleText.innerHTML = isLogin
    ? `Don't have an account? <a href="{{ url_for('signup_page') }}">Sign Up</a>`
    : `Already have an account? <a href="{{ url_for('login_page') }}">Login</a>`;

    authModal.classList.remove('hidden');
}

// Close authentication modal
function closeAuthModal() {
    authModal.classList.add('hidden');
}

// Handle login/signup
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();

    if (!username || !password) {
        alert('Please fill out all fields');
        return;
    }

    if (isLogin) {
        // Simulate login (Replace with API call)
        if (localStorage.getItem(username) === password) {
            localStorage.setItem('user', username);
            closeAuthModal();
            checkAuth();
        } else {
            alert('Invalid username or password');
        }
    } else {
        // Simulate signup (Replace with API call)
        if (localStorage.getItem(username)) {
            alert('User already exists');
        } else {
            localStorage.setItem(username, password);
            alert('Signup successful! Please login.');
            openAuthModal('login');
        }
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const authButtons = document.getElementById("authButtons");
    const userPanel = document.getElementById("userPanel");
    const userNameSpan = document.getElementById("userName");

    // Check if user is logged in
    const token = sessionStorage.getItem("token");

    if (token) {
        try {
            // Fetch user details from Flask backend
            const response = await fetch("http://127.0.0.1:5000/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const userData = await response.json();
                userNameSpan.textContent = userData.name; // Set username

                // Show user panel, hide login/signup buttons
                userPanel.classList.remove("hidden");
                authButtons.classList.add("hidden");
            } else {
                console.error("Failed to fetch user data");
                handleLogout(); // If token is invalid, log out
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // Show login/signup buttons, hide user panel
        authButtons.classList.remove("hidden");
        userPanel.classList.add("hidden");
    }
});

// Handle logout
function handleLogout() {
    sessionStorage.removeItem("token");
    window.location.reload(); // Reload to update UI
}


// Initialize authentication state
checkAuth();

/* ---------------- Search Functionality ---------------- */

// Handle search submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchButton.textContent = 'Searching...';
    searchButton.disabled = true;

    try {
        const response = await fetch(`/search?q=${query}`);
        const data = await response.json();

        resultsContainer.innerHTML = '';
        if (data.results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        } else {
            data.results.forEach((result) => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <a href="${result.url}" target="_blank">${result.title}</a>
                    <button onclick="addToSelected('${result.url}', '${result.title}')">Add</button>
                `;
                resultsContainer.appendChild(resultItem);
            });
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
    }

    searchButton.textContent = 'Search';
    searchButton.disabled = false;
});

/* ---------------- Selected Sources ---------------- */

// Add link to the selected panel
function addToSelected(url, title) {
    const linkExists = [...selectedLinks.children].some(
        (child) => child.dataset.url === url
    );

    if (linkExists) return;

    const linkItem = document.createElement('div');
    linkItem.classList.add('selected-link');
    linkItem.dataset.url = url;
    linkItem.innerHTML = `
        <a href="${url}" target="_blank">${title}</a>
        <button onclick="removeSelected('${url}')">Remove</button>
    `;

    selectedLinks.appendChild(linkItem);
}

// Remove selected link
function removeSelected(url) {
    [...selectedLinks.children].forEach((child) => {
        if (child.dataset.url === url) {
            selectedLinks.removeChild(child);
        }
    });
}

/* ---------------- Chat Functionality ---------------- */

// Handle chat submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    // Display user message
    addMessage('user', question);
    chatInput.value = '';

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question }),
        });
        const data = await response.json();

        // Display AI response
        addMessage('bot', data.answer);
    } catch (error) {
        console.error('Error fetching AI response:', error);
        addMessage('bot', 'Sorry, an error occurred.');
    }
});

// Add message to chat panel
function addMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);
    msgDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
