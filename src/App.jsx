import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ message: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply dark mode class to HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll spy for active nav link
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: 'Sending...', isError: false });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY_HERE',
          subject: 'New Submission from Portfolio',
          ...formData
        })
      });

      const json = await response.json();

      if (response.status === 200) {
        setFormStatus({ message: json.message || "Message sent successfully!", isError: false });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus({ message: json.message || "Something went wrong!", isError: true });
      }
    } catch (error) {
      setFormStatus({ message: "Something went wrong!", isError: true });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFormStatus({ message: '', isError: false });
      }, 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <header className="navbar">
        <div className="container nav-container">
          <a href="#" className="logo">JD.</a>
          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {['about', 'skills', 'projects', 'blog', 'contact'].map((section) => (
              <a 
                key={section}
                href={`#${section}`} 
                className={activeSection === section ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </nav>
          <div className="nav-controls">
            <button 
              id="theme-toggle" 
              aria-label="Toggle Dark/Light Mode"
              onClick={() => setIsDark(!isDark)}
            >
              <i className={isDark ? 'bx bx-sun' : 'bx bx-moon'}></i>
            </button>
            <button 
              className="mobile-menu-btn" 
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={isMobileMenuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero section">
          <div className="container hero-container">
            <div className="hero-content animate-on-scroll">
              <span className="greeting">Hi, I'm</span>
              <h1 className="name">John Doe</h1>
              <h2 className="role">Full Stack Developer</h2>
              <p className="tagline">Crafting digital experiences with modern web technologies. I turn complex problems into elegant, performant solutions.</p>
              <div className="hero-cta">
                <a href="#projects" className="btn btn-primary">View My Work</a>
                <a href="#contact" className="btn btn-secondary">Contact Me</a>
              </div>
              <div className="social-links">
                <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className='bx bxl-linkedin-square'></i></a>
                <a href="#" target="_blank" rel="noreferrer" aria-label="GitHub"><i className='bx bxl-github'></i></a>
              </div>
            </div>
            <div className="hero-image-wrapper animate-on-scroll">
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="John Doe" loading="lazy" />
              </div>
              <div className="blob-bg"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">About Me</h2>
            <div className="about-content animate-on-scroll">
              <div className="about-text">
                <p>I am a passionate software engineer with over 5 years of experience building highly scalable and resilient web applications. My journey started with a fascination for how the web works, which quickly evolved into a deep dive into JavaScript ecosystems and modern architecture.</p>
                <p>When I'm not coding, you can find me contributing to open-source projects, writing technical articles on my blog, or exploring the outdoors. I believe in continuous learning and always pushing the boundaries of what's possible on the web.</p>
              </div>
              <div className="about-stats">
                <div className="stat-card">
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat-card">
                  <h3>50+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat-card">
                  <h3>10+</h3>
                  <p>Open Source Contributions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills section glass-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Technical Skills</h2>
            <div className="skills-grid animate-on-scroll">
              
              <div className="skill-category card">
                <div className="category-header">
                  <i className='bx bx-code-alt'></i>
                  <h3>Frontend</h3>
                </div>
                <ul className="skill-list">
                  <li>
                    <div className="skill-info"><span>React / Next.js</span><span>Expert</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '90%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>HTML5 / CSS3</span><span>Expert</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '95%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>TypeScript</span><span>Advanced</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '85%'}}></div></div>
                  </li>
                </ul>
              </div>
              
              <div className="skill-category card">
                <div className="category-header">
                  <i className='bx bx-server'></i>
                  <h3>Backend</h3>
                </div>
                <ul className="skill-list">
                  <li>
                    <div className="skill-info"><span>Node.js / Express</span><span>Advanced</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '85%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>Python / Django</span><span>Intermediate</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '70%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>GraphQL</span><span>Advanced</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '80%'}}></div></div>
                  </li>
                </ul>
              </div>
              
              <div className="skill-category card">
                <div className="category-header">
                  <i className='bx bx-data'></i>
                  <h3>Database & DevOps</h3>
                </div>
                <ul className="skill-list">
                  <li>
                    <div className="skill-info"><span>PostgreSQL / MongoDB</span><span>Advanced</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '85%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>Docker / Kubernetes</span><span>Intermediate</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '65%'}}></div></div>
                  </li>
                  <li>
                    <div className="skill-info"><span>AWS / Vercel</span><span>Advanced</span></div>
                    <div className="progress-bar"><div className="progress" style={{width: '80%'}}></div></div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Featured Projects</h2>
            <div className="projects-wrapper">
              
              {/* Project 1 */}
              <article className="project-card animate-on-scroll">
                <div className="project-image">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fintech Dashboard" loading="lazy" />
                </div>
                <div className="project-info">
                  <h3>Fintech Analytics Dashboard</h3>
                  <div className="tech-stack">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">TypeScript</span>
                    <span className="tech-tag">Tailwind</span>
                    <span className="tech-tag">Node.js</span>
                  </div>
                  <div className="project-desc">
                    <strong>Problem:</strong> Financial analysts needed a unified view to process millions of transactions in real-time, as existing tools were fragmented and slow.<br/><br/>
                    <strong>Solution:</strong> Built a high-performance web app utilizing WebSockets for real-time updates and Web Workers for off-thread data processing, reducing load times by 40%.
                  </div>
                  <div className="project-links">
                    <a href="#" className="btn btn-outline" target="_blank" rel="noreferrer"><i className='bx bx-link-external'></i> Live Demo</a>
                    <a href="#" className="btn btn-text" target="_blank" rel="noreferrer"><i className='bx bx-book-open'></i> Case Study</a>
                  </div>
                </div>
              </article>

              {/* Project 2 */}
              <article className="project-card reverse animate-on-scroll">
                <div className="project-image">
                  <img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="E-commerce Platform" loading="lazy" />
                </div>
                <div className="project-info">
                  <h3>NextGen E-commerce Platform</h3>
                  <div className="tech-stack">
                    <span className="tech-tag">Next.js</span>
                    <span className="tech-tag">GraphQL</span>
                    <span className="tech-tag">PostgreSQL</span>
                    <span className="tech-tag">Stripe</span>
                  </div>
                  <div className="project-desc">
                    <strong>Problem:</strong> A boutique brand experienced massive drop-offs during checkout due to a cumbersome, multi-step payment process.<br/><br/>
                    <strong>Solution:</strong> Designed a streamlined, single-page checkout flow integrated with Stripe. Implemented static site generation for product pages to enhance SEO and load speeds.
                  </div>
                  <div className="project-links">
                    <a href="#" className="btn btn-outline" target="_blank" rel="noreferrer"><i className='bx bx-link-external'></i> Live Demo</a>
                    <a href="#" className="btn btn-text" target="_blank" rel="noreferrer"><i className='bx bx-book-open'></i> Case Study</a>
                  </div>
                </div>
              </article>

              {/* Project 3 */}
              <article className="project-card animate-on-scroll">
                <div className="project-image">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="AI Content Generator" loading="lazy" />
                </div>
                <div className="project-info">
                  <h3>AI-Powered Writing Assistant</h3>
                  <div className="tech-stack">
                    <span className="tech-tag">Vue.js</span>
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">FastAPI</span>
                    <span className="tech-tag">OpenAI API</span>
                  </div>
                  <div className="project-desc">
                    <strong>Problem:</strong> Marketing teams struggled to maintain a consistent brand voice while scaling content production across multiple channels.<br/><br/>
                    <strong>Solution:</strong> Developed a custom AI writing tool that fine-tunes LLM outputs based on uploaded brand guidelines, accelerating content creation by 300%.
                  </div>
                  <div className="project-links">
                    <a href="#" className="btn btn-outline" target="_blank" rel="noreferrer"><i className='bx bx-link-external'></i> Live Demo</a>
                    <a href="#" className="btn btn-text" target="_blank" rel="noreferrer"><i className='bx bx-book-open'></i> Case Study</a>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="blog section glass-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Latest Insights</h2>
            <div className="blog-grid animate-on-scroll">
              <article className="blog-card">
                <div className="blog-date">Oct 12, 2026</div>
                <h3>Mastering CSS Grid Architectures</h3>
                <p>Dive deep into modern CSS Grid techniques to build complex, responsive layouts with minimal code and maximum flexibility.</p>
                <a href="#" className="read-more">Read Article <i className='bx bx-right-arrow-alt'></i></a>
              </article>
              <article className="blog-card">
                <div className="blog-date">Sep 28, 2026</div>
                <h3>The Future of React Server Components</h3>
                <p>Exploring how RSCs are fundamentally changing the way we think about state, hydration, and rendering in modern web applications.</p>
                <a href="#" className="read-more">Read Article <i className='bx bx-right-arrow-alt'></i></a>
              </article>
              <article className="blog-card">
                <div className="blog-date">Aug 15, 2026</div>
                <h3>Optimizing Web Core Vitals</h3>
                <p>A practical guide to identifying bottlenecks and improving LCP, FID, and CLS scores for enterprise-scale platforms.</p>
                <a href="#" className="read-more">Read Article <i className='bx bx-right-arrow-alt'></i></a>
              </article>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container">
            <div className="contact-wrapper animate-on-scroll">
              <div className="contact-info">
                <h2 className="section-title">Let's Connect</h2>
                <p>I'm currently looking for new opportunities. Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!</p>
                
                <div className="contact-details">
                  <a href="mailto:hello@johndoe.com" className="contact-link">
                    <i className='bx bx-envelope'></i>
                    <span>hello@johndoe.com</span>
                  </a>
                  <a href="#" className="contact-link" target="_blank" rel="noreferrer">
                    <i className='bx bxl-linkedin-square'></i>
                    <span>linkedin.com/in/johndoe</span>
                  </a>
                  <a href="#" className="contact-link" target="_blank" rel="noreferrer">
                    <i className='bx bxl-github'></i>
                    <span>github.com/johndoe</span>
                  </a>
                </div>
              </div>

              <div className="contact-form-container card">
                <form id="contact-form" onSubmit={handleFormSubmit} className="contact-form">
                  <input type="checkbox" name="botcheck" className="hidden" style={{display: 'none'}} />
                  
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="5" 
                      required 
                      placeholder="How can I help you?"
                      value={formData.message}
                      onChange={handleFormChange}
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <i className='bx bx-send'></i>
                  </button>
                  
                  {formStatus.message && (
                    <p className={`form-result ${formStatus.isError ? 'text-red-500' : 'text-green-500'}`}>
                      {formStatus.message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-container">
          <p>&copy; {currentYear} John Doe. Built with standard web technologies.</p>
          <div className="footer-links">
            <a href="#hero">Back to Top <i className='bx bx-up-arrow-alt'></i></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
