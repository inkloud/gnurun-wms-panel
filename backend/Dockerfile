FROM python:3.13.7
LABEL maintainer="Luca Bacchi <bacchilu@gmail.com> (https://github.com/bacchilu)"

ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
ARG USERNAME=python
ARG GROUPNAME=python

RUN groupadd -g ${LOCAL_GID} ${GROUPNAME}
RUN useradd -m -u ${LOCAL_UID} -g ${GROUPNAME} ${USERNAME}

USER ${USERNAME}

WORKDIR /app

COPY . .

ENV PATH="$PATH:/home/$USERNAME/.local/bin"
RUN pip3 install -r requirements.txt

CMD ["fastapi", "dev", "main.py", "--host", "0.0.0.0"]

EXPOSE 8000