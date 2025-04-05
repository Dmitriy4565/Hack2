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

    // Кэшируем элементы DOM
    const elements = {
        dropdown: {
            trigger: document.querySelector('.tasks-dropdown-trigger'),
            menu: document.querySelector('.tasks-dropdown-menu')
        },
        counter: {
            container: document.getElementById('dynamic-counter'),
            display: document.getElementById('counter-display')
        },
        tasksGrid: document.getElementById('tasks-content'),
        modal: {
            element: document.getElementById('task-creation-modal'),
            form: document.getElementById('new-task-form'),
            closeBtn: document.querySelector('.close-modal'),
            cancelBtn: document.getElementById('cancel-task-btn'),
            submitBtn: document.querySelector('.submit-btn'), // Кнопка "Создать"
            fields: {
                name: document.getElementById('task-name'),
                assignee: document.getElementById('task-assignee'),
                creationDate: document.getElementById('task-creation-date'),
                dueDate: document.getElementById('task-due-date'),
                priority: document.getElementById('task-priority')
            }
        },
        addTaskBtn: document.getElementById('add-task-button')
    };

    // Инициализация
    init();

    function init() {
        setupEventListeners();
        updateInterface();
        setCurrentDate();
    }

    function setupEventListeners() {
        // Выпадающее меню
        elements.dropdown.trigger.addEventListener('click', handleDropdownToggle);
        document.addEventListener('click', closeDropdown);
        
        document.querySelectorAll('.tasks-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                state.currentTab = item.dataset.tab;
                updateInterface();
                closeDropdown();
                loadTasks();
            });
        });

        // Модальное окно
        elements.addTaskBtn.addEventListener('click', openModal);
        elements.modal.closeBtn.addEventListener('click', closeModal);
        elements.modal.cancelBtn.addEventListener('click', closeModal);
        elements.modal.element.addEventListener('click', e => e.target === elements.modal.element && closeModal());
        
        // Обработка формы
        elements.modal.submitBtn.addEventListener('click', handleFormSubmit);
        elements.modal.form.addEventListener('submit', handleFormSubmit);
    }

    // Обработчики событий
    function handleDropdownToggle(e) {
        e.stopPropagation();
        elements.dropdown.menu.classList.toggle('show');
        elements.dropdown.trigger.classList.toggle('active');
    }

    function closeDropdown() {
        elements.dropdown.menu.classList.remove('show');
        elements.dropdown.trigger.classList.remove('active');
    }

    function openModal() {
        if (state.currentTab === 'completed') return;
        
        elements.modal.element.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        elements.modal.fields.name.focus();
    }

    function closeModal() {
        elements.modal.element.style.display = 'none';
        document.body.style.overflow = '';
        elements.modal.form.reset();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Проверка заполнения обязательных полей
        if (!elements.modal.fields.name.value || 
            !elements.modal.fields.dueDate.value || 
            !elements.modal.fields.priority.value) {
            alert('Пожалуйста, заполните все обязательные поля!');
            return;
        }

        const taskData = {
            title: elements.modal.fields.name.value,
            assignee: elements.modal.fields.assignee.value,
            assigneeName: elements.modal.fields.assignee.options[elements.modal.fields.assignee.selectedIndex].text,
            creationDate: elements.modal.fields.creationDate.value,
            dueDate: elements.modal.fields.dueDate.value,
            priority: elements.modal.fields.priority.value,
            status: state.currentTab
        };
        
        createTask(taskData);
        closeModal();
    }

    // Основные функции
    function updateInterface() {
        const titles = {
            current: 'Текущие задачи',
            pending: 'Отложенные задачи',
            completed: 'Выполненные задачи'
        };
        
        // Обновляем выпадающий список
        elements.dropdown.trigger.querySelector('span').textContent = titles[state.currentTab];
        
        // Обновляем счетчик
        elements.counter.container.style.display = state.currentTab === 'completed' ? 'none' : 'block';
        
        if (state.currentTab !== 'completed') {
            elements.counter.container.className = `task-counter-box ${state.currentTab}`;
            elements.counter.container.querySelector('h3').textContent = titles[state.currentTab];
            elements.counter.display.textContent = state.counts[state.currentTab];
        }
        
        // Кнопка добавления
        elements.addTaskBtn.style.display = state.currentTab !== 'completed' ? 'flex' : 'none';
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
        
        elements.tasksGrid.prepend(taskCard);
        state.counts[state.currentTab]++;
        updateInterface();
    }

    function setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        elements.modal.fields.creationDate.value = today;
        elements.modal.fields.dueDate.min = today;
        
        // Разрешаем редактирование даты создания
        elements.modal.fields.creationDate.readOnly = false;
    }

    function loadTasks() {
        console.log(`Загрузка задач: ${state.currentTab}`);
        // Здесь будет загрузка задач с сервера
    }

    function getPriorityText(priority) {
        const priorityMap = {
            low: 'Низкий',
            medium: 'Средний',
            high: 'Высокий'
        };
        return priorityMap[priority] || '';
    }

    function formatDate(dateString) {
        if (!dateString) return 'Не указана';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
});