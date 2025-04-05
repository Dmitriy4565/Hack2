// Инициализация редактора Quill для создания новой статьи
const quillCreate = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['image']
        ]
    }
});

// Инициализация редактора Quill для редактирования статьи
const quillEdit = new Quill('#edit-editor-container', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['image']
        ]
    }
});

// Открытие модального окна для создания статьи
function openCreateArticleModal() {
    document.getElementById("create-article-modal").style.display = "flex";
}

// Закрытие модального окна для создания статьи
function closeCreateArticleModal() {
    document.getElementById("create-article-modal").style.display = "none";
}

// Открытие модального окна для редактирования статьи
function openEditArticleModal() {
    document.getElementById("edit-article-modal").style.display = "flex";
}

// Закрытие модального окна для редактирования статьи
function closeEditArticleModal() {
    document.getElementById("edit-article-modal").style.display = "none";
}

// Обработчик для отправки формы создания статьи
document.getElementById("create-article-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("article-title").value;
    const image = document.getElementById("article-image").files[0];
    const content = quillCreate.root.innerHTML;

    console.log('Создание статьи: ', title, image, content);

    closeCreateArticleModal();
});

// Обработчик для отправки формы редактирования статьи
document.getElementById("edit-article-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("edit-article-title").value;
    const image = document.getElementById("edit-article-image").files[0];
    const content = quillEdit.root.innerHTML;

    console.log('Редактирование статьи: ', title, image, content);

    closeEditArticleModal();
});

// Функция для отображения контекстного меню
let currentArticleId = null;
function showContextMenu(event, articleId) {
    event.preventDefault();

    currentArticleId = articleId;

    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.display = 'block';
}

// Закрытие контекстного меню, если кликнули вне его
window.addEventListener('click', () => {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'none';
});

// Функция редактирования статьи
function editArticle() {
    openEditArticleModal();
    console.log(`Редактирование статьи с ID: ${currentArticleId}`);
}

// Функция удаления статьи
function deleteArticle() {
    if (confirm(`Вы уверены, что хотите удалить статью с ID: ${currentArticleId}?`)) {
        alert(`Статья с ID ${currentArticleId} удалена.`);
    }
}
// Открытие модального окна для создания статьи
function openCreateArticleModal() {
    document.getElementById("create-article-modal").style.display = "flex";
}

// Закрытие модального окна для создания статьи
function closeCreateArticleModal() {
    document.getElementById("create-article-modal").style.display = "none";
}

// Открытие модального окна для редактирования статьи
function openEditArticleModal() {
    document.getElementById("edit-article-modal").style.display = "flex";
}

// Закрытие модального окна для редактирования статьи
function closeEditArticleModal() {
    document.getElementById("edit-article-modal").style.display = "none";
}

// Обработчик для клика по документу (для закрытия модальных окон, если клик был вне окна)
window.addEventListener('click', function (event) {
    const createModal = document.getElementById("create-article-modal");
    const editModal = document.getElementById("edit-article-modal");

    // Закрытие модальных окон, если клик был вне модального окна
    if (event.target === createModal) {
        closeCreateArticleModal();
    } else if (event.target === editModal) {
        closeEditArticleModal();
    }
});
