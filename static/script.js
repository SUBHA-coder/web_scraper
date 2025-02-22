// // async function searchLinks() {
// //     const query = document.getElementById("queryInput").value;
// //     if (!query) {
// //         alert("Please enter a problem statement.");
// //         return;
// //     }

// //     try {
// //         const response = await fetch("http://127.0.0.1:5000/search", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ query }),
// //         });

// //         const data = await response.json();
        
// //         if (data.error) {
// //             alert(`Error: ${data.error}`);
// //             return;
// //         }

// //         const linksContainer = document.getElementById("linksContainer");
// //         linksContainer.innerHTML = "";

// //         if (data.links.length === 0) {
// //             linksContainer.innerHTML = "<p>No results found.</p>";
// //             return;
// //         }

// //         data.links.forEach((link, index) => {
// //             const div = document.createElement("div");
// //             div.className = "link-item";
// //             div.innerHTML = `
// //                 <input type="checkbox" id="link${index}" value="${link}">
// //                 <label for="link${index}">${link}</label>
// //             `;
// //             linksContainer.appendChild(div);
// //         });

// //         document.getElementById("results-section").style.display = "block";
// //     } catch (error) {
// //         alert("Error fetching search results.");
// //     }
// // }

// // async function startScraping() {
// //     const checkboxes = document.querySelectorAll("#linksContainer input:checked");
// //     if (checkboxes.length === 0) {
// //         alert("Please select at least one link to scrape.");
// //         return;
// //     }

// //     for (const checkbox of checkboxes) {
// //         try {
// //             const response = await fetch("http://127.0.0.1:5000/scrape", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({ url: checkbox.value }),
// //             });

// //             const data = await response.json();
// //             if (data.error) {
// //                 alert(`Error: ${data.error}`);
// //                 return;
// //             }
// //         } catch (error) {
// //             alert("Error scraping website.");
// //             return;
// //         }
// //     }

// //     alert("Scraping completed!");
// //     document.getElementById("query-section").style.display = "block";
// // }

// // async function askQuestion() {
// //     const question = document.getElementById("questionInput").value;
// //     if (!question) {
// //         alert("Please enter a question.");
// //         return;
// //     }

// //     try {
// //         const response = await fetch("http://127.0.0.1:5000/ask", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ question }),
// //         });

// //         const data = await response.json();
// //         if (data.error) {
// //             alert(`Error: ${data.error}`);
// //             return;
// //         }

// //         document.getElementById("answerContainer").innerText = data.answer || "No response.";
// //     } catch (error) {
// //         alert("Error fetching answer.");
// //     }
// // }
// document.addEventListener("DOMContentLoaded", function() {
//     console.log("App Loaded");
// });

// async function searchLinks() {
//     const query = document.getElementById("queryInput").value.trim();
//     if (!query) {
//         alert("Please enter a problem statement.");
//         return;
//     }

//     const resultsContainer = document.getElementById("resultsContainer");
//     resultsContainer.innerHTML = "Searching...";

//     try {
//         const response = await fetch("http://127.0.0.1:5000/search", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ query }),
//         });

//         const data = await response.json();
//         if (data.error) {
//             alert("Error: " + data.error);
//             return;
//         }

//         resultsContainer.innerHTML = "";
//         data.links.forEach((link) => {
//             const linkItem = document.createElement("div");
//             linkItem.classList.add("link-item");

//             const linkElement = document.createElement("a");
//             linkElement.href = link;
//             linkElement.target = "_blank";
//             linkElement.textContent = link;

//             const addButton = document.createElement("button");
//             addButton.textContent = "➕";
//             addButton.onclick = () => addToPanel(link);

//             linkItem.appendChild(linkElement);
//             linkItem.appendChild(addButton);
//             resultsContainer.appendChild(linkItem);
//         });
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//         alert("Error fetching search results.");
//     }
// }

// function addToPanel(link) {
//     const selectedLinks = document.getElementById("selectedLinks");
//     const existingLinks = Array.from(selectedLinks.getElementsByTagName("a"));

//     if (existingLinks.some((el) => el.href === link)) {
//         alert("This link is already added.");
//         return;
//     }

