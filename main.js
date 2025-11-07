document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const admission = document.getElementById('admission').value.trim();
  const email = document.getElementById('email').value.trim();

  // Simple validation
  if (!admission) {
    alert('Please enter your admission number.');
    return;
  }
  if (!validateInstitutionalEmail(email)) {
    alert('Use your institutional email (e.g. @strathmore.edu).');
    return;
  }

  // For now, store in sessionStorage and redirect to menu page
  sessionStorage.setItem('admission', admission);
  sessionStorage.setItem('email', email);
  window.location.href = 'menu.html';
});

// Helper: validate institutional email
function validateInstitutionalEmail(email) {
  const allowed = ['strathmore.edu', 'students.strathmore.edu'];
  const domain = email.split('@')[1];
  return allowed.includes(domain);
}


