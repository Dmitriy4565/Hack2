// Открытие модального окна редактирования
const editModal = document.getElementById('edit-modal');
const closeModalSpan = editModal.querySelector('.close');
const editUserForm = document.getElementById('edit-user-form');

// Назначаем обработчики для кнопок "Редактировать"
document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('tr');
    const userId = row.getAttribute('data-user-id');
    const login = row.children[0].textContent;
    const fullname = row.children[1].textContent;
    // Для роли: приведём текст к нижнему регистру и сопоставим с значениями в select
    const roleText = row.children[2].textContent.trim().toLowerCase();
    const role = (roleText === 'администратор' ? 'admin' : 'user');
    const regDate = row.children[3].textContent; // предполагается, что формат даты корректный

    // Заполняем форму данными
    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-login').value = login;
    document.getElementById('edit-fullname').value = fullname;
    document.getElementById('edit-role').value = role;
    document.getElementById('edit-date').value = regDate;

    // Показываем модальное окно
    editModal.style.display = 'block';
  });
});

// Закрытие модального окна при клике на крестик
closeModalSpan.addEventListener('click', () => {
  editModal.style.display = 'none';
});
// Закрытие модального окна при клике вне его
window.addEventListener('click', event => {
  if (event.target === editModal) {
    editModal.style.display = 'none';
  }
});

// Обработка формы редактирования
editUserForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Здесь можно добавить логику для сохранения изменений (например, отправка данных на сервер)
  alert('Изменения сохранены!');
  editModal.style.display = 'none';
});

// Обработчики для кнопок "Удалить" и "Сменить пароль"
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('tr');
    const userId = row.getAttribute('data-user-id');
    if (confirm('Вы уверены, что хотите удалить пользователя?')) {
      // Здесь можно добавить вызов API для удаления пользователя
      row.remove();
      alert('Пользователь с ID ' + userId + ' удалён.');
    }
  });
});

document.querySelectorAll('.change-pass-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const userId = this.closest('tr').getAttribute('data-user-id');
    // Здесь можно реализовать логику смены пароля (например, открытие отдельного модального окна)
    alert('Функция смены пароля для пользователя с ID ' + userId);
  });
});

// Пример фильтрации (без реального запроса к серверу)
document.getElementById('apply-filter').addEventListener('click', function() {
  const loginFilter = document.getElementById('filter-login').value.trim().toLowerCase();
  const fullnameFilter = document.getElementById('filter-fullname').value.trim().toLowerCase();
  const roleFilter = document.getElementById('filter-role').value;
  const rows = document.querySelectorAll('#users-table-body tr');

  rows.forEach(row => {
    const login = row.children[0].textContent.toLowerCase();
    const fullname = row.children[1].textContent.toLowerCase();
    const role = row.children[2].textContent.toLowerCase();
    let show = true;

    if (loginFilter && !login.includes(loginFilter)) {
      show = false;
    }
    if (fullnameFilter && !fullname.includes(fullnameFilter)) {
      show = false;
    }
    if (roleFilter && role !== (roleFilter === 'admin' ? 'администратор' : 'пользователь')) {
      show = false;
    }
    row.style.display = show ? '' : 'none';
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('edit-modal');
    const closeModal = editModal.querySelector('.close');
    const form = document.getElementById('edit-user-form');
  
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        document.getElementById('edit-user-id').value = row.dataset.userId;
        document.getElementById('edit-login').value = row.children[0].textContent;
        document.getElementById('edit-fullname').value = row.children[1].textContent;
        document.getElementById('edit-role').value = row.children[2].textContent.trim().toLowerCase() === 'администратор' ? 'admin' : 'user';
        document.getElementById('edit-date').value = row.children[3].textContent;
        editModal.style.display = 'block';
      });
    });
  
    closeModal.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  
    window.addEventListener('click', e => {
      if (e.target === editModal) editModal.style.display = 'none';
    });
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert('Изменения сохранены (здесь должна быть логика сохранения).');
      editModal.style.display = 'none';
    });
  
    // Удалить
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        if (confirm('Удалить пользователя?')) row.remove();
      });
    });
  
    // Сменить пароль
    document.querySelectorAll('.change-pass-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Смена пароля пока не реализована.');
      });
    });
  
    // Фильтр
    document.getElementById('apply-filter').addEventListener('click', () => {
      const login = document.getElementById('filter-login').value.toLowerCase();
      const fullname = document.getElementById('filter-fullname').value.toLowerCase();
      const role = document.getElementById('filter-role').value;
  
      document.querySelectorAll('#users-table-body tr').forEach(row => {
        const loginVal = row.children[0].textContent.toLowerCase();
        const nameVal = row.children[1].textContent.toLowerCase();
        const roleVal = row.children[2].textContent.toLowerCase();
  
        const show =
          (!login || loginVal.includes(login)) &&
          (!fullname || nameVal.includes(fullname)) &&
          (!role || roleVal === (role === 'admin' ? 'администратор' : 'пользователь'));
  
        row.style.display = show ? '' : 'none';
      });
    });
  });
  