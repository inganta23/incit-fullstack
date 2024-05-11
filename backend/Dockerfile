# Use Node.js version 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
