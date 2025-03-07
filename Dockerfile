FROM node:latest

WORKDIR /app

COPY package* .
COPY ./prisma .

RUN npm install 

RUN npx prisma generate

COPY . .

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]