package server

import (
	"fmt"

	"ttk_office_organizer/internal/app/auth"
	"ttk_office_organizer/internal/pkg/config"
	"ttk_office_organizer/internal/pkg/logger"
	"ttk_office_organizer/internal/pkg/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server struct {
	cfg    *config.Config
	db     *gorm.DB
	router *gin.Engine
	logger *logger.Logger
}

func NewServer(cfg *config.Config, db *gorm.DB, logger *logger.Logger) *Server {
	// Настройка режима Gin
	if cfg.Server.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()

	// Middleware
	router.Use(gin.Recovery())
	router.Use(middleware.LoggerMiddleware(logger))
	router.Use(middleware.CORSMiddleware())

	// Инициализация обработчиков
	authHandler := auth.NewAuthHandler(
		db,
		cfg.Server.SessionKey,
		cfg.Server.SessionTimeout,
	)

	// Публичные маршруты
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Группа аутентификации
	authGroup := router.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)

		// HTML страницы
		authGroup.GET("/register", func(c *gin.Context) {
			c.HTML(200, "auth/register.html", nil)
		})
		authGroup.GET("/login", func(c *gin.Context) {
			c.HTML(200, "auth/login.html", nil)
		})
	}

	// Защищенные маршруты
	api := router.Group("/api")
	api.Use(middleware.AuthMiddleware(cfg.Server.SessionKey))
	{
		api.GET("/user", authHandler.GetUser)

		// Пример защищенного маршрута
		api.GET("/protected", func(c *gin.Context) {
			userID := c.MustGet("userID").(uint)
			c.JSON(200, gin.H{
				"message": fmt.Sprintf("Hello user %d", userID),
				"status":  "authenticated",
			})
		})
	}

	// Настройка статических файлов и шаблонов
	router.Static("/assets", "./assets")
	router.LoadHTMLGlob("templates/**/*")

	return &Server{
		cfg:    cfg,
		db:     db,
		router: router,
		logger: logger,
	}
}

func (s *Server) Run() error {
	s.logger.Infof("Starting server on port %s", s.cfg.Server.Port)
	return s.router.Run(":" + s.cfg.Server.Port)
}

func (s *Server) Shutdown() {
	sqlDB, err := s.db.DB()
	if err != nil {
		s.logger.Error("Failed to get database connection for shutdown")
		return
	}
	sqlDB.Close()
	s.logger.Info("Server shutdown complete")
}
