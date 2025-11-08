// Modal functionality
const supportSquadBtn = document.getElementById('supportSquadBtn');
const supportModal = document.getElementById('supportModal');
const closeModal = document.getElementById('closeModal');
const successMessage = document.getElementById('successMessage');
const supportForm = document.getElementById('supportForm');

// Debug: Check if elements are found
console.log('supportSquadBtn:', supportSquadBtn);
console.log('supportModal:', supportModal);
console.log('closeModal:', closeModal);
console.log('successMessage:', successMessage);
console.log('supportForm:', supportForm);

// Open modal
if (supportSquadBtn) {
  supportSquadBtn.addEventListener('click', (e) => {
    console.log('Support Squad button clicked!');
    e.preventDefault();
    supportModal.style.display = 'block';
  });
} else {
  console.error('Support Squad button not found!');
}

// Close modal
if (closeModal) {
  closeModal.addEventListener('click', () => {
    console.log('Close modal clicked!');
    // Reset form state when closing
    successMessage.style.display = 'none';
    supportForm.style.display = 'flex';
    supportForm.reset();
    supportModal.style.display = 'none';
  });
} else {
  console.error('Close modal element not found!');
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === supportModal) {
    console.log('Clicked outside modal, closing...');
    // Reset form state when closing
    successMessage.style.display = 'none';
    supportForm.style.display = 'flex';
    supportForm.reset();
    supportModal.style.display = 'none';
  }
});


// Handle form submission
if (supportForm) {
  supportForm.addEventListener('submit', async (event) => {
    console.log('Form submitted!');
    event.preventDefault();

    const formData = new FormData(supportForm);

    try {
      const response = await fetch(supportForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Hide the form and show success message with animation
        supportForm.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset animations by removing and re-adding the checkmark
        const checkmark = successMessage.querySelector('.checkmark');
        if (checkmark) {
          checkmark.style.animation = 'none';
          checkmark.offsetHeight; // Trigger reflow
          checkmark.style.animation = null;
        }

        // No automatic timeout - user must manually close the modal
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Oops! There was a problem submitting your form.');
    }
  });
} else {
  console.error('Support form element not found!');
}
  

// Handle form submission
supportForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(supportForm);

  try {
    const response = await fetch(supportForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Hide the form and show success message with animation
      supportForm.style.display = 'none';
      successMessage.style.display = 'block';

      // Reset animations by removing and re-adding the checkmark
      const checkmark = successMessage.querySelector('.checkmark');
      checkmark.style.animation = 'none';
      checkmark.offsetHeight; // Trigger reflow
      checkmark.style.animation = null;

      // No automatic timeout - user must manually close the modal
    } else {
      alert('Oops! There was a problem submitting your form.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Oops! There was a problem submitting your form.');
  }
});
