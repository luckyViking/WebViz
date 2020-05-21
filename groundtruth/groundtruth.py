import numpy as np
import matplotlib.pyplot as plt
from sklearn import svm

# ToDo: export dummy data to file.
X = np.array([[4, 8],
              [4, 10],
              [7, 10],
              [8, 7],
              [9, 6],
              [9, 7],
              [10, 10],
              [1, 3],
              [2, 5],
              [2, 7],
              [4, 4],
              [4, 6],
              [7, 5],
              [8, 3]])
y = np.array([1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1])

# Create support vector classificator.
clf = svm.SVC(kernel='linear', C=10, tol=1E-3)
clf.fit(X, y)

# Plot data points.
plt.scatter(X[:, 0], X[:, 1], c=y, s=30, cmap=plt.cm.Paired)

ax = plt.gca()
xlim = ax.get_xlim()
ylim = ax.get_ylim()

# create grid to evaluate model
xx = np.linspace(xlim[0], xlim[1], 30)
yy = np.linspace(ylim[0], ylim[1], 30)
YY, XX = np.meshgrid(yy, xx)
xy = np.vstack([XX.ravel(), YY.ravel()]).T
Z = clf.decision_function(xy).reshape(XX.shape)

# plot decision boundary and margins
ax.contour(XX, YY, Z, colors='k', levels=[-1, 0, 1], alpha=0.5, linestyles=['--', '-', '--'])
# plot support vectors
ax.scatter(clf.support_vectors_[:, 0], clf.support_vectors_[:, 1], s=100, linewidth=1, facecolors='none',
           edgecolors='k')
plt.title("Linear seperated Data points with Hyperplanes")
plt.xlabel("x1")
plt.ylabel("x2")
# plt.savefig("svm.png")
plt.show()
