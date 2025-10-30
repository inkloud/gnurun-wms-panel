FROM node:25.1.0
LABEL maintainer="Luca Bacchi <bacchilu@gmail.com> (https://github.com/bacchilu)"

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG USERNAME=appuser

RUN userdel -f node && if getent group node ; then groupdel node; fi
RUN groupadd -g ${GROUP_ID} ${USERNAME}
RUN useradd -ms /bin/bash -l -u ${USER_ID} -g ${USERNAME} ${USERNAME}

WORKDIR /app

COPY . .

RUN chown -R ${USERNAME}:${USERNAME} /app
USER ${USERNAME}

RUN npm install

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

EXPOSE 5173

