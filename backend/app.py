import os
import requests
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from bs4 import BeautifulSoup
from llama_index.core import SimpleDirectoryReader, ServiceContext, VectorStoreIndex, Document
from llama_index.llms.groq import Groq
from llama_index.core.settings import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from duckduckgo_search import DDGS  # Using DuckDuckGo for search
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

# Flask setup
app = Flask(__name__, template_folder="../templates", static_folder="../static")
app.secret_key = "SUBHADIPDAS"  # Change this in production
# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")  # Ensure MongoDB is running
db = client["user_database"]
users_collection = db["users"]

# Password hashing
bcrypt = Bcrypt(app)
# Load Groq API key securely from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set! Please set it in environment variables.")

# Ensure the "data" directory exists
os.makedirs("data", exist_ok=True)

# Function to fetch top search links using DuckDuckGo
def fetch_search_links(query):
    try:
        with DDGS() as ddgs:
            search_results = ddgs.text(query, max_results=10)  # DuckDuckGo search
            links = [result.get("href", "#") for result in search_results if "href" in result]
            return links if links else ["No relevant results found."]
    except Exception as e:
        return {"error": f"Error fetching search results: {str(e)}"}

# Function to scrape a webpage
def scrape_website(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Parse webpage content
        soup = BeautifulSoup(response.text, "html.parser")
        text_data = " ".join([p.get_text() for p in soup.find_all("p")])

        # Save scraped data
        file_path = "data/scraped_data.txt"
        with open(file_path, "a", encoding="utf-8") as file:
            file.write(text_data + "\n\n")

        return text_data
    except requests.exceptions.RequestException as e:
        return f"Error fetching webpage: {str(e)}"

# Function to process queries using LLM
def ask_llm(question):
    try:
        file_path = "data/scraped_data.txt"
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            return "No scraped data available. Please scrape selected sources first."

        with open(file_path, "r", encoding="utf-8") as file:
            document_text = file.read()

        document = Document(text=document_text)

        # Initialize LlamaIndex
        llm = Groq(api_key=GROQ_API_KEY, model="llama3-8b-8192")
        Settings.llm = llm
        Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en")

        index = VectorStoreIndex.from_documents([document])
        query_engine = index.as_query_engine()

        response = query_engine.query(question)
        return str(response)
    except Exception as e:
        return f"Error processing request: {str(e)}"

# Flask Routes
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template('signup.html')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    links = fetch_search_links(query)  # Get only links

    return jsonify({"results": links})  # Return list of links



@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    urls = data.get("urls")  # Expecting multiple URLs from frontend


    if not urls or not isinstance(urls, list):
        return jsonify({"error": "A list of URLs is required"}), 400

    scraped_texts = []  # Store all scraped content

    for url in urls:
        text = scrape_website(url)
        if text.startswith("Error"):  
            print(f"Skipping failed scrape: {url}")  # Debugging
            continue  

        scraped_texts.append(f"Source: {url}\n{text}")  # Add source info

    if not scraped_texts:
        return jsonify({"error": "Failed to scrape any content"}), 500

    # Save all scraped data to a single file (overwrite old data)
    file_path = "data/scraped_data.txt"
    with open(file_path, "w", encoding="utf-8") as file:
        file.write("\n\n".join(scraped_texts))  # Separate sources

    return jsonify({"message": "Scraping completed", "scraped_count": len(scraped_texts)})



@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "Question is required"}), 400

    answer = ask_llm(question)
    return jsonify({"answer": answer})
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({"name": name, "email": email, "password": hashed_password})

    return jsonify({"message": "Signup successful"}), 201


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    session["user"] = user["name"]
    return jsonify({"message": "Login successful", "user": user["name"]}), 200


# Logout route
@app.route('/logout')
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out"}), 200

# Fetch User Details
@app.route('/user', methods=['GET'])
def get_user():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        token = token.split("Bearer ")[1]  # Extract token from "Bearer <token>"
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})  # Exclude password
        if user:
            return jsonify({"name": user["name"], "email": user["email"]})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
