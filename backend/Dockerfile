# Use the official Python image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt to the working directory
COPY requirements.txt .

# Install the backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the API port
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
