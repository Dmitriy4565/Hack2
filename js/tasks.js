document.addEventListener('DOMContentLoaded', function() {
    // Состояние приложения
    const state = {
        currentTab: 'current',
        counts: {
            current: 0,
            pending: 0,
            completed: 0
        }
    };

    // Получаем все элементы DOM
    const dropdownTrigger = document.querySelector('.tasks-dropdown-trigger');
    const dropdownMenu = document.querySelector('.tasks-dropdown-menu');
    const dynamicCounter = document.getElementById('dynamic-counter');
    const counterDisplay = document.getElementById('counter-display');
    const tasksGrid = document.getElementById('tasks-content');
    const addTaskBtn = document.getElementById('add-task-button');
    
    // Элементы модального окна
    const modal = document.getElementById('task-creation-modal');
    const modalForm = document.getElementById('new-task-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-task-btn');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Поля формы
    const taskNameInput = document.getElementById('task-name');
    const assigneeSelect = document.getElementById('task-assignee');
    const creationDateInput = document.getElementById('task-creation-date');
    const dueDateInput = document.getElementById('task-due-date');
    const prioritySelect = document.getElementById('task-priority');

    // Инициализация при загрузке
    setCurrentDate();
    setupEventListeners();
    updateInterface();

    function setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        creationDateInput.value = today;
        dueDateInput.min = today;
        creationDateInput.readOnly = false;
    }

    function setupEventListeners() {
        // Выпадающее меню
        dropdownTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            this.classList.toggle('active');
        });
        
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
            dropdownTrigger.classList.remove('active');
        });
        
        document.querySelectorAll('.tasks-dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                state.currentTab = this.getAttribute('data-tab');
                updateInterface();
                dropdownMenu.classList.remove('show');
                dropdownTrigger.classList.remove('active');
                loadTasks();
            });
        });

        // Модальное окно
        addTaskBtn.addEventListener('click', function() {
            if (state.currentTab !== 'completed') {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                taskNameInput.focus();
            }
        });

        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Обработка формы
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });

        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        modalForm.reset();
    }

    function handleFormSubmit() {
        // Проверка заполнения полей
        if (!taskNameInput.value || !dueDateInput.value || !prioritySelect.value || !assigneeSelect.value) {
            alert('Заполните все обязательные поля!');
            return;
        }

        const taskData = {
            title: taskNameInput.value,
            assignee: assigneeSelect.value,      // Используем значение, введённое пользователем
            assigneeName: assigneeSelect.value,
            creationDate: creationDateInput.value,
            dueDate: dueDateInput.value,
            priority: prioritySelect.value,
            status: state.currentTab
        };
        
        createTask(taskData);
        closeModal();
    }

    function createTask(taskData) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${taskData.priority}-priority`;
        
        taskCard.innerHTML = `
            <div class="task-title">${taskData.title}</div>
            <div class="task-meta">
                <span>Создана: ${formatDate(taskData.creationDate)}</span>
                <span>Срок: ${formatDate(taskData.dueDate)}</span>
            </div>
            <div class="task-assignee">
                <img src="./images/avatar-placeholder.png" alt="Аватар">
                <span>${taskData.assigneeName}</span>
            </div>
            <div class="task-priority-badge ${taskData.priority}">
                ${getPriorityText(taskData.priority)}
            </div>
        `;
        
        tasksGrid.insertBefore(taskCard, tasksGrid.firstChild);
        state.counts[state.currentTab]++;
        updateInterface();
    }

    function updateInterface() {
        // Обновляем текст в триггере
        const titles = {
            current: 'Текущие задачи',
            pending: 'Отложенные задачи',
            completed: 'Выполненные задачи'
        };
        dropdownTrigger.querySelector('span').textContent = titles[state.currentTab];
        
        // Управление счетчиком
        if (state.currentTab === 'completed') {
            dynamicCounter.style.display = 'none';
        } else {
            dynamicCounter.style.display = 'block';
            dynamicCounter.className = `task-counter-box ${state.currentTab}`;
            dynamicCounter.querySelector('h3').textContent = titles[state.currentTab];
            counterDisplay.textContent = state.counts[state.currentTab];
        }
        
        // Кнопка добавления
        addTaskBtn.style.display = state.currentTab === 'completed' ? 'none' : 'flex';
    }

    function loadTasks() {
        console.log(`Загрузка задач для вкладки: ${state.currentTab}`);
        // Здесь будет загрузка задач с сервера
    }

    function formatDate(dateString) {
        if (!dateString) return 'Не указана';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    function getPriorityText(priority) {
        const priorityMap = {
            low: 'Низкий',
            medium: 'Средний',
            high: 'Высокий'
        };
        return priorityMap[priority] || '';
    }
});
