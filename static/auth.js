// // Initialize Lucide icons
// lucide.createIcons();

// // DOM Elements
// const loginForm = document.getElementById('loginForm');
// const signupForm = document.getElementById('signupForm');

// // Handle Login
// if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const remember = document.getElementById('remember').checked;

//         try {
//             // For demo purposes, we'll just simulate a successful login
//             localStorage.setItem('token', 'demo-token');
//             localStorage.setItem('userName', email.split('@')[0]);
//             window.location.href = 'index.html';
//         } catch (error) {
//             alert(error.message || 'Login failed. Please try again.');
//         }
//     });
// }

// // Handle Signup
// if (signupForm) {
//     signupForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         const name = document.getElementById('name').value;
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confirmPassword').value;
//         const terms = document.getElementById('terms').checked;

//         // Validation
//         if (password !== confirmPassword) {
//             alert('Passwords do not match');
//             return;
//         }

//         if (!terms) {
//             alert('Please accept the terms and conditions');
//             return;
//         }

//         try {
//             // For demo purposes, redirect to login page after successful signup
//             alert('Account created successfully! Please log in.');
//             window.location.href = 'login.html';
//         } catch (error) {
//             alert(error.message || 'Signup failed. Please try again.');
//         }
//     });
// }

// // Password visibility toggle
// document.querySelectorAll('input[type="password"]').forEach(input => {
//     const toggleButton = document.createElement('button');
//     toggleButton.type = 'button';
//     toggleButton.className = 'password-toggle';
//     toggleButton.innerHTML = '<i data-lucide="eye"></i>';
    
//     toggleButton.addEventListener('click', () => {
//         const type = input.type === 'password' ? 'text' : 'password';
//         input.type = type;
//         toggleButton.innerHTML = `<i data-lucide="${type === 'password' ? 'eye' : 'eye-off'}"></i>`;
//         lucide.createIcons();
//     });

//     input.parentElement.appendChild(toggleButton);
// });
// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('token', data.user);
                window.location.href = "/";


            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    });
}

// Handle Signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Signup successful! Please log in.');
                window.location.href = "/login";

            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Signup failed. Please try again.');
        }
    });
}


// Password visibility toggle
document.querySelectorAll('.password-container').forEach(container => {
    const input = container.querySelector('input[type="password"]');
    const toggleButton = document.createElement('button');
    
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle';
    toggleButton.innerHTML = '<i data-lucide="eye"></i>';

    toggleButton.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        toggleButton.innerHTML = `<i data-lucide="${input.type === 'password' ? 'eye' : 'eye-off'}"></i>`;
        lucide.createIcons();
    });

    container.appendChild(toggleButton);
});
