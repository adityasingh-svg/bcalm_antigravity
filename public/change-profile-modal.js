const SUGGESTED_ROLES = [
  'Product Manager',
  'Product Analyst',
  'Data Analyst',
  'Business Analyst',
  'Data Scientist',
  'Software Engineer',
  'UX Designer',
  'Marketing Manager'
];

const STATUS_OPTIONS = [
  'Student / Fresher',
  'Working Professional',
  'Switching Careers'
];

const EXPERIENCE_OPTIONS = [
  { value: '0', label: '0 years' },
  { value: '1', label: '1–2 years' },
  { value: '3', label: '3–5 years' },
  { value: '6', label: '6–9 years' },
  { value: '10', label: '10+ years' }
];

let modalState = {
  current_status: null,
  target_role: null,
  years_experience: null
};

let onSaveCallback = null;

function createChangeProfileModal() {
  if (document.getElementById('changeProfileModal')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'changeProfileModal';
  overlay.className = 'modal-overlay';
  
  overlay.innerHTML = `
    <div class="modal">
      <h2 class="modal-title">Tune your CV review</h2>
      <p class="modal-subtitle">This helps us score more accurately.</p>
      
      <div class="modal-field">
        <select class="modal-select" id="modalStatusSelect">
          <option value="">Select status</option>
          ${STATUS_OPTIONS.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      
      <div class="modal-field">
        <div class="modal-combo-container">
          <input 
            type="text" 
            class="modal-combo-input" 
            id="modalRoleInput"
            placeholder="Type or select a role"
            autocomplete="off"
          />
          <div class="modal-combo-dropdown" id="modalRoleDropdown"></div>
        </div>
      </div>
      
      <div class="modal-field">
        <select class="modal-select" id="modalExperienceSelect">
          <option value="">Select experience</option>
          ${EXPERIENCE_OPTIONS.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}
        </select>
      </div>
      
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">Cancel</button>
        <button class="modal-btn modal-btn-save" id="modalSaveBtn">Save</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  setupModalListeners();
}

function setupModalListeners() {
  const overlay = document.getElementById('changeProfileModal');
  const statusSelect = document.getElementById('modalStatusSelect');
  const roleInput = document.getElementById('modalRoleInput');
  const roleDropdown = document.getElementById('modalRoleDropdown');
  const experienceSelect = document.getElementById('modalExperienceSelect');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const saveBtn = document.getElementById('modalSaveBtn');
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeChangeProfileModal();
    }
  });
  
  statusSelect.addEventListener('change', () => {
    modalState.current_status = statusSelect.value || null;
    
    if (statusSelect.value === 'Student / Fresher' && !experienceSelect.value) {
      experienceSelect.value = '0';
      modalState.years_experience = 0;
    }
  });
  
  roleInput.addEventListener('focus', () => {
    showRoleDropdown();
  });
  
  roleInput.addEventListener('input', () => {
    modalState.target_role = roleInput.value || null;
    showRoleDropdown();
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-combo-container')) {
      roleDropdown.classList.remove('visible');
    }
  });
  
  experienceSelect.addEventListener('change', () => {
    modalState.years_experience = experienceSelect.value ? parseInt(experienceSelect.value) : null;
  });
  
  cancelBtn.addEventListener('click', closeChangeProfileModal);
  
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
      setLocalOnboarding({
        current_status: modalState.current_status,
        target_role: modalState.target_role,
        years_experience: modalState.years_experience
      });
      
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          current_status: modalState.current_status,
          target_role: modalState.target_role,
          years_experience: modalState.years_experience
        })
      });
      
      if (onSaveCallback) {
        onSaveCallback(modalState);
      }
      
      closeChangeProfileModal();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  });
}

function showRoleDropdown() {
  const roleInput = document.getElementById('modalRoleInput');
  const roleDropdown = document.getElementById('modalRoleDropdown');
  const inputValue = roleInput.value.toLowerCase();
  
  const filtered = SUGGESTED_ROLES.filter(role => 
    role.toLowerCase().includes(inputValue)
  );
  
  let html = filtered.map(role => 
    `<div class="modal-combo-option" data-value="${role}">${role}</div>`
  ).join('');
  
  html += `<div class="modal-combo-option safe-option-item" data-value="">Not sure yet — score me for general readiness</div>`;
  
  roleDropdown.innerHTML = html;
  roleDropdown.classList.add('visible');
  
  roleDropdown.querySelectorAll('.modal-combo-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      roleInput.value = value;
      modalState.target_role = value || null;
      roleDropdown.classList.remove('visible');
    });
  });
}

function openChangeProfileModal(profile, callback) {
  createChangeProfileModal();
  
  onSaveCallback = callback;
  
  modalState = {
    current_status: profile?.current_status || null,
    target_role: profile?.target_role || null,
    years_experience: profile?.years_experience ?? null
  };
  
  const statusSelect = document.getElementById('modalStatusSelect');
  const roleInput = document.getElementById('modalRoleInput');
  const experienceSelect = document.getElementById('modalExperienceSelect');
  
  statusSelect.value = modalState.current_status || '';
  roleInput.value = modalState.target_role || '';
  
  if (modalState.years_experience !== null) {
    const expValue = EXPERIENCE_OPTIONS.find(e => parseInt(e.value) === modalState.years_experience);
    experienceSelect.value = expValue ? expValue.value : '';
  } else {
    experienceSelect.value = '';
  }
  
  document.getElementById('changeProfileModal').classList.add('visible');
}

function closeChangeProfileModal() {
  const overlay = document.getElementById('changeProfileModal');
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

function formatTuningSummary(profile) {
  const role = profile?.target_role || 'General readiness';
  const status = profile?.current_status || 'Not specified';
  const exp = formatExperience(profile?.years_experience);
  return `Scoring for: ${role} · ${status} · ${exp}`;
}