//     const listItem = document.createElement("li");
//     const linkElement = document.createElement("a");
//     linkElement.href = link;
//     linkElement.target = "_blank";
//     linkElement.textContent = link;

//     listItem.appendChild(linkElement);
//     selectedLinks.appendChild(listItem);
// }

// async function askQuestion() {
//     const questionInput = document.getElementById("questionInput");
//     const question = questionInput.value.trim();
//     if (!question) {
//         alert("Please enter a question.");
//         return;
//     }

//     const chatContainer = document.getElementById("chatContainer");
    
//     // Add User Message
//     const userMessage = document.createElement("div");
//     userMessage.classList.add("chat-message", "user");
//     userMessage.textContent = question;
//     chatContainer.appendChild(userMessage);
//     questionInput.value = "";

//     try {
//         const response = await fetch("http://127.0.0.1:5000/ask", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ question }),
//         });

//         const data = await response.json();
//         const aiMessage = document.createElement("div");
//         aiMessage.classList.add("chat-message", "ai");
//         aiMessage.textContent = data.answer || "No response.";
//         chatContainer.appendChild(aiMessage);
//     } catch (error) {
//         console.error("Error fetching answer:", error);
//         alert("Error fetching answer.");
//     }
// }
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

// Search functionality
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a search query');
        return;
    }

    // Show loading state
    searchButton.disabled = true;
    searchButton.textContent = 'Searching...';
    resultsContainer.innerHTML = '<p class="empty-state">Searching...</p>';

    try {
        const response = await fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Display results
        resultsContainer.innerHTML = '';
        data.links.forEach(link => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.textContent = link;

            const addButton = document.createElement('button');
            addButton.innerHTML = '<i data-lucide="plus"></i>';
            addButton.onclick = (e) => {
                e.preventDefault();
                addToSelected(link);
            };

            resultItem.appendChild(linkElement);
            resultItem.appendChild(addButton);
            resultsContainer.appendChild(resultItem);
        });

        // Reinitialize icons for new elements
        lucide.createIcons();

    } catch (error) {
        resultsContainer.innerHTML = `<p class="empty-state">Error: ${error.message}</p>`;
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Search';
    }
});

// Add link to selected panel
function addToSelected(link) {
    const existingLinks = Array.from(selectedLinks.getElementsByTagName('a'));
    if (existingLinks.some(el => el.href === link)) {
        alert('This source is already selected');
        return;
    }

    // Remove empty state if present
    const emptyState = selectedLinks.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const linkContainer = document.createElement('div');
    linkContainer.className = 'selected-link';

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.textContent = link;

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i data-lucide="x"></i>';
    removeButton.onclick = () => {
        linkContainer.remove();
        if (selectedLinks.children.length === 0) {
            selectedLinks.innerHTML = '<p class="empty-state">No sources selected</p>';
        }
    };

    linkContainer.appendChild(linkElement);
    linkContainer.appendChild(removeButton);
    selectedLinks.appendChild(linkContainer);

    // Reinitialize icons for new elements
    lucide.createIcons();
}

// Chat functionality
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    // Add user message
    addMessage(question, true);
    chatInput.value = '';

    try {
        const response = await fetch('http://127.0.0.1:5000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        addMessage(data.answer || 'Sorry, I could not process your request.', false);

    } catch (error) {
        addMessage('Sorry, there was an error processing your request.', false);
    }
});

// Add message to chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// // Login form handler
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;

//         try {
//             const response = await fetch('/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password })
//             });

//             const data = await response.json();
            
//             if (response.ok) {
//                 window.location.href = '/';
//             } else {
//                 alert(data.error);
//             }
//         } catch (error) {
//             alert('An error occurred during login');
//         }
//     });
// }

// // Signup form handler
// const signupForm = document.getElementById('signupForm');
// if (signupForm) {
//     signupForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;

//         try {
//             const response = await fetch('/signup', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password })
//             });

//             const data = await response.json();
            
//             if (response.ok) {
//                 alert('Account created successfully!');
//                 window.location.href = '/login';
//             } else {
//                 alert(data.error);
//             }
//         } catch (error) {
//             alert('An error occurred during signup');
//         }
//     });
// }
