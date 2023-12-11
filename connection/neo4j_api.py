from flask import Flask, request, jsonify
from neo4j import GraphDatabase

app = Flask(__name__)

# Configure Neo4j connection
uri = "bolt://localhost:7687"  # Replace with your Neo4j instance
username = "neo4j"             # Replace with your username
password = "sindit-neo4j"        # Replace with your password
driver = GraphDatabase.driver(uri, auth=(username, password))

# Define a function to set the CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # allowed origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'  # Adjust as needed
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Apply the CORS function to all routes using the after_request decorator
@app.after_request
def apply_cors(response):
    return add_cors_headers(response)

@app.route('/updateNode', methods=['POST'])
def update_node():
    data = request.json
    node_name = data['node_name']
    url = data['url']
    print("Received request to update:", node_name, "with URL:", url)
    with driver.session() as session:
        result = session.run("MATCH (n) WHERE n.name = $node_name "
                             "SET n.url = $url RETURN n",
                             node_name=node_name, url=url)
        return jsonify([record["n"].get("url") for record in result])

if __name__ == '__main__':
    app.run(host="localhost", port=5001)
