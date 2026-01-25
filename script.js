console.log('🎯 Script.js loaded successfully!');

// ============ SUPABASE INITIALIZATION ============
// Load Supabase CDN
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = function() {
    console.log('✅ Supabase CDN loaded');
    initializeApp();
};
document.head.appendChild(supabaseScript);

// ============ MAIN APP INITIALIZATION ============
function initializeApp() {
    console.log('🚀 Initializing application...');
    
    // Supabase Configuration
    const SUPABASE_URL = 'https://uhqoihahmocwjgzpiivd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocW9paGFobW9jd2pnenBpaXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2OTUyMTQsImV4cCI6MjA4MTI3MTIxNH0.6HEb9Vy9xR3CFJBRRXPULAQa50wtMgRkPufrh_mGhSY';
    
    // Create Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client created');
    
    // Set current year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        console.log('✅ Current year set:', currentYearSpan.textContent);
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            console.log('📱 Mobile menu toggled');
        });
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
            console.log('📝 Form submitted');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Start loading data
    console.log('📡 Starting to load data from Supabase...');
    loadPortfolioData(supabase);
}

// ============ LOAD PORTFOLIO DATA ============
async function loadPortfolioData(supabase) {
    console.log('🔄 loadPortfolioData function called');
    
    try {
        // 1. Load portfolio content
        await loadPortfolioContent(supabase);
        
        // 2. Load skills
        await loadSkills(supabase);
        
        // 3. Load projects
        await loadProjects(supabase);
        
        // 4. Load career
        await loadCareer(supabase);
        
        console.log('✅ All data loaded successfully!');
        
    } catch (error) {
        console.error('❌ Error loading portfolio data:', error);
        showErrorMessage('Failed to load data: ' + error.message);
    }
}

// ============ LOAD PORTFOLIO CONTENT ============
async function loadPortfolioContent(supabase) {
    console.log('🔄 Loading portfolio content...');
    
    try {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('*');
            
        if (error) {
            console.error('❌ Error loading content:', error);
            return;
        }
        
        console.log('✅ Portfolio content loaded:', data?.length, 'items');
        
        if (data && data.length > 0) {
            // Organize data by section
            const content = {};
            data.forEach(item => {
                if (!content[item.section]) {
                    content[item.section] = {};
                }
                content[item.section][item.field] = item.content;
            });
            
            console.log('📋 Available sections:', Object.keys(content));
            
            // Update Home section
            if (content.home) {
                const heroTitle = document.querySelector('.hero-title');
                const heroSubtitle = document.querySelector('.hero-subtitle');
                const heroDescription = document.querySelector('.hero-description');
                
                if (heroTitle && content.home.hero_title) {
                    heroTitle.textContent = content.home.hero_title;
                }
                if (heroSubtitle && content.home.hero_subtitle) {
                    heroSubtitle.textContent = content.home.hero_subtitle;
                }
                if (heroDescription && content.home.hero_description) {
                    heroDescription.textContent = content.home.hero_description;
                }
            }
            
            // Update About section
            if (content.about) {
                const about1 = document.getElementById('about-text-1');
                const about2 = document.getElementById('about-text-2');
                const about3 = document.getElementById('about-text-3');
                
                if (about1 && content.about.about1) about1.textContent = content.about.about1;
                if (about2 && content.about.about2) about2.innerHTML = `<strong>My unique value:</strong> ${content.about.about2.replace('My unique value:', '').trim()}`;
                if (about3 && content.about.about3) about3.textContent = content.about.about3;
                
                // Update stats
                const updateStat = (id, value) => {
                    const element = document.getElementById(id);
                    if (element && value) element.textContent = value;
                };
                
                updateStat('stat-years', content.about.stat_years);
                updateStat('stat-students', content.about.stat_students);
                updateStat('stat-community', content.about.stat_community);
                updateStat('stat-satisfaction', content.about.stat_satisfaction);
            }
            
            // Update Contact section
            if (content.contact) {
                const emailElement = document.getElementById('contact-email');
                const phoneElement = document.getElementById('contact-phone');
                const locationElement = document.getElementById('contact-location');
                
                if (emailElement && content.contact.email) {
                    emailElement.textContent = content.contact.email;
                    emailElement.href = `mailto:${content.contact.email}`;
                }
                if (phoneElement && content.contact.phone) {
                    phoneElement.textContent = content.contact.phone;
                    phoneElement.href = `tel:${content.contact.phone.replace(/\s/g, '')}`;
                }
                if (locationElement && content.contact.location) {
                    locationElement.textContent = content.contact.location;
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error in loadPortfolioContent:', error);
    }
}

// ============ LOAD SKILLS ============
async function loadSkills(supabase) {
    console.log('🔄 Loading skills...');
    
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) {
            console.error('❌ Skills grid element not found');
            return;
        }
        
        console.log('✅ Skills loaded:', data?.length, 'items');
        
        if (data && data.length > 0) {
            // Clear loading message
            skillsGrid.innerHTML = '';
            
            // Group skills by category
            const skillsByCategory = {};
            data.forEach(skill => {
                if (!skillsByCategory[skill.category]) {
                    skillsByCategory[skill.category] = [];
                }
                skillsByCategory[skill.category].push(skill);
            });
            
            // Create skill categories
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                
                // Choose icon based on category
                let iconClass = 'fas fa-star';
                if (category.toLowerCase().includes('clinical')) iconClass = 'fas fa-heartbeat';
                else if (category.toLowerCase().includes('tech')) iconClass = 'fas fa-laptop-code';
                else if (category.toLowerCase().includes('education')) iconClass = 'fas fa-chalkboard-teacher';
                else if (category.toLowerCase().includes('public')) iconClass = 'fas fa-users';
                
                // Create skills list
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
            
            console.log('✅ Skills displayed on page');
        } else {
            skillsGrid.innerHTML = '<p class="no-data">No skills data available.</p>';
        }
        
    } catch (error) {
        console.error('❌ Error loading skills:', error);
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = '<p class="error">Failed to load skills.</p>';
        }
    }
}

