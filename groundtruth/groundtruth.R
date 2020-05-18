#install.packages("ggplot2")
library("ggplot2")

# Ground Truth program to validate our implementation of SVM.

# Load data form file.
#data <- read.csv2("..\\data\\iris.csv", header=TRUE, sep=",")

# Load dummy data from test_svm.js. ToDo: export to file.
x1 <- c(4,4,7,8,9,9,10,1,2,2,4,4,7,8)
x2 <- c(8,10,10,7,6,7,10,3,5,7,4,6,5,3)
labels <- c(1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1)
data <- data.frame(cbind(x1,x2,labels))
rm(x1,x2,labels)


# SVM.



# Results.
ggplot(data=data, aes(data$x1, data$x2, colour=data$labels)) + 
  geom_point(size=3) + 
  labs(x="x1", y="x2")
