import numpy as np
from matplotlib import pyplot as plt
import csv

# Create Data.
center1 = (0, 2)
center2 = (9, 9)
center3 = (3, 8)
distanceBig = 8
distanceSmall = 3

x1 = np.random.uniform(center1[0], center1[0] + distanceSmall, size=(50,))
y1 = np.random.normal(center1[1], distanceSmall, size=(50,))

x2 = np.random.uniform(center2[0], center2[0] + distanceBig, size=(100,))
y2 = np.random.normal(center2[1], distanceBig, size=(100,))

x3 = np.random.uniform(center3[0], center3[0] + distanceBig, size=(100,))
y3 = np.random.normal(center3[1], distanceBig, size=(100,))

label1 = [0] * len(x1)
label2 = [1] * (len(x2)+len(x3))

# Plot points.
plt.scatter(x1, y1)
plt.scatter(x2, y2)
plt.scatter(x3, y3)
plt.show()

with open('salmon.csv', 'w') as file:
    csvwriter = csv.writer(file)
    csvwriter.writerow(['length', 'diameter', 'young'])
    for i in range(len(x1)):
        csvwriter.writerow([round(x1[i], 2), round(y1[i], 2), 1])
    for n in range(len(x2)):
        csvwriter.writerow([round(x2[n], 2), round(y2[n], 2), 0])
        csvwriter.writerow([round(x3[n], 2), round(y3[n], 2), 0])
