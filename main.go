package main

import (
	"log"

	"github.com/Dmitriy4565/Hackaton-2025/internal/app/auth"
	"github.com/Dmitriy4565/Hackaton-2025/internal/pkg/config"
	"github.com/Dmitriy4565/Hackaton-2025/internal/pkg/database"
	"github.com/Dmitriy4565/Hackaton-2025/internal/pkg/logger"
	"github.com/Dmitriy4565/Hackaton-2025/internal/server"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.Load("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Инициализация логгера
	logger := logger.NewLogger(&cfg.Logging)

	// Инициализация подключения к БД
	db, err := database.NewPostgresConnection(&cfg.Database)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}

	// Выполнение миграций
	if err := auth.Migrate(db); err != nil {
		logger.Fatalf("Failed to migrate database: %v", err)
	}

	// Создание и запуск сервера
	srv := server.NewServer(cfg, db, logger)
	if err := srv.Run(); err != nil {
		logger.Fatalf("Failed to start server: %v", err)
	}
}
