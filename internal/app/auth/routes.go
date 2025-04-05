package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthRoutes struct {
	handler *AuthHandler
}

func NewAuthRoutes(handler *AuthHandler) *AuthRoutes {
	return &AuthRoutes{handler: handler}
}

func (r *AuthRoutes) Setup(router *gin.Engine) {
	authGroup := router.Group("/auth")
	{
		authGroup.GET("/register", func(c *gin.Context) {
			c.HTML(http.StatusOK, "auth/register.html", nil)
		})
		authGroup.GET("/login", func(c *gin.Context) {
			c.HTML(http.StatusOK, "auth/login.html", nil)
		})
		authGroup.POST("/register", r.handler.Register)
		authGroup.POST("/login", r.handler.Login)
	}
}
