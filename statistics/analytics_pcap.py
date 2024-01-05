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
from scapy.all import rdpcap, IP, TCP
import pandas as pd

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
    if create_plots:
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

if __name__ == "__main__":
    # filename = "example.pcap"
    filename = sys.argv[1]

    stats_df = pcap_analysis(filename)
    print(stats_df)
