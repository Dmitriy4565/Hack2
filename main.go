package main

import (
	"log"
	"ttk_office_organizer/internal/app/auth"
	"ttk_office_organizer/internal/pkg/config"
	"ttk_office_organizer/internal/pkg/database"
	"ttk_office_organizer/internal/pkg/logger"
	"ttk_office_organizer/internal/server"
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
