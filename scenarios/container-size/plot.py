#! /usr/bin/env python3

import sys
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

def mib(x, pos):
    return '{:10.1f} MiB'.format(x / 1024 / 1024)

formatter = FuncFormatter(mib)

filename = sys.argv[1]
fig, ax = plt.subplots()
ax.yaxis.set_major_formatter(formatter)

data = np.genfromtxt(filename + '.csv', delimiter=',', names=['name', 'size'], dtype=None)
x = np.arange(len(data['name']))
bars = plt.bar(x, data['size'])
for bar in bars:
    h = bar.get_height()
    ax.annotate(
        '{:10.1f} MiB'.format(h / 1024 / 1024),
        xy=(bar.get_x() + 0.05, h + 1024 * 1024 * 4),
    )
plt.xticks(x, [x.decode('utf-8') for x in data['name']])
plt.title('container size of tested routers/brokers')
plt.ylabel('size in MiB')
plt.savefig(filename + ".png")
