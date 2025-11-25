# syntax=docker/dockerfile:1

FROM node:25.1-bookworm

# add build argument for the port with default value
ARG STREAMLIT_FLOW_PORT=3001
ENV STREAMLIT_FLOW_PORT=${STREAMLIT_FLOW_PORT}

WORKDIR /app
COPY . ./

# Install Python
RUN apt-get update && apt-get upgrade -y && apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip3 install -r /app/requirements.txt --break-system-packages

RUN npm install --prefix streamlit_flow/frontend

EXPOSE ${STREAMLIT_FLOW_PORT}

RUN chmod +x start.sh
CMD ["./start.sh"]
