// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('contactFormMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            date: new Date().toISOString()
        };
        
        // Save to localStorage (in real app, this would go to server)
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        // Show processing
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate sending
        setTimeout(() => {
            // Show success message
            formMessage.textContent = 'Thank you for your message! We\'ll get back to you within 24 hours.';
            formMessage.className = 'form-message success';
            
            // Reset form
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.className = 'form-message';
                formMessage.textContent = '';
            }, 5000);
        }, 1500);
    });
    
    // Subject field change handler
    const subjectField = document.getElementById('contactSubject');
    const messageField = document.getElementById('contactMessage');
    
    subjectField.addEventListener('change', function() {
        // Auto-fill placeholder based on subject
        const placeholders = {
            'general': 'Tell us how we can help you...',
            'order': 'Please provide your order number and details...',
            'product': 'Which product are you asking about?',
            'return': 'Please provide your order number and reason for return...',
            'technical': 'Please describe the technical issue you\'re experiencing...',
            'other': 'Tell us what\'s on your mind...'
        };
        
        messageField.placeholder = placeholders[this.value] || 'Tell us how we can help you...';
    });
});
