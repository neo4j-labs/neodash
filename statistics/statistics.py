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


# Define a function to set the CORS headers
def add_cors_headers(response):
    response.headers[
        "Access-Control-Allow-Origin"
    ] = "http://0.0.0.0:3000"  # allowed origin
    response.headers["Access-Control-Allow-Methods"] = "GET"  # Adjust as needed
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


# Apply the CORS function to all routes using the after_request decorator
@app.after_request
def apply_cors(response):
    return add_cors_headers(response)


@app.route("/get_statistics", methods=["GET"])
def get_statistics():
    node_name = request.args.get(
        "node_name"
    )  # You can pass the node name as a query parameter

    url = url_object(bucket_name="pcap-ferro", object_name=node_name)

    # Download file
    urllib.request.urlretrieve(url, "file.pcap")

    # Run analysis
    df = pcap_analysis("file.pcap")
    print(df)

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
