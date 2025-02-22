# import os
# import requests
# from flask import Flask, request, jsonify, render_template
# from bs4 import BeautifulSoup
# from llama_index.core import SimpleDirectoryReader, ServiceContext, VectorStoreIndex, Document
# from llama_index.llms.groq import Groq
# from llama_index.core.settings import Settings
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from duckduckgo_search import DDGS  # Using DuckDuckGo for search
# from flask import session, redirect, url_for
# from werkzeug.security import generate_password_hash, check_password_hash
# from pymongo import MongoClient
# import secrets

# # Flask setup
# app = Flask(__name__, template_folder="../templates", static_folder="../static")
# # MongoDB setup
# client = MongoClient('mongodb://localhost:27017/')
# db = client['web_scraper_db']
# users_collection = db['users']

# # Secret key for session management
# app.secret_key = secrets.token_hex(16)

# # Load Groq API key securely from environment variables
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# if not GROQ_API_KEY:
#     raise ValueError("GROQ_API_KEY is not set! Please set it in environment variables.")

# # Ensure the "data" directory exists
# os.makedirs("data", exist_ok=True)

# # Function to fetch top search links using DuckDuckGo
# def fetch_search_links(query):
#     try:
#         with DDGS() as ddgs:
#             search_results = ddgs.text(query, max_results=10)
#             links = [result["href"] for result in search_results if "href" in result]
#             return links if links else ["No relevant results found."]
#     except Exception as e:
#         return {"error": f"Error fetching search results: {str(e)}"}

# # Function to scrape a webpage
# def scrape_website(url):
#     try:
#         headers = {"User-Agent": "Mozilla/5.0"}
#         response = requests.get(url, headers=headers, timeout=10)
#         response.raise_for_status()

#         # Parse webpage content
#         soup = BeautifulSoup(response.text, "html.parser")
#         text_data = " ".join([p.get_text() for p in soup.find_all("p")])

#         # Save scraped data
#         file_path = "data/scraped_data.txt"
#         with open(file_path, "a", encoding="utf-8") as file:
#             file.write(text_data + "\n\n")

#         return text_data
#     except requests.exceptions.RequestException as e:
#         return f"Error fetching webpage: {str(e)}"

# # Function to process queries using LLM
# def ask_llm(question):
#     try:
#         file_path = "data/scraped_data.txt"
#         if not os.path.exists(file_path):
#             return "No scraped data available. Please scrape a website first."

#         with open(file_path, "r", encoding="utf-8") as file:
#             document_text = file.read()

#         document = Document(text=document_text)

#         # Initialize Groq LLaMA model
#         llm = Groq(api_key=GROQ_API_KEY, model="llama3-8b-8192")
#         Settings.llm = llm
#         Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en")

#         # Create a LlamaIndex vector store
#         index = VectorStoreIndex.from_documents([document])
#         query_engine = index.as_query_engine()

#         response = query_engine.query(question)
#         return str(response)
#     except Exception as e:
#         return f"Error processing request: {str(e)}"

# # Flask Routes
# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if request.method == 'POST':
#         data = request.json
#         username = data.get('username')
#         password = data.get('password')
        
#         # Check if username already exists
#         if users_collection.find_one({'username': username}):
#             return jsonify({'error': 'Username already exists'}), 400
        
#         # Create new user
#         user = {
#             'username': username,
#             'password': generate_password_hash(password)
#         }
#         users_collection.insert_one(user)
#         return jsonify({'message': 'User created successfully'}), 201
    
#     return render_template('signup.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         data = request.json
#         username = data.get('username')
#         password = data.get('password')
        
#         user = users_collection.find_one({'username': username})
#         if user and check_password_hash(user['password'], password):
#             session['user'] = username
#             return jsonify({'message': 'Login successful'}), 200
        
#         return jsonify({'error': 'Invalid username or password'}), 401
    
#     return render_template('login.html')

# @app.route('/logout')
# def logout():
#     session.pop('user', None)
#     return redirect(url_for('index'))

# # Protect routes that require authentication
# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if 'user' not in session:
#             return redirect(url_for('login'))
#         return f(*args, **kwargs)
#     return decorated_function

# # Update existing routes to require authentication
# @app.route('/')
# @login_required
# def index():
#     return render_template('index.html')

# @app.route('/search', methods=['POST'])
# @login_required

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/search', methods=['POST'])
# def search_links():
#     data = request.json
#     query = data.get("query")
#     if not query:
#         return jsonify({"error": "Query is required"}), 400

#     links = fetch_search_links(query)
#     return jsonify({"links": links})

# @app.route('/scrape', methods=['POST'])
# def scrape():
#     data = request.json
#     url = data.get("url")
#     if not url:
#         return jsonify({"error": "URL is required"}), 400

#     scraped_text = scrape_website(url)
#     return jsonify({"message": "Scraping completed", "data": scraped_text})

# @app.route('/ask', methods=['POST'])
# def ask():
#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "Question is required"}), 400

#     answer = ask_llm(question)
#     return jsonify({"answer": answer})

# # Run Flask app
# if __name__ == '__main__':
#     app.run(debug=True)
import os
import requests
from flask import Flask, request, jsonify, render_template
from bs4 import BeautifulSoup
from llama_index.core import SimpleDirectoryReader, ServiceContext, VectorStoreIndex, Document
from llama_index.llms.groq import Groq
from llama_index.core.settings import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from duckduckgo_search import DDGS  # Using DuckDuckGo for search

# Flask setup
app = Flask(__name__, template_folder="../templates", static_folder="../static")

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
            search_results = ddgs.text(query, max_results=10)
            links = [result["href"] for result in search_results if "href" in result]
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
        if not os.path.exists(file_path):
            return "No scraped data available. Please scrape a website first."

        with open(file_path, "r", encoding="utf-8") as file:
            document_text = file.read()

        document = Document(text=document_text)

        # Initialize Groq LLaMA model
        llm = Groq(api_key=GROQ_API_KEY, model="llama3-8b-8192")
        Settings.llm = llm
        Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en")

        # Create a LlamaIndex vector store
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

@app.route('/search', methods=['POST'])
def search_links():
    data = request.json
    query = data.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    links = fetch_search_links(query)
    return jsonify({"links": links})

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    scraped_text = scrape_website(url)
    return jsonify({"message": "Scraping completed", "data": scraped_text})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "Question is required"}), 400

    answer = ask_llm(question)
    return jsonify({"answer": answer})

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
