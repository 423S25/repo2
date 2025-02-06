FROM node:22.0.0 AS app

WORKDIR /app
COPY package.json .
# COPY postcss.config.cjs .

RUN npm install
RUN npm install tailwindcss --save-dev
RUN npm ci

COPY . .
RUN npm run build 
ENV NODE_ENV production 

EXPOSE 5173
CMD ["npm", "run", "dev"]
