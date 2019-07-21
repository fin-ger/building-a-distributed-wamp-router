#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt
from collections import OrderedDict
from matplotlib.ticker import FuncFormatter

def mib(x, pos):
    return '{:10.1f} MiB'.format(x / 1024)

formatter = FuncFormatter(mib)

path = sys.argv[1]
fig, ax = plt.subplots()
ax.yaxis.set_major_formatter(formatter)
plt.title('RAM usage scenario')
plt.xlabel('clients connected to the router')
plt.ylabel('RAM usage in MiB')

for filename in glob.glob(path + "-*.csv"):
    router = re.match(".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['time', 'name', 'ram'], dtype=None)
    rel = data['time'][0]

    ram_usage = {x - rel: 0 for x in data['time']}
    for time, name, ram in data:
        ram_usage[time - rel] += int(ram[:-2])
    ram_usage = OrderedDict(sorted(ram_usage.items()))

    times = np.array(list(ram_usage.keys()))
    ram_usage = np.array(list(ram_usage.values()))

    last_time = times[0]
    segments = [0]
    for idx, time in enumerate(times):
        if time - last_time > 30:
            segments.append(idx)
        last_time = time
    segments.append(len(times) - 1)
    segments = list(zip(segments[:-1], segments[1:]))

    plots = []
    for start, end in segments:
        ts = times[start:end]
        rus = ram_usage[start:end]

        to_remove = []
        for idx, usage in enumerate(rus):
            # process not running / failed
            if usage < 500:
                to_remove.append(idx)

        plots.append(np.array([u for i, u in enumerate(rus) if i not in to_remove]))
    plt.violinplot(np.array(plots), showmeans=True, showextrema=False)

ticks = [0, 4, 8, 12, 16, 20]
plt.xticks(range(0, len(ticks)), ticks)
plt.plot([], c='C0', label='Autobahnkreuz')
plt.plot([], c='C1', label='Crossbar')
plt.plot([], c='C2', label='Emitter')
plt.legend(loc='center right')
plt.savefig(path + ".png")
