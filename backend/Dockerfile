FROM python:3.14.4
LABEL maintainer="Luca Bacchi <bacchilu@gmail.com> (https://github.com/bacchilu)"

ARG USER_ID
ARG GROUP_ID
ARG USERNAME=appuser

RUN groupadd -g ${GROUP_ID} ${USERNAME}
RUN useradd -m -u ${USER_ID} -g ${USERNAME} ${USERNAME}

WORKDIR /app

COPY backend /app/backend

RUN chown -R ${USERNAME}:${USERNAME} /app
USER ${USERNAME}

ENV PATH="$PATH:/home/$USERNAME/.local/bin"
RUN pip3 install -r backend/requirements.txt

CMD ["fastapi", "dev", "backend/api/app.py", "--host", "0.0.0.0"]

EXPOSE 8000
