package auth

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	Title       string    `gorm:"size:255;not null" json:"title"`      // Название статьи
	Description string    `gorm:"type:text" json:"description"`        // Краткое описание
	Content     string    `gorm:"type:text" json:"content"`            // Полный текст статьи
	ImageURL    string    `gorm:"size:512" json:"image_url"`           // Ссылка на картинку
	CreatedAt   time.Time `gorm:"not null" json:"created_at"`          // Дата создания
	UpdatedAt   time.Time `gorm:"not null" json:"updated_at"`          // Дата обновления
	AuthorID    uint      `gorm:"not null" json:"author_id"`           // ID автора
	UpdaterID   uint      `gorm:"not null" json:"updater_id"`          // ID редактора
	Author      User      `gorm:"foreignKey:AuthorID" json:"author"`   // Связь с автором
	Updater     User      `gorm:"foreignKey:UpdaterID" json:"updater"` // Связь с редактором
}

// Автоматическое заполнение дат при создании/обновлении
func (a *Article) BeforeCreate(tx *gorm.DB) error {
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()
	return nil
}

func (a *Article) BeforeUpdate(tx *gorm.DB) error {
	a.UpdatedAt = time.Now()
	return nil
}
