package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    // Create Gin router
    router := gin.Default()
    
    // Load all necessary templates explicitly
    router.LoadHTMLFiles(
        "templates/index.html",
        "templates/partials/footer.html",
        "templates/partials/navbar.html",
        "templates/auth/login.html",
        "templates/auth/register.html",
    )
    
    // Serve static files
    router.Static("/static", "./static")

	router.Static("/partials", "./templates/partials")
    
    // Routes for each page
    router.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{
            "title": "Attomos",
        })
    })
    

    router.GET("/login", func(c *gin.Context) {
        c.HTML(http.StatusOK, "login.html", gin.H{ // Placeholder, replace with actual template
            "title": "Iniciar sesión",
        })
    })
    
    router.GET("/register", func(c *gin.Context) {
        c.HTML(http.StatusOK, "register.html", gin.H{ // Placeholder, replace with actual template
            "title": "Registrarse",
        })
    })
    
    // Start server
    router.Run(":8080")
}