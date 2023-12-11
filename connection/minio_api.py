from flask import Flask, request, jsonify
from minio_access import url_object


app = Flask(__name__)

# Define a function to set the CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # allowed origin
    response.headers['Access-Control-Allow-Methods'] = 'GET'  # Adjust as needed
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# Apply the CORS function to all routes using the after_request decorator
@app.after_request
def apply_cors(response):
    return add_cors_headers(response)

@app.route('/get_minio_url', methods=['GET'])
def get_minio_url():
    node_name = request.args.get('node_name')  # You can pass the node name as a query parameter
    url = url_object(bucket_name='pcap-ferro', object_name=node_name)
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host="localhost", port=5000)
