from django.urls import path
from . import views

urlpatterns = [
    path('registration/',views.Registrtion.as_view()),
    path('login/',views.LoginView.as_view()),
    path('details',views.GetUserDetails.as_view()),
]