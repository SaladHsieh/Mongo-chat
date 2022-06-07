FROM node:14
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . /app

ENV MONGODB_USERNAME=admin
ENV MONGODB_PASSWORD=EXWPWD1234

# --- for production ---
RUN npm run build
RUN rm -rf src/
CMD [ "npm", "run", "start" ]
# --- for production end ---

# # --- for development ---
# CMD [ "npm", "run", "dev" ]
# # --- for development end ---