package auth

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Username        string `json:"username" binding:"required,alphanum,min=3,max=32"`
	FullName        string `json:"full_name" binding:"required"`
	Password        string `json:"password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthHandler struct {
	db *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем существование пользователя
	var count int64
	h.db.Model(&User{}).Where("username = ?", req.Username).Count(&count)
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "данный пользователь уже зарегистрирован"})
		return
	}

	// Валидация данных
	if err := validateUserData(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка при создании пароля"})
		return
	}

	// Создаем пользователя с текущим временем
	user := User{
		Username:  req.Username,
		FullName:  strings.TrimSpace(req.FullName),
		Password:  string(hashedPassword),
		IsAdmin:   false,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка при регистрации пользователя"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "пользователь успешно зарегистрирован",
		"user": gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"full_name":  user.FullName,
			"is_admin":   user.IsAdmin,
			"created_at": user.CreatedAt.Format(time.RFC3339),
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат запроса"})
		return
	}

	var user User
	if err := h.db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "пользователь не найден"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный пароль"})
		return
	}

	// Обновляем время последнего входа
	h.db.Model(&user).Update("updated_at", time.Now())

	c.JSON(http.StatusOK, gin.H{
		"message": "авторизация успешна",
		"user": gin.H{
			"id":        user.ID,
			"username":  user.Username,
			"full_name": user.FullName,
			"is_admin":  user.IsAdmin,
		},
		"last_login": user.UpdatedAt.Format(time.RFC3339),
	})
}

// Упрощенная генерация токена (в реальном проекте используйте JWT)
func generateSimpleToken(userID uint, isAdmin bool) string {
	return fmt.Sprintf("simpletoken-%d-%t", userID, isAdmin)
}
