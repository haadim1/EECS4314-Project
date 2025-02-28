from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
import os

app = Flask(__name__)
import os
from dotenv import load_dotenv
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    return conn

# Create the users table if it doesn't exist
def create_users_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(120) NOT NULL
    );
    """)
    conn.commit()
    cur.close()
    conn.close()

create_users_table()

@app.route("/")
def home():
    return "Welcome to the home page!"

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Request body must be JSON"}), 400
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return jsonify({"message": "Missing required fields!"}), 400
        conn = get_db_connection()
        cur = conn.cursor()
        insert_query = sql.SQL("""
        INSERT INTO users (username, email, password)
        VALUES (%s, %s, %s)
        """)
        cur.execute(insert_query, (username, email, password))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "User registered successfully!"}), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"message": "Username or email already exists!"}), 400
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({"message": "An error occurred: " + str(e)}), 500

@app.route("/get-user-details", methods=["POST"])
def get_user_detail():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body must be JSON"}), 400
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    select_query = sql.SQL("""
    SELECT * FROM users WHERE username = %s AND password = %s
    """)
    cur.execute(select_query, (username, password))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if user:
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "failed"}), 401

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)