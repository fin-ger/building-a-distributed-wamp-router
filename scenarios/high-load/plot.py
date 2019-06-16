#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

def mib(x, pos):
    return '{:10.1f} MiB'.format(x / 1024)

formatter = FuncFormatter(mib)

path = sys.argv[1]
fig, ax = plt.subplots()
ax.yaxis.set_major_formatter(formatter)
plt.title('RAM usage with 10 clients sending publications every 100ms')
plt.xlabel('time in seconds')
plt.ylabel('RAM usage in MiB')

for filename in glob.glob(path + "-*.csv"):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['time', 'name', 'ram'], dtype=None)
    rel = data['time'][0]
    ram_usage = { x - rel: 0 for x in data['time'] }
    for time, name, ram in data:
        ram_usage[time - rel] += int(ram[:-2])

    times = np.array(list(ram_usage.keys()))
    ram_usage = np.array(list(ram_usage.values()))
    plt.plot(times, ram_usage, label=router)

plt.legend(loc='best')
plt.savefig(path + ".png")
