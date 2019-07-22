#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

def set_box_color(bp, color):
    plt.setp(bp['boxes'], color=color)
    plt.setp(bp['boxes'], fill=False)
    plt.setp(bp['whiskers'], color=color)
    plt.setp(bp['caps'], color=color)
    plt.setp(bp['medians'], color=color)

path = sys.argv[1]
plt.title('publishing topics as fast as possible')
plt.xlabel('time in seconds')
plt.ylabel('messages per second per client')

for idx, filename in enumerate(glob.glob(path + "-*.csv")):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['name', 'time', 'msgs'], dtype=None)
    data = np.sort(data, order='time')
    last_time = data['time'][0]
    segments = [0]
    for i, time in enumerate(data['time']):
        if time - last_time > 5000:
            segments.append(i)
        last_time = time
    segments.append(len(data['time']) - 1)
    segments = list(zip(segments[:-1], segments[1:]))
    segments = np.array([data[start:end]['msgs'] for start, end in segments])

    bplot = plt.boxplot(
        segments,
        positions=np.array(range(len(segments))) * 3.0 + (-0.5 + 0.5 * idx),
        sym='x',
        vert=True,
        patch_artist=True,
        widths=0.45,
        whis=[0, 100]
    )
    set_box_color(bplot, 'C{}'.format(idx))
    plt.plot([], c="C{}".format(idx), label=router)

ticks = [20, 40, 60, 80, 100]
plt.xticks(range(0, len(ticks) * 3, 3), ticks)
plt.xlim(-3, len(ticks) * 3)
plt.legend(loc='best')
plt.savefig(path + ".png")
