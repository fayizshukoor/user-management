// Auto-hide alerts
  setTimeout(() => {
    document.querySelectorAll(".alert").forEach(a => a.style.display = "none");
  }, 3000);

  // Client-side validation
  const form = document.getElementById('signupForm');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  form.addEventListener('submit', (e) => {
    let valid = true;

    // Validate name
    if (name.value.trim().length < 3) {
      nameError.style.display = 'block';
      valid = false;
    } else {
      nameError.style.display = 'none';
    }

    // Validate email
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
      emailError.style.display = 'block';
      valid = false;
    } else {
      emailError.style.display = 'none';
    }

    // Validate password
    if (password.value.trim().length < 6) {
      passwordError.style.display = 'block';
      valid = false;
    } else {
      passwordError.style.display = 'none';
    }

    if (!valid) {
      e.preventDefault();
    }
  });

  // Real-time validation
  name.addEventListener('input', () => {
    nameError.style.display = name.value.trim().length < 3 ? 'block' : 'none';
  });

  email.addEventListener('input', () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    emailError.style.display = !email.value.match(emailPattern) ? 'block' : 'none';
  });

  password.addEventListener('input', () => {
    passwordError.style.display = password.value.trim().length < 6 ? 'block' : 'none';
  });

