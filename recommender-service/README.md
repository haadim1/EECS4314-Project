# Hair Style Recommendation
----------------
## Victor Buica

# NOTE
best way to do it is to pull the docker container for this part of the project instead of running with the dependencies

# Docker instructions: Recommended is dockerHub approach
First thing you do is download docker if you do not have it yet. 

[Docker Download Page](https://www.docker.com/get-started)

1. **Terminal**
   - pull the following
    ```
    docker pull victorbuica/recommender-service:v1.1
    ```
    then you run this:
    ```
    docker run -d -p 5001:5001 victorbuica/recommender-service:v1.1
    ```
2. **Docker Hub APP** 
   - This can also be done in the docker desktop just type the following in the search bar:
    ```
    victorbuica/recommender-service:v1.1
    ```
    and then press the run button


## Requirements (Only if you really do not want to use the container)

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
pip install pillow
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

# **NOTE
If you are running locally the backend and then the AI reccommender 

then please change the following:

## Configuration

### Recommender Service URL

The recommender service is embedded in the client dashboard via an iframe. You need to update the URL to point to your recommender service:

1. Open `frontend/app/dashboard/clientDash/page.tsx`
2. Locate the iframe in the recommendations section (around line 691):

```tsx
<iframe
  src="http://localhost:5001"  // Change this URL to your recommender service
  title="recommender"
  // ...
/>
```
Change the url to whatever the new port numbers would be when running it. (Default goes to 5000, increments every one up whenever a new service is running)


