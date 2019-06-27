#! /usr/bin/env python3

import re
import sys
import glob
import numpy as np
import matplotlib.pyplot as plt

path = sys.argv[1]

for idx, filename in enumerate(glob.glob(path + "-*.csv")):
    router = re.match(r".*-(\w+).csv", filename).group(1)

    data = np.genfromtxt(filename, delimiter=',', names=['name', 'time', 'msgs'], dtype=None)
    t0 = min(data['time'])
    times = np.array([(t - t0) / 1000 / 60 for t in data['time']])
    plt.clf()
    plt.title(router)
    plt.xlabel('time in minutes')
    plt.ylabel('messages per second per client')
    plt.ylim((0, 1000))
    plt.plot(times, data['msgs'], label=router, marker=',', linestyle='', color="C{}".format(idx))
    plt.savefig("{}-{}.png".format(path, router))
