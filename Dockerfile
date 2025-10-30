# syntax=docker/dockerfile:1

FROM node:25.1-bookworm

# add build argument for the port with default value
ARG PORT=3011
ENV PORT=$PORT

WORKDIR /app
COPY . ./

RUN npm install --prefix streamlit_flow/frontend

EXPOSE ${PORT}

RUN chmod +x start.sh
CMD ["./start.sh"]
