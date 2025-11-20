

   
    setTimeout(() => {
      document.querySelectorAll(".alert").forEach(a => a.style.display = "none");
    }, 3000);

 
    window.addEventListener("pageshow", function (event) {
      if (event.persisted || window.performance.navigation.type === 2) {
        window.location.reload();
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  const modalDeleteForm = document.getElementById("modalDeleteForm");
  const userNameEl = document.getElementById("userName");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("data-id");
      const userName = btn.getAttribute("data-name");

      // Update modal text
      userNameEl.textContent = `User: ${userName}`;

      // Update form action dynamically
      modalDeleteForm.action = `/admin/delete/${userId}`;

      // Show modal
      deleteModal.show();
    });
  });
});
