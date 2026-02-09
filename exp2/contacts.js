// Contact Manager functionality
const contactForm = document.getElementById('contact-form');
const contactsList = document.getElementById('contacts-list');
const contactMessage = document.getElementById('contact-message');
const contactSearch = document.getElementById('contact-search');
const contactCount = document.getElementById('contact-count');
const addContactBtn = document.getElementById('add-contact-btn');

let contacts = [];
let editingIndex = null;

// Load contacts from local storage
function loadContacts() {
  const stored = localStorage.getItem('contacts');
  if (stored) {
    contacts = JSON.parse(stored);
    renderContacts();
  } else {
    updateContactCount();
  }
}

// Save contacts to local storage
function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
  updateContactCount();
}

// Update contact count
function updateContactCount() {
  const count = contacts.length;
  contactCount.textContent = `${count} ${count === 1 ? 'contact' : 'contacts'}`;
}

// Render contacts list
function renderContacts(filteredContacts = null) {
  const displayContacts = filteredContacts !== null ? filteredContacts : contacts;
  
  if (displayContacts.length === 0) {
    contactsList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📋</span>
        <p>No contacts found.</p>
        <p class="empty-hint">${filteredContacts !== null ? 'Try a different search term' : 'Add your first contact above!'}</p>
      </div>
    `;
    return;
  }

  contactsList.innerHTML = displayContacts.map((contact, index) => {
    const actualIndex = contacts.indexOf(contact);
    const isEditing = editingIndex === actualIndex;
    
    if (isEditing) {
      return `
        <div class="contact-item contact-item-editing" data-index="${actualIndex}">
          <div class="contact-edit-form">
            <input type="text" class="contact-edit-input" value="${escapeHtml(contact.name)}" data-field="name">
            <input type="email" class="contact-edit-input" value="${escapeHtml(contact.email)}" data-field="email">
            <input type="tel" class="contact-edit-input" value="${escapeHtml(contact.phone)}" data-field="phone">
            <div class="contact-actions">
              <button class="btn-save" onclick="saveEdit(${actualIndex})">Save</button>
              <button class="btn-cancel" onclick="cancelEdit()">Cancel</button>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="contact-item" data-index="${actualIndex}" draggable="true">
        <div class="contact-info">
          <div class="contact-name">${escapeHtml(contact.name)}</div>
          <div class="contact-email">${escapeHtml(contact.email)}</div>
          <div class="contact-phone">${escapeHtml(contact.phone)}</div>
        </div>
        <div class="contact-actions">
          <button class="btn-edit" onclick="editContact(${actualIndex})">Edit</button>
          <button class="btn-delete" onclick="deleteContact(${actualIndex})">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  // Add drag and drop event listeners
  if (filteredContacts === null) {
    setupDragAndDrop();
  }
  
  // Update contact count
  updateContactCount();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add contact
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    // Validation
    if (!name || !email || !phone) {
      contactMessage.textContent = 'Please fill in all fields.';
      contactMessage.className = 'form-message form-message--error';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      contactMessage.textContent = 'Please enter a valid email address.';
      contactMessage.className = 'form-message form-message--error';
      return;
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      contactMessage.textContent = 'Please enter a valid phone number (at least 10 digits).';
      contactMessage.className = 'form-message form-message--error';
      return;
    }

    if (editingIndex !== null) {
      // Update existing contact
      contacts[editingIndex] = { name, email, phone };
      editingIndex = null;
      addContactBtn.textContent = 'Add Contact';
      contactMessage.textContent = 'Contact updated successfully!';
    } else {
      // Add new contact
      contacts.push({ name, email, phone });
      contactMessage.textContent = 'Contact added successfully!';
    }

    contactMessage.className = 'form-message form-message--success';
    contactForm.reset();
    saveContacts();
    renderContacts();
    updateContactCount();
    
    // Clear message after 3 seconds
    setTimeout(() => {
      contactMessage.textContent = '';
      contactMessage.className = 'form-message';
    }, 3000);
  });
}

// Edit contact
function editContact(index) {
  editingIndex = index;
  const contact = contacts[index];
  
  document.getElementById('contact-name').value = contact.name;
  document.getElementById('contact-email').value = contact.email;
  document.getElementById('contact-phone').value = contact.phone;
  
  addContactBtn.textContent = 'Update Contact';
  renderContacts();
  
  // Scroll to form
  document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Save edit (inline editing)
function saveEdit(index) {
  const contactItem = document.querySelector(`.contact-item-editing[data-index="${index}"]`);
  if (!contactItem) return;
  
  const inputs = contactItem.querySelectorAll('.contact-edit-input');
  
  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const phone = inputs[2].value.trim();

  // Validation
  if (!name || !email || !phone) {
    alert('Please fill in all fields.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (phone.length < 10) {
    alert('Please enter a valid phone number (at least 10 digits).');
    return;
  }

  contacts[index] = { name, email, phone };
  editingIndex = null;
  addContactBtn.textContent = 'Add Contact';
  document.getElementById('contact-form').reset();
  saveContacts();
  
  // Re-apply search filter if active
  if (contactSearch && contactSearch.value.trim()) {
    filterContacts();
  } else {
    renderContacts();
  }
  updateContactCount();
  
  contactMessage.textContent = 'Contact updated successfully!';
  contactMessage.className = 'form-message form-message--success';
  setTimeout(() => {
    contactMessage.textContent = '';
    contactMessage.className = 'form-message';
  }, 3000);
}

// Cancel edit
function cancelEdit() {
  editingIndex = null;
  addContactBtn.textContent = 'Add Contact';
  document.getElementById('contact-form').reset();
  
  // Re-apply search filter if active
  if (contactSearch && contactSearch.value.trim()) {
    filterContacts();
  } else {
    renderContacts();
  }
}

// Delete contact
function deleteContact(index) {
  if (confirm('Are you sure you want to delete this contact?')) {
    contacts.splice(index, 1);
    saveContacts();
    
    // Re-apply search filter if active
    if (contactSearch && contactSearch.value.trim()) {
      filterContacts();
    } else {
      renderContacts();
    }
    updateContactCount();
    
    contactMessage.textContent = 'Contact deleted successfully!';
    contactMessage.className = 'form-message form-message--success';
    setTimeout(() => {
      contactMessage.textContent = '';
      contactMessage.className = 'form-message';
    }, 3000);
  }
}

// Search/filter contacts
if (contactSearch) {
  contactSearch.addEventListener('input', () => {
    filterContacts();
  });
}

function filterContacts() {
  const searchTerm = contactSearch.value.trim().toLowerCase();
  
  if (!searchTerm) {
    renderContacts();
    return;
  }

  const filtered = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm)
  );
  
  renderContacts(filtered);
}

// Drag and drop functionality
let draggedElement = null;
let draggedIndex = null;

function setupDragAndDrop() {
  const contactItems = contactsList.querySelectorAll('.contact-item:not(.contact-item-editing)');
  
  contactItems.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      draggedElement = item;
      draggedIndex = parseInt(item.dataset.index);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.innerHTML);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      // Remove any placeholder classes
      const allItems = contactsList.querySelectorAll('.contact-item');
      allItems.forEach(i => i.classList.remove('drag-over'));
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      
      if (draggedElement && draggedElement !== item) {
        const dropIndex = parseInt(item.dataset.index);
        
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
          // Reorder contacts array
          const [movedContact] = contacts.splice(draggedIndex, 1);
          const newIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
          contacts.splice(newIndex, 0, movedContact);
          saveContacts();
          renderContacts();
        }
      }
    });
  });
}

// Initialize contacts on page load
if (contactsList) {
  loadContacts();
}
