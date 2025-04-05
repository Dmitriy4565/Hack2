
// начало панели регистрации

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login-button');
    const registerButton = document.querySelector('.register-button');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    registerButton.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
});

// конец панели регистрации


// Получение форм
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

// Регистрация
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const fullname = document.getElementById("fullname").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Проверка логина: только латиница
    if (!/^[A-Za-z]+$/.test(username)) {
        alert("Логин должен содержать только латинские буквы.");
        return;
    }

    // Проверка ФИО: только русские буквы и пробелы
    if (!/^[А-Яа-яЁё\s]+$/.test(fullname)) {
        alert("ФИО должно содержать только русские буквы.");
        return;
    }

    // Проверка пароля: латиница, цифры, символы (без кириллицы)
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:|,.<>/?]+$/.test(password)) {
        alert("Пароль должен содержать только латинские буквы, цифры и символы.");
        return;
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        alert("Пароли не совпадают.");
        return;
    }

    // Получаем пользователей из localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Проверка: логин уже занят
    if (users.find(user => user.username === username)) {
        alert("Пользователь с таким логином уже существует.");
        return;
    }

    // Добавляем пользователя
    users.push({
        username: username,
        fullname: fullname,
        password: password,
        role: "Пользователь"
    });

    // Сохраняем обратно
    localStorage.setItem("users", JSON.stringify(users));

    alert("Регистрация успешна!");
    registerForm.reset();
});

// Авторизация
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(user => user.username === username && user.password === password);

    if (foundUser) {
        alert(`Добро пожаловать, ${foundUser.fullname}!\nРоль: ${foundUser.role}`);
        loginForm.reset();
    } else {
        alert("Неверный логин или пароль.");
    }
});


// запрет обычным пользователям посещать админку
// document.addEventListener("DOMContentLoaded", () => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
//     const adminLink = document.getElementById("admin-link");
  
//     if (adminLink) {
//       adminLink.addEventListener("click", (event) => {
//         if (!currentUser || currentUser.role !== "Администратор") {
//           event.preventDefault(); // блокируем переход
//           alert("Недостаточно прав для доступа к разделу Администрирование.");
//         }
//       });
//     }
//   });