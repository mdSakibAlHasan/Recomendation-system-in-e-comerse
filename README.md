<h2>This is a e-comerse website for my software project lab-3(SPL-3) in 8th semister.</h2>
There are three part in my project.
    (i) Cold start strategy-
          For new user and new product this work. It gets from <a href="https://www.mdpi.com/2071-1050/13/19/10786">this research paper</a>.
    (ii) For login user, it create preference matrix that calculate which product user prefer more. Then cluster same product and give suggession to user.
    (iii) Notification -
          Use cosine similarity, we can get which product user like/necessary after a product buy.
<h2>This site is build for implement recomendation system.</h2>

<h2>Frontent: </h2>
<ul>
  <li>Framework: Angular 18</li>
  <li>Library: bootstrap, primeng</li>
</ul>

<h2>Backend: </h2>
<ul>
  <li>Framwork: Django</li>
  <li>Version: 5.1</li>
  <li>For run this project you need to install some pakage using this command</li>
  <ul>
    <li>pip install -r requirements.txt</li>
    <li>python manage.py makemigrations (before this create a schema in database name 'shop')</li>
    <li>python manage.py migrate <br>
    The last command will create database table automatically. You need to create a schema name 'e-comerse'.</li>
    <li>python manage.py runserver <br>
    This command will run the backend server at 8000 port.</li>
</ul>

<h2>Database: </h2>
<ul>
  <li>Name: MySQL</li>
  <li>Version: 8.1 or upper version</li>
  <p>NB: in resource section there sql data that can run and it stores data</p>
</ul>
