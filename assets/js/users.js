document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                username: e.target.username.value,
                email: e.target.email.value,
                password: e.target.password.value
            };
            
            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Регистрация успешна!');
                    window.location.href = '/auth/login';
                } else {
                    alert(data.error || 'Ошибка регистрации');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при регистрации');
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: e.target.email.value,
                password: e.target.password.value
            };
            
            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/tasks';
                } else {
                    alert(data.error || 'Ошибка входа');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при входе');
            }
        });
    }
});