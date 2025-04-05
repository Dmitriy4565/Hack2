package auth

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey;column:id"`
	CreatedAt time.Time      `gorm:"column:created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at;index"`
	Username  string         `gorm:"column:username;unique;not null;size:32"`
	FullName  string         `gorm:"column:full_name;not null;size:100"`
	Password  string         `gorm:"column:password;not null"`
	IsAdmin   bool           `gorm:"column:is_admin;default:false;not null"`
}

// TableName явно указывает имя таблицы
func (User) TableName() string {
	return "users"
}
