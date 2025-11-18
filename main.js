//inital start 30/10/25
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const admission = document.getElementById('admission').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!admission) {
    alert('Please enter your admission number.');
    return;
  }
  if (!validateInstitutionalEmail(email)) {
    alert('Use your institutional email (e.g. @strathmore.edu).');
    return;
  }

});

//validate email function -1/11/25
function validateInstitutionalEmail(email) {
  const allowed = ['strathmore.edu', 'students.strathmore.edu'];
  const domain = email.split('@')[1];
  return allowed.includes(domain);
}


