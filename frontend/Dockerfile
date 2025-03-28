FROM node:23.9.0 AS app

WORKDIR /app
COPY package.json .
# COPY postcss.config.cjs .

RUN npm install
# RUN npm install tailwindcss --save-dev
RUN npm ci

COPY . .
RUN npm run build 
ENV NODE_ENV production 

EXPOSE 5173
CMD ["npm", "run", "dev"]; 
ARG PRODUCTION
# FROM nginx:alpine && \
# WORKDIR /app && \
# RUN apk --no-cache add curl && \
# COPY ./nginx.config /etc/nginx/conf.d/default.conf && \
# COPY --from=app /app/public /usr/share/nginx/html && \
# COPY --from=app /app/dist /usr/share/nginx/html; \
# Copy files from the build stage to the smaller base image