// ============ LOAD PROJECTS ============
async function loadProjects(supabase) {
    console.log('🔄 Loading projects...');
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) {
            console.error('❌ Projects grid element not found');
            return;
        }
        
        console.log('✅ Projects loaded:', data?.length, 'items');
        
        if (data && data.length > 0) {
            // Clear loading message
            projectsGrid.innerHTML = '';
            
            // Create project cards
            data.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Parse tags
                let tagsHTML = '';
                if (project.tags) {
                    if (Array.isArray(project.tags)) {
                        tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                    } else if (typeof project.tags === 'string') {
                        tagsHTML = `<span class="tag">${project.tags}</span>`;
                    }
                }
                
                // Parse outcomes
                let outcomesHTML = '';
                if (project.outcomes) {
                    if (Array.isArray(project.outcomes)) {
                        outcomesHTML = `
                            <div class="project-outcome">
                                <h4>Key Outcomes:</h4>
                                <ul>
                                    ${project.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else if (typeof project.outcomes === 'string') {
                        outcomesHTML = `
                            <div class="project-outcome">
                                <h4>Key Outcomes:</h4>
                                <p>${project.outcomes}</p>
                            </div>
                        `;
                    }
                }
                
                projectCard.innerHTML = `
                    <div class="project-icon">
                        <i class="${project.icon || 'fas fa-project-diagram'}"></i>
                    </div>
                    <h3>${project.title || 'Project Title'}</h3>
                    ${project.role ? `<p class="project-role">${project.role}</p>` : ''}
                    <p class="project-desc">${project.description || 'Project description'}</p>
                    ${outcomesHTML}
                    ${tagsHTML ? `<div class="project-tags">${tagsHTML}</div>` : ''}
                `;
                
                projectsGrid.appendChild(projectCard);
            });
            
            console.log('✅ Projects displayed on page');
        } else {
            projectsGrid.innerHTML = '<p class="no-data">No projects data available.</p>';
        }
        
    } catch (error) {
        console.error('❌ Error loading projects:', error);
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="error">Failed to load projects.</p>';
        }
    }
}

// ============ LOAD CAREER ============
async function loadCareer(supabase) {
    console.log('🔄 Loading career...');
    
    try {
        const { data, error } = await supabase
            .from('career')
            .select('*')
            .order('display_order', { ascending: true });
            
        if (error) throw error;
        
        const careerTimeline = document.getElementById('career-timeline');
        if (!careerTimeline) {
            console.error('❌ Career timeline element not found');
            return;
        }
        
        console.log('✅ Career items loaded:', data?.length, 'items');
        
        if (data && data.length > 0) {
            // Clear loading message
            careerTimeline.innerHTML = '';
            
            // Create timeline items
            data.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                
                // Format date
                let dateText = '';
                if (item.start_date) {
                    if (item.end_date && !item.current) {
                        dateText = `${item.start_date} - ${item.end_date}`;
                    } else if (item.current) {
                        dateText = `${item.start_date} - Present`;
                    } else {
                        dateText = item.start_date;
                    }
                }
                
                timelineItem.innerHTML = `
                    <div class="timeline-date">${dateText}</div>
                    <div class="timeline-content">
                        <h3>${item.position || 'Position'}</h3>
                        <p class="timeline-org">${item.organization || 'Organization'}</p>
                        <p>${item.description || 'Description'}</p>
                    </div>
                `;
                
                careerTimeline.appendChild(timelineItem);
            });
            
            console.log('✅ Career displayed on page');
        } else {
            careerTimeline.innerHTML = '<p class="no-data">No career data available.</p>';
        }
        
    } catch (error) {
        console.error('❌ Error loading career:', error);
        const careerTimeline = document.getElementById('career-timeline');
        if (careerTimeline) {
            careerTimeline.innerHTML = '<p class="error">Failed to load career.</p>';
        }
    }
}

// ============ ERROR HANDLING ============
function showErrorMessage(message) {
    console.error('💥 Showing error:', message);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #f8d7da;
        color: #721c24;
        padding: 15px 25px;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        z-index: 9999;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    errorDiv.innerHTML = `
        <p style="margin: 0;"><i class="fas fa-exclamation-triangle"></i> ${message}</p>
        <small style="opacity: 0.8;">Showing default content</small>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 10 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 10000);
}

// ============ START THE APP ============
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM fully loaded');
        // The script tag loading will start automatically
    });
} else {
    console.log('📄 DOM already loaded');
    // DOM already loaded, script loading will start automatically
}
