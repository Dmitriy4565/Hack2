package main

import (
	"net/http"

	"github.com/Dmitriy4565/Hackaton-2025/backend/auth"
	"github.com/Dmitriy4565/Hackaton-2025/backend/pkg/database"
	"github.com/gin-gonic/gin"
)

func main() {
	// Инициализация БД
	db := database.InitDB()

	// Создание роутера Gin
	router := gin.Default()

	// Настройка CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methodыs", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Регистрация маршрутов
	auth.SetupRoutes(router, db)

	// Статические файлы
	router.Static("/css", "./frontend/css")
	router.Static("/js", "./frontend/js")
	router.Static("/images", "./frontend/images")
	router.LoadHTMLGlob("frontend/templates/*.html")

	// HTML страницы
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/tasks", func(c *gin.Context) {
		c.HTML(http.StatusOK, "tasks.html", nil)
	})

	// Запуск сервера
	router.Run(":8080")
}
