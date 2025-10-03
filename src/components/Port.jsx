import React from 'react'
import profileImage from '../assets/picofme.png'

const Portfolio = () => {
  return (
    <html style={{ scrollBehavior: 'smooth' }}>
      <div className="min-h-screen bg-vintage-cream font-vintage">
        {/* Wikipedia-style Header */}
        <div className="border-b border-vintage-gold/30 bg-vintage-paper px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-vintage font-bold text-vintage-black"></h1>
              <span className="text-sm text-vintage-brown font-serif">Developer Encyclopedia</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="bg-vintage-gold text-white px-4 py-2 rounded font-serif text-sm hover:bg-vintage-brass transition-colors"
              >
                ← Back to LinkShala
              </a>
              <div className="text-xs text-vintage-brown/70 font-serif">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          {/* Title */}
          <h1 className="text-4xl font-vintage font-bold border-b-4 border-vintage-gold/50 pb-2 mb-6 text-vintage-black">
            Akhilesh Yadav
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-vintage-brown mb-8 font-serif italic">
            Full Stack Developer 
          </p>

          {/* Info Box */}
          <div className="float-right ml-6 mb-6 w-80 border border-vintage-gold/30 bg-vintage-paper p-4">
            <div className="text-center mb-4">
              <img 
                src={profileImage} 
                alt="Akhilesh Yadav" 
                className="w-32 h-32 mx-auto mb-2 object-cover border-2 border-vintage-gold/30 rounded"
              />
              <div className="text-sm text-vintage-brown font-serif">Akhilesh Yadav</div>
            </div>
            
            <table className="w-full text-sm font-serif">
              <tbody>
                <tr className="border-b border-vintage-gold/20">
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Born</td>
                  <td className="py-1 text-vintage-brown">2003</td>
                </tr>
                <tr className="border-b border-vintage-gold/20">
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Nationality</td>
                  <td className="py-1 text-vintage-brown">Indian</td>
                </tr>
                <tr className="border-b border-vintage-gold/20">
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Occupation</td>
                  <td className="py-1 text-vintage-brown">Freelancer</td>
                </tr>
                <tr className="border-b border-vintage-gold/20">
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Years active</td>
                  <td className="py-1 text-vintage-brown">2022–present</td>
                </tr>
                <tr className="border-b border-vintage-gold/20">
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Known for</td>
                  <td className="py-1 text-vintage-brown">Web Development</td>
                </tr>
                <tr>
                  <td className="font-vintage font-semibold py-1 pr-2 text-vintage-black">Website</td>
                  <td className="py-1">
                    <a href="mailto:infinityy2501@gmail.com" className="text-vintage-gold underline hover:text-vintage-brass">
                     
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table of Contents */}
          <div className="border border-vintage-gold/30 bg-vintage-paper p-4 mb-8 w-fit">
            <div className="font-vintage font-bold mb-2 text-vintage-black">Contents</div>
            <ol className="text-sm space-y-1 font-serif">
              <li><a href="#biography" className="text-vintage-gold underline hover:text-vintage-brass">1 Biography</a></li>
              <li><a href="#career" className="text-vintage-gold underline hover:text-vintage-brass">2 Career</a></li>
              <li><a href="#skills" className="text-vintage-gold underline hover:text-vintage-brass">3 Technical Skills</a></li>
              <li><a href="#projects" className="text-vintage-gold underline hover:text-vintage-brass">4 Projects</a></li>
              <li><a href="#education" className="text-vintage-gold underline hover:text-vintage-brass">5 Education</a></li>
              <li><a href="#contact" className="text-vintage-gold underline hover:text-vintage-brass">6 Contact Information</a></li>
             
            </ol>
          </div>

          {/* Biography Section */}
          <section id="biography" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Biography</h2>
            <p className="mb-4 leading-relaxed font-serif text-vintage-coffee">
              I am <strong className="font-vintage">Akhilesh Yadav</strong>, an Indian software developer and full-stack engineer specializing in modern web technologies. 
              Born in 2003, I have established myself as a proficient developer with expertise in JavaScript, React, Node.js, and database management systems.
            </p>
            <p className="mb-4 leading-relaxed font-serif text-vintage-coffee">
              I began my programming journey in 2022 and have since developed numerous web applications, contributing to both frontend and backend development. 
              My work primarily focuses on creating scalable web solutions and user-friendly interfaces.
            </p>
          </section>

          {/* Career Section */}
          <section id="career" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Career</h2>
            
            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Early Career (2020-2022)</h3>
            <p className="mb-4 leading-relaxed font-serif text-vintage-coffee">
              I started my career as a self-taught developer, focusing on frontend technologies including HTML, CSS, and JavaScript. 
              During this period, I developed foundational skills in responsive web design and user interface development.
            </p>

            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Professional Development (2022-present)</h3>
            <p className="mb-4 leading-relaxed font-serif text-vintage-coffee">
              Transitioning to full-stack development, I expanded my expertise to include backend technologies such as Node.js, Express.js, and MongoDB. 
              I have since worked on various projects ranging from e-commerce platforms to content management systems.
            </p>
          </section>

          {/* Technical Skills Section */}
          <section id="skills" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Technical Skills</h2>
            
            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Programming Languages</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 font-serif text-vintage-coffee">
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>Python</li>
              <li>HTML5 & CSS3</li>
            </ul>

            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Frameworks and Libraries</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 font-serif text-vintage-coffee">
              <li>React.js</li>
              <li>Next.js</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>Tailwind CSS</li>
            </ul>

            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Databases</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 font-serif text-vintage-coffee">
              <li>MongoDB</li>
              <li>PostgreSQL</li>
              <li>MySQL</li>
            </ul>

            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Tools and Technologies</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 font-serif text-vintage-coffee">
              <li>Git & GitHub</li>
              <li>Docker</li>
              <li>AWS</li>
              <li>Vercel</li>
              <li>Postman</li>
            </ul>
          </section>

          {/* Notable Projects Section */}
          <section id="projects" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Notable Projects</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">
                <a href="/" className="text-vintage-gold underline hover:text-vintage-brass" target="_blank" rel="noopener noreferrer">
                  LinkShala
                </a>
              </h3>
              <p className="mb-2 leading-relaxed font-serif text-vintage-coffee">
                I developed a comprehensive link management platform featuring AI-powered descriptions, analytics dashboard, and team collaboration tools. 
                Built using React.js, Node.js, and MongoDB with integration of modern AI APIs like Gemini and Groq.
              </p>
              <p className="text-sm text-vintage-brown mb-2 font-serif">
                <strong className="font-vintage">Technologies:</strong> React, Node.js, MongoDB, AI APIs, Tailwind CSS
              </p>
              <p className="text-sm text-vintage-brown font-serif">
                <strong className="font-vintage">Status:</strong> Live and active, growing user base
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">
                <a href="https://github.com" className="text-vintage-gold underline hover:text-vintage-brass" target="_blank" rel="noopener noreferrer">
                  E-Commerce Platform
                </a>
              </h3>
              <p className="mb-2 leading-relaxed font-serif text-vintage-coffee">
                I built a full-featured e-commerce solution with vendor management, payment processing, inventory tracking, and real-time analytics. 
                Designed to handle high-volume transactions with scalable architecture and modern payment integrations.
              </p>
              <p className="text-sm text-vintage-brown mb-2 font-serif">
                <strong className="font-vintage">Technologies:</strong> Next.js, PostgreSQL, Stripe, Redis
              </p>
              <p className="text-sm text-vintage-brown font-serif">
                <strong className="font-vintage">Status:</strong> Production ready, handling significant transaction volume
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">
                <a href="https://github.com" className="text-vintage-gold underline hover:text-vintage-brass" target="_blank" rel="noopener noreferrer">
                  Real-time Chat Application
                </a>
              </h3>
              <p className="mb-2 leading-relaxed font-serif text-vintage-coffee">
                I created a scalable messaging platform supporting video calls, file sharing, group chats, and end-to-end encryption. 
                Implemented using modern web technologies with focus on performance, security, and real-time communication.
              </p>
              <p className="text-sm text-vintage-brown mb-2 font-serif">
                <strong className="font-vintage">Technologies:</strong> React, Socket.io, WebRTC, Docker
              </p>
              <p className="text-sm text-vintage-brown font-serif">
                <strong className="font-vintage">Status:</strong> Beta testing with multiple teams
              </p>
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Education</h2>
            <p className="mb-4 leading-relaxed font-serif text-vintage-coffee">
              I am primarily self-educated in software development, having completed numerous online courses and certifications in web development, 
              database management, and software engineering principles. My learning approach combines theoretical knowledge with practical project implementation.
            </p>
            
            <h3 className="text-xl font-vintage font-semibold mb-2 text-vintage-black">Certifications and Courses</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 font-serif text-vintage-coffee">
              <li>Full Stack Web Development (Self-paced)</li>
              <li>JavaScript Algorithms and Data Structures</li>
              <li>React.js Development</li>
              <li>Node.js Backend Development</li>
              <li>Database Design and Management</li>
            </ul>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">Contact Information</h2>
            <div className="bg-vintage-paper border border-vintage-gold/30 p-4">
              <table className="w-full font-serif">
                <tbody>
                  <tr className="border-b border-vintage-gold/20">
                    <td className="font-vintage font-semibold py-2 pr-4 text-vintage-black">Email</td>
                    <td className="py-2">
                      <a href="mailto:infinityy2501@gmail.com" className="text-vintage-gold underline hover:text-vintage-brass">
                        infinityy2501@gmail.com
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-vintage-gold/20">
                    <td className="font-vintage font-semibold py-2 pr-4 text-vintage-black">GitHub</td>
                    <td className="py-2">
                      <a href="https://github.com" className="text-vintage-gold underline hover:text-vintage-brass" target="_blank" rel="noopener noreferrer">
                        github.com/akhileshyadav
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-vintage-gold/20">
                    <td className="font-vintage font-semibold py-2 pr-4 text-vintage-black">LinkedIn</td>
                    <td className="py-2">
                      <a href="https://linkedin.com" className="text-vintage-gold underline hover:text-vintage-brass" target="_blank" rel="noopener noreferrer">
                        linkedin.com/in/akhileshyadav
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-vintage font-semibold py-2 pr-4 text-vintage-black">Location</td>
                    <td className="py-2 text-vintage-brown">New Delhi, India</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* References Section */}
          <section id="references" className="mb-8">
            <h2 className="text-2xl font-vintage font-bold border-b border-vintage-gold/30 pb-1 mb-4 text-vintage-black">References</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm font-serif text-vintage-coffee">
              <li>"Modern Web Development Practices" - MDN Web Docs</li>
              <li>"Full Stack Development Guide" - FreeCodeCamp</li>
              <li>"JavaScript: The Definitive Guide" - David Flanagan</li>
              <li>"React Documentation" - React.js Official Documentation</li>
              <li>"Node.js Best Practices" - Node.js Foundation</li>
            </ol>
          </section>

          {/* Categories */}
          <div className="border-t border-vintage-gold/30 pt-4 mt-8">
            <div className="text-sm text-vintage-brown font-serif">
              <strong className="font-vintage">Categories:</strong> 
              <a href="#" className="text-vintage-gold underline hover:text-vintage-brass ml-1">Software Developers</a> | 
              <a href="#" className="text-vintage-gold underline hover:text-vintage-brass ml-1">Web Developers</a> | 
              <a href="#" className="text-vintage-gold underline hover:text-vintage-brass ml-1">Full Stack Engineers</a> | 
              <a href="#" className="text-vintage-gold underline hover:text-vintage-brass ml-1">Indian Programmers</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-vintage-gold/30 bg-vintage-paper px-4 py-6 mt-12">
          <div className="max-w-4xl mx-auto text-center text-sm text-vintage-brown font-serif">
            <p>This page was last edited on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p className="mt-2">Content is available under Creative Commons Attribution-ShareAlike License</p>
          </div>
        </div>
      </div>
    </html>
  )
}

export default Portfolio