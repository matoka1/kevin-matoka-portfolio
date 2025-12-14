// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const adminPassword = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const saveBtn = document.getElementById('saveBtn');
    const previewBtn = document.getElementById('previewBtn');
    const saveStatus = document.getElementById('saveStatus');
    const lastSavedTime = document.getElementById('lastSavedTime');
    
    // Default password (you should change this!)
    const DEFAULT_PASSWORD = 'admin123';
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.editor-section');
    
    // Initialize
    initAdmin();
    
    // Functions
    function initAdmin() {
        // Check if already logged in
        if(localStorage.getItem('adminLoggedIn') === 'true') {
            showDashboard();
        }
        
        // Login button
        loginBtn.addEventListener('click', handleLogin);
        
        // Logout button
        logoutBtn.addEventListener('click', handleLogout);
        
        // Save button
        saveBtn.addEventListener('click', saveChanges);
        
        // Preview button
        previewBtn.addEventListener('click', function() {
            document.getElementById('livePreview').contentWindow.location.reload();
        });
        
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if(section.id === targetId) {
                        section.classList.add('active');
                    }
                });
            });
        });
        
        // Auto-save on input change
        setupAutoSave();
        
        // Load saved data
        loadSavedData();
        
        // Update preview on changes
        setupLivePreview();
    }
    
    function handleLogin() {
        const password = adminPassword.value.trim();
        
        if(password === DEFAULT_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Incorrect password! Try: admin123');
            adminPassword.value = '';
            adminPassword.focus();
        }
    }
    
    function handleLogout() {
        localStorage.removeItem('adminLoggedIn');
        showLogin();
    }
    
    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        updateLastSavedTime();
    }
    
    function showLogin() {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
        adminPassword.value = '';
    }
    
    function setupAutoSave() {
        // Get all editable inputs
        const inputs = document.querySelectorAll('.editor-input, .editor-textarea, .editor-select, input[type="number"], input[type="color"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveStatus.innerHTML = '<i class="fas fa-sync-alt"></i> Unsaved changes';
                saveStatus.style.color = '#ff9800';
            });
        });
    }
    
    function saveChanges() {
        // Collect all data
        const portfolioData = {
            // Home section
            heroTitle: document.getElementById('edit-hero-title').value,
            heroSubtitle: document.getElementById('edit-hero-subtitle').value,
            heroDescription: document.getElementById('edit-hero-description').value,
            profilePhoto: document.getElementById('edit-profile-photo').value,
            
            // About section
            aboutText1: document.getElementById('edit-about1').value,
            aboutText2: document.getElementById('edit-about2').value,
            stats: {
                years: document.getElementById('edit-stat1').value,
                students: document.getElementById('edit-stat2').value,
                community: document.getElementById('edit-stat3').value,
                satisfaction: document.getElementById('edit-stat4').value
            },
            
            // Contact section
            email: document.getElementById('edit-contact-email').value,
            phone: document.getElementById('edit-contact-phone').value,
            location: document.getElementById('edit-contact-location').value,
            social: {
                linkedin: document.getElementById('edit-linkedin').value,
                github: document.getElementById('edit-github').value,
                twitter: document.getElementById('edit-twitter').value
            },
            
            // Style settings
            colors: {
                primary: document.getElementById('edit-color-primary').value,
                secondary: document.getElementById('edit-color-secondary').value
            },
            fontFamily: document.getElementById('edit-font-family').value,
            customCSS: document.getElementById('edit-custom-css').value
        };
        
        // Save to localStorage
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // Update main page data file (for production, this would be server-side)
        updateMainPage();
        
        // Update status
        saveStatus.innerHTML = '<i class="fas fa-check-circle"></i> All changes saved';
        saveStatus.style.color = '#4caf50';
        updateLastSavedTime();
    }
    
    function loadSavedData() {
        const savedData = localStorage.getItem('portfolioData');
        if(savedData) {
            const data = JSON.parse(savedData);
            
            // Load data into form fields
            document.getElementById('edit-hero-title').value = data.heroTitle || '';
            document.getElementById('edit-hero-subtitle').value = data.heroSubtitle || '';
            document.getElementById('edit-hero-description').value = data.heroDescription || '';
            document.getElementById('edit-profile-photo').value = data.profilePhoto || '';
            
            document.getElementById('edit-about1').value = data.aboutText1 || '';
            document.getElementById('edit-about2').value = data.aboutText2 || '';
            
            if(data.stats) {
                document.getElementById('edit-stat1').value = data.stats.years || '2';
                document.getElementById('edit-stat2').value = data.stats.students || '500';
                document.getElementById('edit-stat3').value = data.stats.community || '1000';
                document.getElementById('edit-stat4').value = data.stats.satisfaction || '98';
            }
            
            document.getElementById('edit-contact-email').value = data.email || '';
            document.getElementById('edit-contact-phone').value = data.phone || '';
            document.getElementById('edit-contact-location').value = data.location || '';
            
            if(data.social) {
                document.getElementById('edit-linkedin').value = data.social.linkedin || '';
                document.getElementById('edit-github').value = data.social.github || '';
                document.getElementById('edit-twitter').value = data.social.twitter || '';
            }
            
            if(data.colors) {
                document.getElementById('edit-color-primary').value = data.colors.primary || '#2a6e7a';
                document.getElementById('edit-color-primary-text').value = data.colors.primary || '#2a6e7a';
                document.getElementById('edit-color-secondary').value = data.colors.secondary || '#e63946';
                document.getElementById('edit-color-secondary-text').value = data.colors.secondary || '#e63946';
            }
            
            document.getElementById('edit-font-family').value = data.fontFamily || 'Poppins';
            document.getElementById('edit-custom-css').value = data.customCSS || '';
        }
    }
    
    function updateMainPage() {
        // This function would update your main portfolio page
        // For now, we'll just reload the preview iframe
        const previewFrame = document.getElementById('livePreview');
        if(previewFrame) {
            previewFrame.contentWindow.location.reload();
        }
    }
    
    function updateLastSavedTime() {
        const now = new Date();
        lastSavedTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    function setupLivePreview() {
        // Sync color pickers with text inputs
        const colorPrimary = document.getElementById('edit-color-primary');
        const colorPrimaryText = document.getElementById('edit-color-primary-text');
        const colorSecondary = document.getElementById('edit-color-secondary');
        const colorSecondaryText = document.getElementById('edit-color-secondary-text');
        
        colorPrimary.addEventListener('input', function() {
            colorPrimaryText.value = this.value;
        });
        
        colorPrimaryText.addEventListener('input', function() {
            colorPrimary.value = this.value;
        });
        
        colorSecondary.addEventListener('input', function() {
            colorSecondaryText.value = this.value;
        });
        
        colorSecondaryText.addEventListener('input', function() {
            colorSecondary.value = this.value;
        });
    }
    
    // Allow Enter key to login
    adminPassword.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            handleLogin();
        }
    });
});
