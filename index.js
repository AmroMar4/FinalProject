const loginSection = document.getElementById('loginSection');
const loggedInSection = document.getElementById('loggedInSection');
const userGreeting = document.getElementById('userGreeting');
const logoutBtn = document.getElementById('logoutBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeButtons = document.querySelectorAll('.close');
const personalWelcome = document.getElementById('personalWelcome');
const userNameDisplay = document.getElementById('userNameDisplay');
const loginStatus = document.getElementById('loginStatus');
const loginTime = document.getElementById('loginTime');

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];


function updateLoginUI() {
    if (currentUser) {
       
        loginSection.style.display = 'none';
        loggedInSection.style.display = 'flex'; 
        personalWelcome.style.display = 'block'; 
        
    
        userGreeting.textContent = `Hi, ${currentUser.name.split(' ')[0]}!`;
        userNameDisplay.textContent = currentUser.name;
        loginStatus.textContent = 'Logged In';
        loginStatus.style.color = '#10b981';
        
        
        if (currentUser.lastLogin) {
            const lastLogin = new Date(currentUser.lastLogin);
            loginTime.textContent = `Last login: ${lastLogin.toLocaleDateString()}`;
        } else {
            loginTime.textContent = 'Welcome to TechLearn!';
        }
    } else {
       
        loginSection.style.display = 'block';
        loggedInSection.style.display = 'none';
        personalWelcome.style.display = 'none';
        loginStatus.textContent = 'Not Logged In';
        loginStatus.style.color = '#ef4444';
        loginTime.textContent = 'Register to track your progress';
    }
}

function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

showLoginBtn.addEventListener('click', () => showModal(loginModal));
showRegisterBtn.addEventListener('click', () => showModal(registerModal));

closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        hideModal(loginModal);
        hideModal(registerModal);
    });
});

window.addEventListener('click', function(event) {
    if (event.target === loginModal) hideModal(loginModal);
    if (event.target === registerModal) hideModal(registerModal);
});

registerForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
   
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    
    const emailExists = allUsers.find(user => user.email === email);
    
    if (emailExists) {
        
        document.getElementById('registerError').style.display = 'block';
        return;
    }
    
    
    const newUser = {
        name: name,
        email: email,
        password: password, 
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
   
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    
    registerForm.reset();
    hideModal(registerModal);
    
  
    location.reload();
});


loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
   
    const user = allUsers.find(user => 
        user.email === email && user.password === password
    );
    
    if (user) {
      
        user.lastLogin = new Date().toISOString();
        
        
        const userIndex = allUsers.findIndex(u => u.email === email);
        allUsers[userIndex] = user;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
       
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        
        loginForm.reset();
        hideModal(loginModal);
        
      
        document.getElementById('loginError').style.display = 'none';
        location.reload();
    } else {
        
        document.getElementById('loginError').style.display = 'block';
    }
});

logoutBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        location.reload(); 
    }
});

const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️ Light Mode';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

const wishlistCount = document.getElementById('wishlistCount');
const wishlistContainer = document.getElementById('wishlistContainer');

let wishlist = [];

function loadWishlist() {
    if (currentUser) {
        wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.email}`)) || [];
    } else {
        wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    }
}

function saveWishlist() {
    if (currentUser) {
        localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(wishlist));
    } else {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function toggleWishlist(courseId) {
    if (wishlist.includes(courseId)) {
        wishlist = wishlist.filter(item => item !== courseId);
    } else {
        wishlist.push(courseId);
    }
    
    saveWishlist();
    
    updateWishlistDisplay();
    
    incrementCoursesViewed();
}

function updateWishlistDisplay() {
    wishlistCount.textContent = wishlist.length;
    
    wishlistContainer.innerHTML = '';
    
    wishlist.forEach(courseId => {
        const courseElement = document.querySelector(`[data-course="${courseId}"]`);
        if (courseElement) {
            const courseCard = document.createElement('div');
            courseCard.className = 'course';
            courseCard.dataset.course = courseId;
            
            const courseTitle = courseElement.querySelector('h3').textContent;
            const courseDesc = courseElement.querySelector('p').textContent;
            const courseLevel = courseElement.querySelector('span').textContent;
            const courseLink = courseElement.querySelector('a').href;
            
            courseCard.innerHTML = `
                <h3>${courseTitle}</h3>
                <p>${courseDesc}</p>
                <span>${courseLevel}</span>
                <br>
                <a href="${courseLink}" target="_blank">View Course</a>
                <button class="remove-wishlist-btn" data-course="${courseId}">🗑️ Remove</button>
            `;
            
            wishlistContainer.appendChild(courseCard);
        }
    });
    
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const courseId = button.getAttribute('data-course');
        if (wishlist.includes(courseId)) {
            button.textContent = '✅ In Wishlist';
            button.classList.add('added');
        } else {
            button.textContent = '⭐ Add to Wishlist';
            button.classList.remove('added');
        }
    });
    
    document.querySelectorAll('.remove-wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            toggleWishlist(courseId);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            toggleWishlist(courseId);
        });
    });
});

let visitCount = localStorage.getItem('visitCount') || 0;
let coursesViewed = localStorage.getItem('coursesViewed') || 0;

visitCount++;
localStorage.setItem('visitCount', visitCount);
document.getElementById('visitCount').textContent = visitCount;

document.getElementById('coursesViewed').textContent = coursesViewed;

function incrementCoursesViewed() {
    coursesViewed++;
    localStorage.setItem('coursesViewed', coursesViewed);
    document.getElementById('coursesViewed').textContent = coursesViewed;
}

document.getElementById('resetViews').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset your course views counter?')) {
        coursesViewed = 0;
        localStorage.setItem('coursesViewed', coursesViewed);
        document.getElementById('coursesViewed').textContent = coursesViewed;
    }
});

document.querySelectorAll('.course a').forEach(link => {
    link.addEventListener('click', incrementCoursesViewed);
});


loadWishlist(); 
updateLoginUI(); 
updateWishlistDisplay(); 