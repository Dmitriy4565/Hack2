package auth

import (
	"fmt"
	"log"
	"strings"

	"gorm.io/gorm"
)

func UserExists(db *gorm.DB, username string) (bool, error) {
	var count int64
	err := db.Model(&User{}).Where("username = ?", username).Count(&count).Error
	return count > 0, err
}

// validateUserData проверяет корректность данных перед регистрацией
func validateUserData(req RegisterRequest) error {
	log.Println("Запуск валидации данных пользователя:", req.Username)

	// Проверяем длину имени пользователя
	if len(req.Username) < 3 || len(req.Username) > 32 {
		log.Println("Ошибка: имя пользователя слишком короткое или длинное")
		return fmt.Errorf("имя пользователя должно быть от 3 до 32 символов")
	}

	// Проверяем, что имя пользователя содержит только буквы и цифры
	if !isAlphanumeric(req.Username) {
		log.Println("Ошибка: имя пользователя содержит недопустимые символы")
		return fmt.Errorf("имя пользователя может содержать только буквы и цифры")
	}

	// Убираем лишние пробелы в полном имени
	req.FullName = strings.TrimSpace(req.FullName)
	if len(req.FullName) == 0 {
		log.Println("Ошибка: полное имя не может быть пустым")
		return fmt.Errorf("полное имя обязательно для заполнения")
	}

	// Проверяем длину пароля
	if len(req.Password) < 6 {
		log.Println("Ошибка: пароль слишком короткий")
		return fmt.Errorf("пароль должен содержать минимум 6 символов")
	}

	// Проверяем совпадение паролей
	if req.Password != req.ConfirmPassword {
		log.Println("Ошибка: пароли не совпадают")
		return fmt.Errorf("пароли должны совпадать")
	}

	log.Println("Валидация пройдена успешно")
	return nil
}

// Функция проверки, что строка содержит только буквы и цифры
func isAlphanumeric(str string) bool {
	for _, c := range str {
		if !(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z') && !(c >= '0' && c <= '9') {
			return false
		}
	}
	return true
}
