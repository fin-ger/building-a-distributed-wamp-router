#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt

path = sys.argv[1]
plt.title('availability with 10 clients trying to get a connection withing 100ms')
plt.xlabel('time in minutes')
plt.ylabel('availability in %')

for filename in glob.glob(path + "-*.csv"):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['name', 'time', 'online'], dtype=None)
    data.sort(order=['time'])
    counter = { x: 0 for x in data['name'] }
    times = []
    onlines = []
    for name, time, online in data:
        times.append((time - data['time'][0]) / 1000 / 60)
        counter[name] = online
        onlines.append(sum(counter.values()))

    m = max(onlines)
    onlines = np.array([x / m * 100 for x in onlines])
    times = np.array(times)
    plt.plot(times, onlines, label=router)

plt.legend(loc='best')
plt.savefig(path + ".png")
