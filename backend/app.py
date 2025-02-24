from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/hello", methods=["GET"])
def hello_salon():
    return jsonify({"message": "Hello from the SalonAI Flask backend!"})

if __name__ == "__main__":
    # Run in debug mode on port 5000
    app.run(debug=True, host="0.0.0.0", port=5000)
