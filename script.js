// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const currentYearSpan = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');

// Supabase Configuration - ONLY DECLARE THIS ONCE!
const SUPABASE_URL = 'https://uhqoihahmocwjgzpiivd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocW9paGFobW9jd2pnenBpaXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2OTUyMTQsImV4cCI6MjA4MTI3MTIxNH0.6HEb9Vy9xR3CFJBRRXPULAQa50wtMgRkPufrh_mGhSY';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Set current year in footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Simple form submission handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if(window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// Simple animation for skill cards on scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill and project cards
document.querySelectorAll('.skill-category, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// =============== SUPABASE FUNCTIONS ===============

// Main function to load all data
async function loadPortfolioData() {
    try {
        console.log('Loading portfolio data from Supabase...');
        
        // 1. Load portfolio content (text fields)
        await loadPortfolioContent();
        
        // 2. Load skills
        await loadSkills();
        
        // 3. Load projects
        await loadProjects();
        
        // 4. Load career timeline
        await loadCareer();
        
        // 5. Apply custom styles
        await applyCustomStyles();
        
        console.log('✅ All data loaded successfully!');
        
    } catch (error) {
        console.error('❌ Error loading portfolio data:', error);
        showErrorMessage();
    }
}

async function loadPortfolioContent() {
    try {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*');
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Convert array to object for easy access
            const content = {};
            data.forEach(item => {
                if (!content[item.section]) {
                    content[item.section] = {};
                }
                content[item.section][item.field] = item.content;
            });
            
            // Update Home Section
            updateHomeSection(content.home || {});
            
            // Update About Section
            updateAboutSection(content.about || {});
            
            // Update Contact Section
            updateContactSection(content.contact || {});
        }
        
    } catch (error) {
        console.error('Error loading portfolio content:', error);
    }
}

function updateHomeSection(homeData) {
    // Hero Title
    if (homeData.hero_title) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = homeData.hero_title;
    }
    
    // Hero Subtitle
    if (homeData.hero_subtitle) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = homeData.hero_subtitle;
    }
    
    // Hero Description
    if (homeData.hero_description) {
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) heroDescription.textContent = homeData.hero_description;
    }
    
    // Profile Photo
    if (homeData.profile_photo && homeData.profile_photo.trim() !== '') {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.innerHTML = `
                <div class="profile-photo-container">
                    <img src="${homeData.profile_photo}" 
                         alt="Profile Photo of Kevin Matoka" 
                         class="profile-photo"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 400\"><rect width=\"400\" height=\"400\" fill=\"%232a6e7a\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"80\" fill=\"white\" text-anchor=\"middle\" dy=\".3em\">KM</text></svg>'">
                </div>
            `;
        }
    }
}

function updateAboutSection(aboutData) {
    // About Text 1
    if (aboutData.about1) {
        const about1 = document.getElementById('about-text-1');
        if (about1) about1.textContent = aboutData.about1;
    }
    
    // About Text 2
    if (aboutData.about2) {
        const about2Element = document.getElementById('about-text-2');
        if (about2Element) {
            if (aboutData.about2.includes('My unique value:')) {
                about2Element.innerHTML = `<strong>My unique value:</strong> ${aboutData.about2.replace('My unique value:', '').trim()}`;
            } else {
                about2Element.innerHTML = `<strong>My unique value:</strong> ${aboutData.about2}`;
            }
        }
    }
    
    // About Text 3
    if (aboutData.about3) {
        const about3 = document.getElementById('about-text-3');
        if (about3) about3.textContent = aboutData.about3;
    }
    
    // Stats
    if (aboutData.stat_years) {
        const statYears = document.getElementById('stat-years');
        if (statYears) statYears.textContent = aboutData.stat_years + '+';
    }
    if (aboutData.stat_students) {
        const statStudents = document.getElementById('stat-students');
        if (statStudents) statStudents.textContent = aboutData.stat_students + '+';
    }
    if (aboutData.stat_community) {
        const statCommunity = document.getElementById('stat-community');
        if (statCommunity) statCommunity.textContent = aboutData.stat_community + '+';
    }
    if (aboutData.stat_satisfaction) {
        const statSatisfaction = document.getElementById('stat-satisfaction');
        if (statSatisfaction) statSatisfaction.textContent = aboutData.stat_satisfaction + '%';
    }
}

