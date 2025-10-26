document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = () => (loginModal.style.display = 'block');
    closeModal.onclick = () => (loginModal.style.display = 'none');
    window.onclick = (event) => {
      if (event.target === loginModal) loginModal.style.display = 'none';
    };
  }
});

const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuenta: login, contrasena })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        localStorage.setItem("login", login);
        localStorage.setItem("password", contrasena);
        Swal.fire({
          icon: 'success',
          title: 'Acceso permitido',
          text: `Bienvenido, ${cuenta}!`,
          confirmButtonColor: '#222'
        });
        document.getElementById('userName').textContent = cuenta;
        document.getElementById('loginModal').style.display = 'none';
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Error inesperado',
          text: 'Respuesta incompleta del servidor.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
      });
      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
    });
  }
});
