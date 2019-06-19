#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

path = sys.argv[1]
plt.title('messages per second when increasing replica count every 5 minutes')
plt.xlabel('time in minutes')
plt.ylabel('messages per second')

for filename in glob.glob(path + "-*.csv"):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['name', 'time', 'msgs'], dtype=None)
    t0 = min(data['time'])
    times = np.array([(t - t0) / 1000 / 60 for t in data['time']])
    plt.plot(times, data['msgs'], label=router, marker='.', linestyle='')

plt.legend(loc='best')
plt.savefig(path + ".png")
