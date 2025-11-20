 // Hide alert messages after 3 seconds
  setTimeout(() => {
    document.querySelectorAll(".alert").forEach(a => a.style.display = "none");
  }, 3000);

  // Client-side validation
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  form.addEventListener('submit', (e) => {
    let valid = true;

    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
      emailError.style.display = "block";
      valid = false;
    } else {
      emailError.style.display = "none";
    }

    // Password validation
    if (password.value.trim().length < 6) {
      passwordError.style.display = "block";
      valid = false;
    } else {
      passwordError.style.display = "none";
    }

    if (!valid) {
      e.preventDefault(); // stop form submission
    }
  });