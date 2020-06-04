import numpy as np
import matplotlib.pyplot as plt
from sklearn import svm
import csv

# Loading csv data.
with open('../data/iris.csv') as file:
    reader = csv.DictReader(file)
    X = []
    y = []
    for row in reader:
        if row['species'] == 'setosa':
            label = 1
        else:
            label = -1

        X.append([float(row['sepal_length']), float(row['sepal_width'])])
        y.append(label)

# Create support vector classificator.
clf = svm.SVC(kernel='linear', C=10, tol=1E-3)
clf.fit(X, y)

# Plot data points.
plotX1 = []
plotX2 = []
for i in range(len(X)):
    plotX1.append(X[i][0])
    plotX2.append(X[i][1])

plt.scatter(plotX1, plotX2, c=y, s=30, cmap=plt.cm.Paired)

# Plot the decision function.
ax = plt.gca()
xlim = ax.get_xlim()
ylim = ax.get_ylim()

# Create grid to evaluate model.
xx = np.linspace(xlim[0], xlim[1], 30)
yy = np.linspace(ylim[0], ylim[1], 30)
YY, XX = np.meshgrid(yy, xx)
xy = np.vstack([XX.ravel(), YY.ravel()]).T
Z = clf.decision_function(xy).reshape(XX.shape)

# Plot decision boundary and margins
ax.contour(XX, YY, Z, colors='k', levels=[-1, 0, 1], alpha=0.5, linestyles=['--', '-', '--'])

# Plot support vectors.
ax.scatter(clf.support_vectors_[:, 0], clf.support_vectors_[:, 1], s=100, linewidth=1, facecolors='none', edgecolors='k')

titlestring = "Linear separated Iris data set\nWeights: [" + str(round(clf.coef_[0][0], 3)) + ", " + str(round(clf.coef_[0][1], 3)) + "]\nBias: " + str(round(clf.intercept_[0], 3)) + "\nSupport Vectors:"
for j in range(len(clf.support_vectors_)):
    titlestring += " (" + str(round(clf.support_vectors_[j][0], 3)) + "; " + str(round(clf.support_vectors_[j][1], 3)) + ")\n"

plt.title(titlestring)
plt.xlabel("Sepal length")
plt.ylabel("Sepal width")
plt.savefig("svm_iris.png")
plt.show()
