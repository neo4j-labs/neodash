#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Analyze PCAP files.

Created:
    2023-11-20

"""
import argparse
import os
import sys


import matplotlib.pyplot as plt
from scapy.all import rdpcap, IP
import pandas as pd

from flowmeter.flowmeter import Flowmeter

# def process_pcap(file_name):
#     print('Opening {}...'.format(file_name))

# if __name__ == '__main__':
#     parser = argparse.ArgumentParser(description='PCAP reader')
#     parser.add_argument('--pcap', metavar='<pcap file name>',
#                         help='pcap file to parse', required=True)
#     args = parser.parse_args()
    
#     file_name = args.pcap
#     if not os.path.isfile(file_name):
#         print('"{}" does not exist'.format(file_name), file=sys.stderr)
#         sys.exit(-1)

#     process_pcap(file_name)
#     sys.exit(0)


from scapy.all import rdpcap, IP, TCP
import pandas as pd

def read_pcap(filename):
    """
    Reads a PCAP file and returns Scapy packets.
    """
    packets = rdpcap(filename)
    return packets

def extract_data(packets):
    """
    Extracts relevant data from packets and returns a DataFrame.
    """
    data = []
    for packet in packets:
        if IP in packet and TCP in packet:  # Check for IP and TCP layers
            src_ip = packet[IP].src
            dst_ip = packet[IP].dst
            src_port = packet[TCP].sport
            dst_port = packet[TCP].dport
            packet_size = len(packet)
            timestamp = packet.time

            data.append([src_ip, dst_ip, src_port, dst_port, packet_size, timestamp])

    df = pd.DataFrame(data, columns=['src_ip', 'dst_ip', 'src_port', 'dst_port', 'packet_size', 'timestamp'])
    return df

def analyze_data(df):
    """
    Performs basic analysis on the DataFrame.
    """
    # Example analysis: Count of packets per source IP
    analysis_results = df['src_ip'].value_counts()
    return analysis_results

def aggregate_data(df, aggregation_criteria):
    """
    Aggregates data based on the given criteria.
    """
    # Example aggregation: Sum of packet sizes by source IP
    aggregated_data = df.groupby(aggregation_criteria)['packet_size'].sum()
    return aggregated_data

def format_results(results):
    """
    Formats the results into a desired structure or format.
    """
    formatted_results = results.to_json()  # Example: Convert to JSON
    return formatted_results

def analysis(filename):

    feature_gen = Flowmeter(filename)
    df = feature_gen.build_feature_dataframe()

    return df

def pcap_analysis(filename):
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
                inter_arrival = timestamp - packets[i-1].time
            else:
                inter_arrival = 0

            data.append([src_ip, dst_ip, packet_size, inter_arrival, timestamp])

    df = pd.DataFrame(data, columns=['src_ip', 'dst_ip', 'packet_size', 'inter_arrival', 'timestamp'])

    # Convert inter_arrival to a numeric type (float)
    df['inter_arrival'] = pd.to_numeric(df['inter_arrival'], errors='coerce')


    print(df)
    print(df.info())

    # Plotting
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    df['packet_size'].plot(kind='hist', title='Packet Size Distribution')
    plt.xlabel('Packet Size (bytes)')

    plt.subplot(1, 2, 2)
    df['inter_arrival'].plot(kind='hist', title='Inter-arrival Time Distribution', bins=30)
    plt.xlabel('Inter-arrival Time (seconds)')

    plt.tight_layout()
    plt.show()

    # Returning DataFrame with basic statistics
    stats_df = df.describe()
    return stats_df



# Main function to orchestrate the module
def main(filename, aggregation_criteria):
    pcap_data = read_pcap(filename)
    extracted_data = extract_data(pcap_data)
    analysis_results = analyze_data(extracted_data)
    aggregated_data = aggregate_data(extracted_data, aggregation_criteria)
    formatted_results = format_results(aggregated_data)
    return formatted_results

if __name__ == "__main__":
    # filename = "example.pcap"
    filename = sys.argv[1]
    # aggregation_criteria = 'src_ip'  # Example criteria
    # results = main(filename, aggregation_criteria)
    # print(results)

    # df = analysis(filename)
    # print(df)

    # Example usage
    stats_df = pcap_analysis(filename)
    print(stats_df)

