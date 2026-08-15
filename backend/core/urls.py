from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/prescriptions/', include('prescriptions.urls')),
    path('api/dietplan/', include('dietplan.urls')),
]

# Serve media files even outside DEBUG mode.
# Not ideal for large-scale production (a CDN/S3 would be better),
# but fine for this deployment since Render's free tier has no
# separate static file server for media.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)