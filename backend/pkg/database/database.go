package database

import (
	"fmt"
	"log"
	"time"

	"github.com/Dmitriy4565/Hackaton-2025/ttk_office_organizer/backend/auth"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		"localhost",  // или ваш хост
		"postgres",   // созданный вами пользователь
		"022402",     // пароль
		"ttk_office", // имя БД
		5432,         // порт
	)

	var db *gorm.DB
	var err error

	// Повторяем попытки подключения
	for i := 0; i < 5; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Попытка подключения %d: %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatal("Не удалось подключиться к базе данных:", err)
	}

	// Проверяем существование таблицы
	if !db.Migrator().HasTable(&auth.User{}) {
		log.Fatal("Таблица users не найдена в базе данных")
	}

	log.Println("Успешное подключение к PostgreSQL (существующей таблице users)")
	return db
}
