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
Docker instructions to follow. 
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