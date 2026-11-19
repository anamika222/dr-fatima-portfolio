# Merge into config/settings.py
import os
INSTALLED_APPS += ["rest_framework", "corsheaders", "clinic"]
MIDDLEWARE.insert(0, "corsheaders.middleware.CorsMiddleware")
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
TIME_ZONE = "Asia/Dhaka"
USE_TZ = True

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.ScopedRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"booking": "10/hour", "contact": "10/hour", "feedback": "5/hour"},
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}
# config/urls.py ->  path("admin/", admin.site.urls), path("api/", include("clinic.urls"))
