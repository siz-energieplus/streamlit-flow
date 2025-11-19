# syntax=docker/dockerfile:1

FROM node:25.1-bookworm

# add build argument for the port with default value
ARG PORT=3011
ENV PORT=$PORT

WORKDIR /app
COPY . ./

# Install Python
RUN apt-get update && apt-get upgrade -y && apt-get install -y python3
RUN apt-get install -y python3-pip
# RUN apt install python3-streamlit
RUN pip3 install -r /app/requirements.txt --break-system-packages

RUN npm install --prefix streamlit_flow/frontend

EXPOSE ${PORT}

RUN chmod +x start.sh
CMD ["./start.sh"]
