#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt

def set_box_color(bp, color):
    plt.setp(bp['boxes'], color=color)
    plt.setp(bp['boxes'], fill=False)
    plt.setp(bp['whiskers'], color=color)
    plt.setp(bp['caps'], color=color)
    plt.setp(bp['medians'], color=color)

path = sys.argv[1]

for idx, filename in enumerate(glob.glob(path + "-*.csv")):
    router = re.match(r".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['name', 'time', 'msgs'], dtype=None)
    data = np.sort(data, order='time')
    segments = [0]
    last_time = data['time'][0]
    for i, time in enumerate(data['time']):
        if time - last_time > 5000:
            segments.append(i)
        last_time = time
    segments.append(len(data['time']) - 1)
    segments = list(zip(segments[:-1], segments[1:]))
    segments = np.array([data[start:end]['msgs'] for start, end in segments])

    bplot = plt.boxplot(
        segments,
        positions=np.array(range(len(segments))) * 2.0 + (-0.5 + 0.5 * idx),
        sym='x',
        vert=True,
        patch_artist=True,
        widths=0.45,
        whis=[0, 100]
    )
    set_box_color(bplot, "C{}".format(idx))

plt.plot([], c='C0', label='Autobahnkreuz')
plt.plot([], c='C1', label='Emitter')
plt.legend()

ticks = ["{}:{}".format(i, i*2) for i in range(1, 11)]
plt.xticks(range(0, len(ticks) * 2, 2), ticks)
plt.xlim(-2, len(ticks) * 2)
plt.title('messages per second for several router and client configurations')
plt.xlabel('router instances : clients connected')
plt.ylabel('messages per second per client')
plt.ylim((0, 1000))
plt.savefig("{}.png".format(path))
