This is a e-comerse website for my software project lab-3 in 8th semister.
This site is build for implement recomendation system.

Frontent: 
  -Framework: Angular 18
  -Library: bootstrap, primeng

Backend: 
  -Framwork: Django
  -Version: 5.1
  -For run this project you need to install some pakage using this command
    -pip install django-cors-headers
    -pip install djangorestframework
    -pip install pymysql
    -pip install Pillow
    -pip install cryptography
    -python manage.py migrate
  The last command will create database table automatically. You need to create a schema name 'e-comerse'.
    -python manage.py runserver
  This command will run the backend server at 8000 port.

Database: 
  -Name: MySQL
  -Version: 8.1 or upper version
