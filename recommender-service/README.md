## Requirements

* dlib

```
pip install dlib
```
* CMake

```
pip install cmake
```
* Face Recognition

```
pip install face_recognition
```
## Running the recommendation system
Clone, and cd into the repo directory. The first thing you need to do is to get the required packages installed by running above commands in the terminal or append '!' before command in the jupyter notebook.

Note: For security reasons browsers do not allow to retrieve full file path in browser and hence no access to the File System. When a file is selected by using the input type=file object, the value of the value property depends on the value of the "Include local directory path when uploading files to a server" security setting for the security zone used to display the Web page containing the input object.

The fully qualified filename of the selected file is returned only when this setting is enabled. When the setting is disabled, Browser replaces the local drive and directory path with the string C:\fakepath\ in order to prevent inappropriate information disclosure. 

You should save the recommended image in the folder (data -> pics -> recommendation_pics) of the repository. To run the flask app:
```
FLASK_APP=app.py flask run
```

# Hair Style Recommendation
----------------
## Victor Buica

## Requirements

* dlib

```
pip install dlib
```
* CMake

```
pip install cmake
```
* Face Recognition

```
pip install face_recognition
```
* Specific pillow version
```
pip install pillow==8.3.1
```
## Running the recommendation system
Depending on what shell you use you mainly need to do the following:

### Bash/Linux/MacOS
```
export FLASK_APP=app.py flask run
```
### Windows PowerShell
```
$env:FLASK_APP = "app.py" flask run
```
### Windows CMD
```
set FLASK_APP=app.py flask run
```
### Using Python directly (any platform)
```
python -m flask run
```
Docker instructions to follow. 