function updateContactSection(contactData) {
    // Email
    if (contactData.email) {
        const emailElement = document.getElementById('contact-email');
        if (emailElement) {
            emailElement.textContent = contactData.email;
            emailElement.href = `mailto:${contactData.email}`;
        }
    }
    
    // Phone
    if (contactData.phone) {
        const phoneElement = document.getElementById('contact-phone');
        if (phoneElement) {
            phoneElement.textContent = contactData.phone;
            phoneElement.href = `tel:${contactData.phone.replace(/\s/g, '')}`;
        }
    }
    
    // Location
    if (contactData.location) {
        const locationElement = document.getElementById('contact-location');
        if (locationElement) locationElement.textContent = contactData.location;
    }
    
    // Social Links
    if (contactData.linkedin) {
        const linkedinElement = document.getElementById('social-linkedin');
        if (linkedinElement) {
            linkedinElement.href = contactData.linkedin;
            linkedinElement.title = 'LinkedIn Profile';
        }
    }
    if (contactData.github) {
        const githubElement = document.getElementById('social-github');
        if (githubElement) {
            githubElement.href = contactData.github;
            githubElement.title = 'GitHub Profile';
        }
    }
    if (contactData.twitter) {
        const twitterElement = document.getElementById('social-twitter');
        if (twitterElement) {
            twitterElement.href = contactData.twitter;
            twitterElement.title = 'Twitter Profile';
        }
    }
}

async function loadSkills() {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const skillsGrid = document.getElementById('skills-grid');
        
        if (data && data.length > 0) {
            // Group skills by category
            const skillsByCategory = {};
            data.forEach(skill => {
                if (!skillsByCategory[skill.category]) {
                    skillsByCategory[skill.category] = [];
                }
                skillsByCategory[skill.category].push(skill);
            });
            
            // Clear loading message
            skillsGrid.innerHTML = '';
            
            // Create skill categories
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                
                // Determine icon based on category
                let iconClass = 'fas fa-star';
                if (category.includes('Clinical')) iconClass = 'fas fa-heartbeat';
                else if (category.includes('Technology')) iconClass = 'fas fa-laptop-code';
                else if (category.includes('Education')) iconClass = 'fas fa-chalkboard-teacher';
                else if (category.includes('Public Health')) iconClass = 'fas fa-users';
                
                let skillsHTML = '';
                skills.forEach(skill => {
                    skillsHTML += `<li>${skill.skill_name} <span class="skill-level">(${skill.skill_level})</span></li>`;
                });
                
                categoryDiv.innerHTML = `
                    <h3><i class="${iconClass}"></i> ${category}</h3>
                    <ul class="skill-list">
                        ${skillsHTML}
                    </ul>
                `;
                
                skillsGrid.appendChild(categoryDiv);
            });
        } else {
            skillsGrid.innerHTML = '<p class="no-data">No skills data available.</p>';
        }
        
    } catch (error) {
        console.error('Error loading skills:', error);
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid) skillsGrid.innerHTML = '<p class="error">Failed to load skills.</p>';
    }
}

