FROM node:25.0.0

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG USERNAME=appuser

RUN userdel -f node && if getent group node ; then groupdel node; fi
RUN groupadd -g ${GROUP_ID} ${USERNAME}
RUN useradd -ms /bin/bash -l -u ${USER_ID} -g ${USERNAME} ${USERNAME}
RUN install -d -m 0755 -o ${USERNAME} -g ${USERNAME} /home/${USERNAME}

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
