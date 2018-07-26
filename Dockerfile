FROM cypress/browsers:chrome67
# Install deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
    gnupg \
  --no-install-recommends \
  && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y \
  google-chrome-stable \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && ln -s /usr/bin/google-chrome-stable /usr/bin/chrome

RUN apt-get update && apt-get install -y \
  #build-essential \
  python \
  python-dev \
  unzip \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Install aws-cli
RUN echo "Fetching awscli installer..." && curl -so "awscli-bundle.zip" "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" && \
    echo "Unpacking..." && unzip awscli-bundle.zip > /dev/null && \
    echo "Installing awscli..." && ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws > /dev/null && \
    echo "Done" && rm -rf awscli-bundle awscli-bundle.zip

RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome && chown -R chrome:chrome /home/chrome
RUN mkdir /app && chown chrome:chrome /app
USER chrome
WORKDIR /app

COPY --chown=chrome:chrome package.json package-lock.json ./
RUN npm install
RUN mkdir -p cypress/integration
COPY --chown=chrome:chrome cypress/integration/ cypress/integration/
COPY --chown=chrome:chrome docker-scripts/entrypoint.sh docker-scripts/cypress.json ./
ENTRYPOINT /app/entrypoint.sh