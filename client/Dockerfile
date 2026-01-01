FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build Frontend jadi HTML/CSS/JS statis
RUN npm run build

# Expose port (Vite preview biasanya 4173)
EXPOSE 4173

# Jalankan mode preview (ringan)
CMD ["npm", "run", "preview", "--", "--host"]