async function loadProjects() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const projectsGrid = document.getElementById('projects-grid');
        
        if (data && data.length > 0) {
            // Clear loading message
            projectsGrid.innerHTML = '';
            
            // Create project cards
            data.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Parse tags (if stored as array)
                let tagsHTML = '';
                if (project.tags && Array.isArray(project.tags) && project.tags.length > 0) {
                    tagsHTML = project.tags.map(tag => 
                        `<span class="tag">${tag}</span>`
                    ).join('');
                } else if (typeof project.tags === 'string' && project.tags.trim() !== '') {
                    tagsHTML = `<span class="tag">${project.tags}</span>`;
                }
                
                // Parse outcomes
                let outcomesHTML = '';
                if (project.outcomes && Array.isArray(project.outcomes) && project.outcomes.length > 0) {
                    outcomesHTML = `
                        <div class="project-outcome">
                            <h4>Key Outcomes:</h4>
                            <ul>
                                ${project.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                } else if (typeof project.outcomes === 'string' && project.outcomes.trim() !== '') {
                    outcomesHTML = `
                        <div class="project-outcome">
                            <h4>Key Outcomes:</h4>
                            <p>${project.outcomes}</p>
                        </div>
                    `;
                }
                
                projectCard.innerHTML = `
                    <div class="project-icon">
                        <i class="${project.icon || 'fas fa-project-diagram'}"></i>
                    </div>
                    <h3>${project.title || 'Project Title'}</h3>
                    ${project.role ? `<p class="project-role">${project.role}</p>` : ''}
                    <p class="project-desc">${project.description || 'Project description goes here.'}</p>
                    ${outcomesHTML}
                    ${tagsHTML ? `<div class="project-tags">${tagsHTML}</div>` : ''}
                `;
                
                projectsGrid.appendChild(projectCard);
            });
        } else {
            projectsGrid.innerHTML = '<p class="no-data">No projects data available.</p>';
        }
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) projectsGrid.innerHTML = '<p class="error">Failed to load projects.</p>';
    }
}

async function loadCareer() {
    try {
        const { data, error } = await supabase
            .from('career')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const careerTimeline = document.getElementById('career-timeline');
        
        if (data && data.length > 0) {
            // Clear loading message
            careerTimeline.innerHTML = '';
            
            // Create career timeline items
            data.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                
                let dateText = '';
                if (item.start_date && item.end_date) {
                    dateText = `${item.start_date} - ${item.end_date}`;
                } else if (item.start_date) {
                    dateText = `${item.start_date}${item.current ? ' - Present' : ''}`;
                } else if (item.end_date) {
                    dateText = `${item.end_date}`;
                }
                
                timelineItem.innerHTML = `
                    <div class="timeline-date">${dateText}</div>
                    <div class="timeline-content">
                        <h3>${item.position || 'Position'}</h3>
                        <p class="timeline-org">${item.organization || 'Organization'}</p>
                        <p>${item.description || 'Description of role and responsibilities.'}</p>
                    </div>
                `;
                
                careerTimeline.appendChild(timelineItem);
            });
        } else {
            careerTimeline.innerHTML = '<p class="no-data">No career data available.</p>';
        }
        
    } catch (error) {
        console.error('Error loading career:', error);
        const careerTimeline = document.getElementById('career-timeline');
        if (careerTimeline) careerTimeline.innerHTML = '<p class="error">Failed to load career timeline.</p>';
    }
}

async function applyCustomStyles() {
    try {
        // Load settings
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*')
            .eq('section', 'settings');
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            const settings = {};
            data.forEach(item => {
                settings[item.field] = item.content;
            });
            
            const root = document.documentElement;
            
            // Apply primary color
            if (settings.primary_color) {
                root.style.setProperty('--primary', settings.primary_color);
            }
            
            // Apply secondary color
            if (settings.secondary_color) {
                root.style.setProperty('--secondary', settings.secondary_color);
            }
            
            // Apply font family
            if (settings.font_family) {
                document.body.style.fontFamily = `${settings.font_family}, sans-serif`;
            }
            
            // Apply custom CSS
            if (settings.custom_css && settings.custom_css.trim() !== '') {
                const style = document.createElement('style');
                style.textContent = settings.custom_css;
                document.head.appendChild(style);
            }
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'data-error';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        margin: 10px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <p><i class="fas fa-exclamation-triangle"></i> Unable to load portfolio data.</p>
        <small>Showing default content. Please check your internet connection.</small>
    `;
    document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Initialize Supabase data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load data from Supabase
    loadPortfolioData();
});
