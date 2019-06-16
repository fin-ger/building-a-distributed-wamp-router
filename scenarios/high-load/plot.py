#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

path = sys.argv[1]
plt.title('latency when publishing topics with 10 clients')
plt.xlabel('time in seconds')
plt.ylabel('latency in µs')

for filename in glob.glob(path + "-*.csv"):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['time', 'name', 'latency'], dtype=None)
    plt.plot(data['time'], data['latency'], label=router)

plt.legend(loc='best')
plt.savefig(path + ".png")
