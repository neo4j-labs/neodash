import argparse
import os
import sys

import matplotlib.pyplot as plt
import pandas as pd
from flask import Flask, jsonify, request
from minio_access import url_object
from scapy.all import IP, TCP, rdpcap

import urllib.request

app = Flask(__name__)

ALLOWED_ORIGINS = [
        "http://0.0.0.0:3000", 
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://172.0.18.1:3000", 
        "http://192.168.0.44:3000",
]

# Define a function to set the CORS headers
def add_cors_headers(response):
    request_origin = request.headers.get('Origin')
    if request_origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = request_origin
    response.headers["Access-Control-Allow-Methods"] = "GET"  # Adjust as needed
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

# Apply the CORS function to all routes using the after_request decorator
@app.after_request
def apply_cors(response):
    return add_cors_headers(response)


@app.route("/get_statistics", methods=["GET"])
def get_statistics():

    import time

    start = time.time()

    filename = request.args.get(
        "endpoint"
    )  # You can pass the node name as a query parameter

    url = url_object(bucket_name="pcap-ferro", object_name=filename)

    # Download file
    urllib.request.urlretrieve(url, "file.pcap")

    # Run analysis
    df = pcap_analysis("file.pcap")
    print(df)

    end = time.time()
    print("=======================")
    print(f"Time used: {end-start}")
    print("=======================")

    return df.to_json()


def pcap_analysis(filename, create_plots=False):
    packets = rdpcap(filename)
    data = []

    for i, packet in enumerate(packets):
        if IP in packet:
            src_ip = packet[IP].src
            dst_ip = packet[IP].dst
            packet_size = len(packet)
            timestamp = packet.time
            # Calculate inter-arrival time
            if i > 0:
                inter_arrival = timestamp - packets[i - 1].time
            else:
                inter_arrival = 0

            data.append([src_ip, dst_ip, packet_size, inter_arrival, timestamp])

    df = pd.DataFrame(
        data, columns=["src_ip", "dst_ip", "packet_size", "inter_arrival", "timestamp"]
    )

    # Convert inter_arrival to a numeric type (float)
    df["inter_arrival"] = pd.to_numeric(df["inter_arrival"], errors="coerce")

    print(df)
    print(df.info())

    # Plotting
    if create_plots:
        plt.figure(figsize=(10, 5))
        plt.subplot(1, 2, 1)
        df["packet_size"].plot(kind="hist", title="Packet Size Distribution")
        plt.xlabel("Packet Size (bytes)")

        plt.subplot(1, 2, 2)
        df["inter_arrival"].plot(
            kind="hist", title="Inter-arrival Time Distribution", bins=30
        )
        plt.xlabel("Inter-arrival Time (seconds)")

        plt.tight_layout()
        plt.show()

    # Returning DataFrame with basic statistics
    stats_df = df.describe()

    return stats_df


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
