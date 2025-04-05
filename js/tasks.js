document.addEventListener('DOMContentLoaded', function() {
    // Состояние приложения
    const state = {
        currentTab: 'current',
        counts: {
            current: 0,
            pending: 0,
            completed: 0
        },
        historyEvents: [], // для логирования изменений
        tasks: [],       // массив для хранения задач
        currentUser: { name: 'Пользователь', role: 'Пользователь' } // пример текущего пользователя
    };

    // Получаем элементы DOM
    const dropdownTrigger = document.querySelector('.tasks-dropdown-trigger');
    const dropdownMenu = document.querySelector('.tasks-dropdown-menu');
    const dynamicCounter = document.getElementById('dynamic-counter');
    const counterDisplay = document.getElementById('counter-display');
    const tasksGrid = document.getElementById('tasks-content');
    const addTaskBtn = document.getElementById('add-task-button');
    const searchInput = document.getElementById('task-search-input');
    const historyButton = document.getElementById('view-history-button');

    // Модальные окна
    const creationModal = document.getElementById('task-creation-modal');
    const creationForm = document.getElementById('new-task-form');
    const editModal = document.getElementById('task-edit-modal');
    const editForm = document.getElementById('edit-task-form');
    const historyModal = document.getElementById('history-modal');

    // Кнопки закрытия (для создания и редактирования)
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelTaskBtn = document.getElementById('cancel-task-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    // Обработчик для закрытия истории изменений (элемент с классом "close" внутри historyModal)
    const historyCloseBtn = document.querySelector('#history-modal .close');

    // Поля формы создания задачи
    const taskNameInput = document.getElementById('task-name');
    const assigneeInput = document.getElementById('task-assignee');
    const taskDescriptionInput = document.getElementById('task-description');
    const creationDateInput = document.getElementById('task-creation-date');
    const dueDateInput = document.getElementById('task-due-date');
    const prioritySelect = document.getElementById('task-priority');

    // Поля формы редактирования задачи
    const editTaskNameInput = document.getElementById('edit-task-name');
    const editAssigneeInput = document.getElementById('edit-task-assignee');
    const editTaskDescriptionInput = document.getElementById('edit-task-description');
    const editCreationDateInput = document.getElementById('edit-task-creation-date');
    const editDueDateInput = document.getElementById('edit-task-due-date');
    const editPrioritySelect = document.getElementById('edit-task-priority');

    // Контекстное меню
    const contextMenu = document.getElementById('task-context-menu');
    let currentTaskElement = null; // для хранения выбранной задачи при вызове контекстного меню

    // Инициализация
    setCurrentDate();
    setupEventListeners();
    updateInterface();
    loadTasks();

    function setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        creationDateInput.value = today;
        dueDateInput.min = today;
        // Поле даты теперь доступно для выбора (readonly убрано)
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
            hideContextMenu();
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

        // Модальное окно создания задачи
        addTaskBtn.addEventListener('click', function() {
            if (state.currentTab !== 'completed') {
                openModal(creationModal);
                taskNameInput.focus();
            }
        });

        // Закрытие модальных окон создания и редактирования
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                closeAllModals();
            });
        });
        if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', closeAllModals);
        if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeAllModals);

        creationModal.addEventListener('click', function(e) {
            if (e.target === creationModal) {
                closeAllModals();
            }
        });
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeAllModals();
            }
        });

        // Обработчик для закрытия модального окна истории изменений по клику на фон
        historyModal.addEventListener('click', function(e) {
            if (e.target === historyModal) {
                historyModal.style.display = 'none';
            }
        });
        // Обработчик для закрытия модального окна истории изменений по клику на кнопку "close"
        if(historyCloseBtn) {
            historyCloseBtn.addEventListener('click', function() {
                historyModal.style.display = 'none';
            });
        }

        // Обработка форм
        creationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreationFormSubmit();
        });

        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEditFormSubmit();
        });

        // Поиск
        searchInput.addEventListener('input', filterTasks);

        // История изменений
        historyButton.addEventListener('click', function() {
            showHistory();
        });
    }

    // При открытии модального окна создания задачи обновляем дату
    function openModal(modalElement) {
        if(modalElement === creationModal) {
            setCurrentDate();
        }
        modalElement.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeAllModals() {
        [creationModal, editModal].forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
        creationForm.reset();
        editForm.reset();
    }

    function handleCreationFormSubmit() {
        if (!taskNameInput.value.trim() || !dueDateInput.value || !prioritySelect.value || !assigneeInput.value.trim()) {
            alert('Заполните все обязательные поля!');
            return;
        }
        if (new Date(dueDateInput.value) < new Date(creationDateInput.value)) {
            alert('Срок выполнения не может быть раньше даты создания!');
            return;
        }
        const taskData = {
            id: Date.now(),
            title: taskNameInput.value.trim(),
            assignee: assigneeInput.value.trim(),
            description: taskDescriptionInput.value.trim(),
            creationDate: creationDateInput.value,
            dueDate: dueDateInput.value,
            priority: prioritySelect.value,
            status: state.currentTab
        };
        state.tasks.push(taskData);
        logEvent('Создание', taskData);
        createTaskElement(taskData);
        state.counts[state.currentTab]++;
        updateInterface();
        closeAllModals();
    }

    function handleEditFormSubmit() {
        if (!editTaskNameInput.value.trim() || !editDueDateInput.value || !editPrioritySelect.value || !editAssigneeInput.value.trim()) {
            alert('Заполните все обязательные поля!');
            return;
        }
        if (new Date(editDueDateInput.value) < new Date(editCreationDateInput.value)) {
            alert('Срок выполнения не может быть раньше даты создания!');
            return;
        }
        const taskId = currentTaskElement.getAttribute('data-id');
        const taskData = state.tasks.find(t => t.id == taskId);
        if (!taskData) return;
        taskData.title = editTaskNameInput.value.trim();
        taskData.assignee = editAssigneeInput.value.trim();
        taskData.description = editTaskDescriptionInput.value.trim();
        taskData.dueDate = editDueDateInput.value;
        taskData.priority = editPrioritySelect.value;
        logEvent('Изменение', taskData);
        updateTaskElement(currentTaskElement, taskData);
        closeAllModals();
    }

    function createTaskElement(taskData) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${taskData.priority}-priority`;
        taskCard.setAttribute('data-id', taskData.id);
        taskCard.innerHTML = `
            <div class="task-title">${taskData.title}</div>
            <div class="task-meta">
                <span>Создана: ${formatDate(taskData.creationDate)}</span>
                <span>Срок: ${formatDate(taskData.dueDate)}</span>
            </div>
            <div class="task-assignee">
                <img src="./images/avatar-placeholder.png" alt="Аватар">
                <span>${taskData.assignee}</span>
            </div>
            <div class="task-priority-badge ${taskData.priority}">
                ${getPriorityText(taskData.priority)}
            </div>
        `;
        // Показ деталей задачи при клике на плитку
        taskCard.addEventListener('click', function(e) {
            if(e.target.closest('.context-menu')) return;
            showTaskDetails(taskData);
        });
        // Правый клик – контекстное меню
        taskCard.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            currentTaskElement = taskCard;
            showContextMenu(e.pageX, e.pageY, taskData);
        });
        tasksGrid.insertBefore(taskCard, tasksGrid.firstChild);
    }

    function updateTaskElement(taskElement, taskData) {
        taskElement.className = `task-card ${taskData.priority}-priority`;
        taskElement.innerHTML = `
            <div class="task-title">${taskData.title}</div>
            <div class="task-meta">
                <span>Создана: ${formatDate(taskData.creationDate)}</span>
                <span>Срок: ${formatDate(taskData.dueDate)}</span>
            </div>
            <div class="task-assignee">
                <img src="./images/avatar-placeholder.png" alt="Аватар">
                <span>${taskData.assignee}</span>
            </div>
            <div class="task-priority-badge ${taskData.priority}">
                ${getPriorityText(taskData.priority)}
            </div>
        `;
    }

    function updateInterface() {
        const titles = {
            current: 'Текущие задачи',
            pending: 'Отложенные задачи',
            completed: 'Выполненные задачи'
        };
        dropdownTrigger.querySelector('span').textContent = titles[state.currentTab];
        if (state.currentTab === 'completed') {
            dynamicCounter.style.display = 'none';
        } else {
            dynamicCounter.style.display = 'block';
            dynamicCounter.className = `task-counter-box ${state.currentTab}`;
            dynamicCounter.querySelector('h3').textContent = titles[state.currentTab];
            counterDisplay.textContent = state.counts[state.currentTab];
        }
        addTaskBtn.style.display = state.currentTab === 'completed' ? 'none' : 'flex';
        filterTasks();
    }

    function loadTasks() {
        tasksGrid.innerHTML = '';
        state.counts = { current: 0, pending: 0, completed: 0 };
        state.tasks.filter(task => task.status === state.currentTab)
            .forEach(task => {
                createTaskElement(task);
                state.counts[state.currentTab]++;
            });
        updateInterface();
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

    // Показ деталей задачи (при клике на плитку)
    function showTaskDetails(taskData) {
        alert(`Задача: ${taskData.title}\nОписание: ${taskData.description || 'Нет описания'}\nИсполнитель: ${taskData.assignee}`);
    }

    // Контекстное меню
    function showContextMenu(x, y, taskData) {
        const delayOption = contextMenu.querySelector('[data-action="delay"]');
        const completeOption = contextMenu.querySelector('[data-action="complete"]');
        const resumeOption = contextMenu.querySelector('[data-action="resume"]');
        // Скрываем все пункты
        delayOption.style.display = 'none';
        completeOption.style.display = 'none';
        resumeOption.style.display = 'none';
        if(taskData.status === 'current') {
            delayOption.style.display = 'block';
            completeOption.style.display = 'block';
        } else if(taskData.status === 'pending') {
            completeOption.style.display = 'block';
            resumeOption.style.display = 'block';
        } else if(taskData.status === 'completed') {
            resumeOption.style.display = 'block';
        }
        contextMenu.style.top = y + 'px';
        contextMenu.style.left = x + 'px';
        contextMenu.style.display = 'block';
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }

    // Действия из контекстного меню
    contextMenu.addEventListener('click', function(e) {
        const action = e.target.getAttribute('data-action');
        if (!action || action === 'change-status') return; // не обрабатываем клик по родительскому пункту
        const taskId = currentTaskElement.getAttribute('data-id');
        const taskData = state.tasks.find(t => t.id == taskId);
        if (!taskData) return;
        switch(action) {
            case 'edit':
                openEditModal(taskData);
                break;
            case 'delete':
                if(confirm('Удалить задачу?')) {
                    deleteTask(taskData);
                }
                break;
            case 'delay':
                changeTaskStatus(taskData, 'pending');
                break;
            case 'complete':
                changeTaskStatus(taskData, 'completed');
                break;
            case 'resume':
                changeTaskStatus(taskData, 'current');
                break;
        }
        hideContextMenu();
    });

    function openEditModal(taskData) {
        editTaskNameInput.value = taskData.title;
        editAssigneeInput.value = taskData.assignee;
        editTaskDescriptionInput.value = taskData.description;
        editCreationDateInput.value = taskData.creationDate;
        editDueDateInput.value = taskData.dueDate;
        editPrioritySelect.value = taskData.priority;
        currentTaskElement = document.querySelector(`.task-card[data-id="${taskData.id}"]`);
        openModal(editModal);
    }

    function deleteTask(taskData) {
        state.tasks = state.tasks.filter(t => t.id != taskData.id);
        const taskElement = document.querySelector(`.task-card[data-id="${taskData.id}"]`);
        if(taskElement) {
            taskElement.remove();
        }
        state.counts[taskData.status] = Math.max(0, state.counts[taskData.status] - 1);
        logEvent('Удаление', taskData);
        updateInterface();
    }

    function changeTaskStatus(taskData, newStatus) {
        if (newStatus === 'pending' && taskData.status !== 'current') {
            alert('Действие "Отложить" доступно только для Текущих задач.');
            return;
        }
        if (newStatus === 'completed' && !(taskData.status === 'current' || taskData.status === 'pending')) {
            alert('Действие "Выполнить" доступно только для Текущих и Отложенных задач.');
            return;
        }
        if (newStatus === 'current' && !(taskData.status === 'pending' || taskData.status === 'completed')) {
            alert('Действие "Вернуть в работу" доступно только для Отложенных и Выполненных задач.');
            return;
        }
        state.counts[taskData.status] = Math.max(0, state.counts[taskData.status] - 1);
        taskData.status = newStatus;
        state.counts[newStatus]++;
        logEvent('Смена статуса', taskData);
        loadTasks();
    }

    // Фильтрация задач по поисковому запросу
    function filterTasks() {
        const query = searchInput.value.toLowerCase();
        const taskCards = tasksGrid.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            const title = card.querySelector('.task-title').textContent.toLowerCase();
            const creationDate = card.querySelector('.task-meta span').textContent.toLowerCase();
            const assignee = card.querySelector('.task-assignee span').textContent.toLowerCase();
            if (title.includes(query) || creationDate.includes(query) || assignee.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Логирование событий
    function logEvent(eventType, taskData) {
        const eventEntry = {
            date: new Date().toLocaleString('ru-RU'),
            user: state.currentUser.name,
            taskTitle: taskData.title,
            event: eventType
        };
        state.historyEvents.push(eventEntry);
    }

    // Показ истории изменений
    function showHistory() {
        const historyContent = document.getElementById('history-content');
        historyContent.innerHTML = '';
        if(state.historyEvents.length === 0) {
            historyContent.innerHTML = '<p>История пуста.</p>';
        } else {
            state.historyEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'history-event';
                eventDiv.innerHTML = `<strong>${event.date}</strong> - ${event.user} - ${event.taskTitle} - ${event.event}`;
                historyContent.appendChild(eventDiv);
            });
        }
        historyModal.style.display = 'block';
    }
});
